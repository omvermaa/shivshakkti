import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Assign roles when the token is created
    async jwt({ token, user }) {
      if (user) {
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
          : [];
          
        token.role = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "user";
      }
      return token;
    },
    
    // Pass the role to the client session
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    // Default redirect for unauthenticated users accessing protected store routes
    signIn: '/user-login', 
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };