import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // You can add CredentialsProvider here later if you want email/password login
  ],
  callbacks: {
    // 1. When a JWT is created or updated, check if the email is an admin
    async jwt({ token, user }) {
      if (user) {
        // Fetch admin emails from .env and clean up any spaces
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
          : [];
          
        // Assign role based on email
        token.role = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "user";
      }
      return token;
    },
    
    // 2. Pass the role from the token to the client-side session
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    // Optional: Redirect here if a user tries to access a protected route
    signIn: '/login', 
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };