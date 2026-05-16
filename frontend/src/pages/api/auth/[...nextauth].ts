import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@leflambeau.edu.ht" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Appel à l'API backend pour authentification
          // Pour la démo, on simule une réponse de l'API Express
          if (credentials.email === "admin@leflambeau.edu.ht" && credentials.password === "password123") {
            return {
              id: "admin-1",
              name: "Admin System",
              email: "admin@leflambeau.edu.ht",
              role: "admin"
            };
          }

          return null;
        } catch (e) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Page de connexion personnalisée (à créer/modifier)
  },
  secret: process.env.NEXTAUTH_SECRET || "flambeau-super-secret-key"
};

export default NextAuth(authOptions);
