import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { RateLimiterMemory } from "rate-limiter-flexible";

import { connectDB } from "@/lib/db/connect";
import { getUserByEmail, verifyPassword } from "@/lib/auth/helpers";
import User from "@/lib/models/user.model";
import clientPromise from "@/lib/db/mongoClient";

const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} = process.env;

const isDev = NODE_ENV === "development";

// Rate limiter for credentials login
const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900, // Per 15 minutes
});

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
  const email = (profile.email || '').toLowerCase().trim();
  const userName = ('login' in profile ? profile.login : email.split('@')[0]).substring(0, 50);
  const name = (profile.name || email.split('@')[0]).substring(0, 100);
  const bio = ('bio' in profile ? profile.bio : '')?.substring(0, 200).trim();
  
  let city: string | undefined;
  let country: string | undefined;

  if ('location' in profile && profile.location) {
    const loc = profile.location.split(',').map((v: string) => v.trim());
    city = loc[0]?.substring(0, 50);
    country = loc[1]?.substring(0, 50);
  }

  const profileImage = ('picture' in profile && profile.picture) 
    || ('avatar_url' in profile && profile.avatar_url)
    || undefined;
  const socialLinks = {
    github: 'html_url' in profile ? profile.html_url : '',
    twitter: 'twitter_username' in profile ? `https://twitter.com/${profile.twitter_username}` : '',
    website: 'blog' in profile ? profile.blog : '',
  };

  return {
    email,
    userName,
    name,
    bio,
    city,
    country,
    profileImage,
    socialLinks,
  };
}

export const authOptions: NextAuthOptions = {
  // adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    // signIn: "/signin",   // custom sign-in page
    // error: "/signin",    // redirects OAuth/sign-in errors to the same sign-in page
    // we could also have:
    // signOut: "/signout", // custom sign-out page
    // newUser: "/welcome",  // page for new users after sign-up
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

          const isValid = await verifyPassword(credentials.password, user.password);
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
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email" }
      }
    }),
  ],
  callbacks: {
    // Redirect on success
    async redirect({ url, baseUrl }) {
      return baseUrl + "/"; // or dashboard/home
    },

    //  [1] signIn → Handle OAuth user creation/account linking
    async signIn({ user, account, profile }) {
      // Let adapter handle credentials login
      if (account?.provider === "credentials") return true;

      await connectDB();

      try {
        // Only for OAuth providers
        if (!account?.provider || (account.provider !== "google" && account.provider !== "github")) {
          return true;
        }

        const p = profile as OAuthProfile;

        // Validate email
        const email = user?.email ?? p.email;
        if (!email) {
          console.warn("[OAuth] provider returned no email");
          return false;
        }

        // Sanitize profile data
        const sanitizedData = sanitizeOAuthProfile(p);

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          // Account linking: Update provider if different or missing
          if (!existingUser.provider || existingUser.provider !== account.provider) {
            existingUser.provider = account.provider;
            
            // Update profile data if empty
            if (!existingUser.email && sanitizedData.email)
              existingUser.email = sanitizedData.email;
            if (!existingUser.userName && sanitizedData.userName)
              existingUser.userName = sanitizedData.userName || sanitizedData.email.split('@')[0].substring(0, 50);
            if (!existingUser.name && sanitizedData.name)
              existingUser.name = sanitizedData.name || sanitizedData.email.split('@')[0].substring(0, 100);
            if (!existingUser.profileImage && sanitizedData.profileImage)
              existingUser.profileImage = sanitizedData.profileImage;
            
            await existingUser.save();
            isDev && console.log(`[OAuth] Linked existing user to ${account.provider}`);
          }
        } else {
          // Create new OAuth user
          const newUser = await User.create({
            email: sanitizedData.email,
            provider: account.provider,
            name: sanitizedData.name,
            userName: sanitizedData.userName,
            profileImage: sanitizedData.profileImage,
            role: "investor",
            bio: sanitizedData.bio,
            socialLinks: sanitizedData.socialLinks,
            city: sanitizedData.city,
            country: sanitizedData.country,
          });

          isDev && console.log("[OAuth] Created new OAuth user:", newUser.email);
        }

        return true;
      } catch (error) {
        console.error("[OAuth] SignIn callback error:", error);
        return false;
      }
    },

    //  [2] JWT Callback - Handle token refresh and updates
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) 
        token.id = user.id;
        console.log("🚀 ~ [JWT] (token|user).id:", user.id)
        token.role = user.role;     
        console.log("🚀 ~ [JWT] (token|user).role:", user.role)

      // Refresh user data on session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };
        console.log(`🚀 ~ trigger === "update" && session:`, trigger === "update" && session)
      }

      // Handle OAuth token refresh (simplified example)
      if (account?.expires_at && Date.now() > account.expires_at * 1000) {
        try {
          // In practice, you'd implement token refresh logic here
          // This depends on the specific OAuth provider
          isDev && console.log("Token needs refresh for:", account.provider);
        } catch (error) {
          isDev && console.error("Token refresh failed:", error);
        }
      }

      return token;
    },

    //  [3] Session Callback
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        console.log("🚀 ~ [SESSION] token.id:", token.id)
        session.user.role = token.role as string;
        console.log("🚀 ~ [SESSION] token.role:", token.role)
        
        // Add session expiry info
        session.expires = token.exp as string;
      }
      
      return session;
    },
  },
  secret: NEXTAUTH_SECRET!,
  debug: isDev,
};