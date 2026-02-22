import GoogleProvider from "next-auth/providers/google";

import type { NextAuthOptions } from "next-auth";
import { apiService } from "../lib/api-client";

// バックエンドから返ってくるユーザー情報の共通型
interface BackendUser {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

// next-authの型を拡張
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: BackendUser;
  }
  interface User extends BackendUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: BackendUser;
    role?: string;
  }
}

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回サインイン時のみ実行
      if (account && user) {
        try {
          // Googleからの認証には通常 id_token を使用します
          // id_token がない場合は access_token を使用
          const authPayload = account.id_token || account.access_token;

          if (!authPayload) {
            throw new Error("No token available from Google");
          }

          const backendData = await apiService.googleAuth(authPayload);

          // バックエンドから返された情報をトークンに保存
          token.accessToken = backendData.token; // バックエンドが発行したJWT
          token.user = backendData.user;         // バックエンドが返したユーザー情報

        } catch (error) {
          console.error("Error during backend authentication:", error);
          // エラーが発生したことをトークンに記録
          throw new Error("Backend authentication failed.");
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
