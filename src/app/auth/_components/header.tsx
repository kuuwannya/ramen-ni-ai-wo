"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [user, setUser] = useState<{ name?: string; image?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // クライアントサイドでのみ実行
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const handleLogin = () => {
    router.push("/login");
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
        {user ? (
          <>
            {user.image && (
              <li>
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </li>
            )}
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
