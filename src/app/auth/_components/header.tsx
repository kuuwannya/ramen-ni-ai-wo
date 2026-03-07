"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) {
      setUserImage(storedImage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userImage");
    setUserImage(null);
    router.push("/");
    router.refresh();
  };

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid profile email";
    const responseType = "code";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-4xl font-bold">
          <Image
            src="/logo.png"
            alt="ラーメンに愛(AI)を！"
            width={100}
            height={100}
          />
        </Link>
      </div>
      <ul className="flex items-center space-x-4">
        {userImage ? (
          <>
            <li>
              <Image
                src={userImage}
                alt="User"
                width={40}
                height={40}
                className="rounded-full"
              />
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-blue-500 px-4 py-[7px] text-white hover:bg-gray-600"
              >
                ログアウト
              </button>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={handleLogin}
              className="rounded-lg bg-blue-500 px-4 py-[7px] text-white hover:bg-gray-600"
            >
              ログイン
            </button>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
