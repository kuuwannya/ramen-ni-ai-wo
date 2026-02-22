"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      router.push("/");
    }
  }, [router]);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid profile email";
    const responseType = "code";
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = googleAuthUrl;
  };

  if (isLoggedIn) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-xs space-y-6 rounded bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-center">ログイン</h1>
        <button
          onClick={handleLogin}
          type="button"
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 transition-colors"
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
