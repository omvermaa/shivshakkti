import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Import your database connection and User model
// Note: Adjust the relative paths (../../../../) if your folders are structured differently
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // 1. Intercept the login to save the user to MongoDB
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const { name, email, image } = user;
          
          await connectMongoDB();
          
          // Check if the user already exists in the database
          const userExists = await User.findOne({ email });
          
          // If they don't exist, create a new user document
          if (!userExists) {
            // Determine if this new user is an admin based on the .env file
            const adminEmails = process.env.ADMIN_EMAILS
              ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
              : [];
            
            const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

            // Save to database
            await User.create({
              name,
              email,
              image,
              role,
            });
          }
          
          return true; // Allow them to log in
        } catch (error) {
          console.error("Error saving user to database: ", error);
          return true; // We still return true so the user isn't blocked from the site if the DB connection is slow
        }
      }
      return true;
    },

    // 2. Assign roles when the session token is created
    async jwt({ token, user }) {
      if (user) {
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
          : [];
          
        token.role = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "user";
      }
      return token;
    },
    
    // 3. Pass the role down to the client-side session
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/user-login', 
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };