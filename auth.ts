import { signInSchema } from "@/lib/zod";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        let user = null;

        //validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }

        user = {
          id: "1",
          name: "Player 1",
          email: "player1@mail.com",
        };

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],

  // mencegah akses ke login page dan redirect ke "/ " ketika sudah login
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/login") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return !!auth;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
