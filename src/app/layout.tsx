import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { nextAuthOptions } from "../utils/next-auth.options";
import NextAuthProvider from "../components/providers/providers";
import Header from "../app/auth/_components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ラーメンに愛(AI)を！",
  description:
    "隠れた好みをAIが引き出します。あなただけの特別なラーメン選びを今すぐ体験しましょう！",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(nextAuthOptions);
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          <Header session={session} />
          {children}{gaId && <GoogleAnalytics gaId={gaId} />}
        </NextAuthProvider>
      </body>
    </html>
  );
}
