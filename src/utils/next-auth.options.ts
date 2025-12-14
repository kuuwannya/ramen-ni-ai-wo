import GoogleProvider from "next-auth/providers/google";

import type { NextAuthOptions } from "next-auth";

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
    jwt: async ({ token, user, account, profile }) => {
      // 注意: トークンをログ出力してはダメです。
      console.log("in jwt", { user, token, account, profile });

      if (user) {
        token.user = user;
        // 拡張された型定義により、anyキャストなしでuser.roleにアクセス
        token.role = user.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log("in session", { session, token });
      // 不要な式なので削除
      // token.accessToken;
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
