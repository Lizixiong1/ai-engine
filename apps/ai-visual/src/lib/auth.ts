// NextAuth.js 配置占位文件
// 实际项目中可以在这里抽离 shared auth options。

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize() {
        return {
          id: "1",
          email: "1",
          name: "1",
          image: "1",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.Id;
      }

      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
