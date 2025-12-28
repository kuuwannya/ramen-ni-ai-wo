"use client";

import Image from "next/image";
import Link from "next/link";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

const Header = ({ session }: { session: Session | null }) => {
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
        {session ? (
          <>
            <li>
              <Image
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
                width={40}
                height={40}
                className="rounded-full"
              />
            </li>
            <li>
              <button
                onClick={() => signOut()}
                className="rounded-lg bg-blue-500 px-4 py-[7px] text-white hover:bg-gray-600"
              >
                ログアウト
              </button>
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={() => signIn("google")}
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
