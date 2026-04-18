"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  userImage: string | null;
};

const HeaderActions = ({ userImage }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/callback`;
    const scope = "openid profile email";
    const responseType = "code";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = googleAuthUrl;
  };

  return userImage ? (
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
          className="rounded-lg bg-orange-500 px-4 py-[7px] text-sm font-bold text-white hover:bg-orange-600"
        >
          ログアウト
        </button>
      </li>
    </>
  ) : (
    <li>
      <button
        onClick={handleLogin}
        className="rounded-lg bg-orange-500 px-4 py-[7px] text-sm font-bold text-white hover:bg-orange-600"
      >
        ログイン
      </button>
    </li>
  );
};

export default HeaderActions;
