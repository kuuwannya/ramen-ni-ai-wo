import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import HeaderActions from "./header-actions";

const Header = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let userImage: string | null = null;

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/current_user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        userImage = data.image_url ?? data.image ?? null;
      }
    } catch {
      // 取得失敗時は未ログイン扱い
    }
  }

  return (
    <header className="flex items-center justify-between bg-gray-50 p-4 shadow-md">
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
        <li>
          <Link
            href="/shops"
            className="inline-block rounded-lg bg-orange-500 px-4 py-[7px] text-sm font-bold text-white hover:bg-orange-600"
          >
            店舗一覧
          </Link>
        </li>
        <HeaderActions userImage={userImage} />
      </ul>
    </header>
  );
};

export default Header;
