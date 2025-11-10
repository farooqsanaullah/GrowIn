import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/db/connect";
import { getUserByEmail, verifyPassword } from "@/lib/auth/helpers";
import clientPromise from "@/lib/db/mongoClient";

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt", // we can also use 'database' if we want DB sessions
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB(); // ensure DB connection

        if (!credentials?.email || !credentials?.password) return null;

        isDev && console.log("[Credentials Login Attempt]", credentials.email);

        const user = await getUserByEmail(credentials.email);
        if (!user) return null;

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Returning user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
    // Future OAuth providers can be added here
    // e.g., GoogleProvider({ clientId, clientSecret })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
