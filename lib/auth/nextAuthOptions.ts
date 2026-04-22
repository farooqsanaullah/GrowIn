import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { connectDB } from "@/lib/db/connect";
import {
  generateUniqueUsername,
  verifyPassword,
  getUserByEmail,
} from "@/lib/helpers/backend";
import User from "@/lib/models/user.model";

const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} = process.env;

const isDev = NODE_ENV === "development";

// 5 attempts per 15 minutes
const rateLimiter = new RateLimiterMemory({ points: 5, duration: 900 });

interface GoogleProfile {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
  locale?: string;
}

interface GithubProfile {
  id: string;
  login: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  html_url?: string;
  twitter_username?: string;
  blog?: string;
  location?: string;
}

type OAuthProfile = GoogleProfile | GithubProfile;

// Input validation and sanitization
function sanitizeOAuthProfile(profile: OAuthProfile) {
  const email = (profile.email || "").toLowerCase().trim();
  const userName = (
    "login" in profile ? profile.login : email.split("@")[0]
  ).substring(0, 50);
  const name = (profile.name || email.split("@")[0]).substring(0, 100);
  const bio = ("bio" in profile ? profile.bio : "")?.substring(0, 200).trim();

  let city: string | undefined;
  let country: string | undefined;

  if ("location" in profile && profile.location) {
    const loc = profile.location.split(",").map((v: string) => v.trim());
    city = loc[0]?.substring(0, 50);
    country = loc[1]?.substring(0, 50);
  }

  const profileImage =
    ("picture" in profile && profile.picture) ||
    ("avatar_url" in profile && profile.avatar_url) ||
    undefined;

  // Only include social links if they exist (avoid empty strings for validation)
  const socialLinks: Partial<{
    github: string;
    twitter: string;
    website: string;
  }> = {};
  if ("html_url" in profile && profile.html_url) {
    socialLinks.github = profile.html_url;
  }
  if ("twitter_username" in profile && profile.twitter_username) {
    socialLinks.twitter = `https://twitter.com/${profile.twitter_username}`;
  }
  if ("blog" in profile && profile.blog) {
    socialLinks.website = profile.blog;
  }

  return {
    email,
    userName,
    name,
    bio,
    city,
    country,
    profileImage,
    socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
    updateAge: 60 * 60, // renew session every single hour
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Rate limiting
        try {
          await rateLimiter.consume(credentials.email);
        } catch (rateLimitError) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        await connectDB();
        isDev && console.log("[Credentials Auth] Attempt", credentials.email);

        try {
          const user = await getUserByEmail(credentials.email);
          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("[Credentials Auth] error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl + "/redirect";
    },

    async signIn({ user, account, profile }) {
      // Let adapter handle credentials login
      if (account?.provider === "credentials") return true;

      await connectDB();

      try {
        // Only handle google/github
        if (
          !["google", "github"].includes(account?.provider || "") ||
          !account?.provider
        )
          return true;

        const p = profile as OAuthProfile;

        const email = user?.email ?? p.email;
        if (!email) return false;

        const sanitizedData = sanitizeOAuthProfile(p);
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          if (
            !existingUser.provider ||
            existingUser.provider !== account?.provider
          ) {
            existingUser.provider = account?.provider;
          }

          // Fill missing fields only (DO NOT override user custom data)
          existingUser.userName ||= await generateUniqueUsername(
            sanitizedData.userName,
            sanitizedData.email
          );
          existingUser.name ||= sanitizedData.name;
          existingUser.profileImage ||= sanitizedData.profileImage;

          await existingUser.save();

          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.name = existingUser.name;
          user.email = existingUser.email;
          
          return true;
        }
        const uniqueUserName = await generateUniqueUsername(
          sanitizedData.userName,
          sanitizedData.email
        );
        const newUser = await User.create({
          email: sanitizedData.email,
          provider: account?.provider,
          name: sanitizedData.name,
          userName: uniqueUserName,
          profileImage: sanitizedData.profileImage,
          role: "investor",
          bio: sanitizedData.bio,
          socialLinks: sanitizedData.socialLinks,
          city: sanitizedData.city,
          country: sanitizedData.country,
        });

        user.id = newUser._id.toString();
        user.role = newUser.role;
        user.name = newUser.name;
        user.email = newUser.email;

        return true;
      } catch (err) {
        console.error("[OAuth] SignIn callback error:", err);
        return false;
      }
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.expires = token.exp as string;
      }

      return session;
    },
  },
  secret: NEXTAUTH_SECRET!,
};
