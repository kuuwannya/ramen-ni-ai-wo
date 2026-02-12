import GoogleProvider from "next-auth/providers/google";

import type { NextAuthOptions } from "next-auth";
import { apiService } from "../lib/api-client";

// next-authの型を拡張して、カスタムプロパティ (role) を含める
declare module "next-auth" {
  interface User {
    role?: string; // ユーザーオブジェクトにroleプロパティを追加
  }
  interface Session {
    user?: User; // セッションのユーザーオブジェクトが拡張されたUser型を使用するように
  }
  interface JWT {
    user?: User; // JWTのユーザーオブジェクトが拡張されたUser型を使用するように
    role?: string;
    accessToken?: string; // JWTにaccessTokenプロパティを追加
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
      // 初回サインイン時のみ、accountオブジェクトにGoogleのアクセストークンが含まれる
      if (account && user) {
        try {
          // account.access_token がGoogleから取得したトークン
          const googleAccessToken = account.access_token;

          const backendData = await apiService.googleAuth(googleAccessToken as string);

          // バックエンドから返された情報をnext-authのトークンに格納する
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
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
};
