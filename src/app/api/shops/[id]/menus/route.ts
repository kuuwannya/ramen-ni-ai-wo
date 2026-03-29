import { NextRequest, NextResponse } from "next/server";

const MENUS_BY_SHOP: Record<number, { id: number; name: string; genre_name: string; noodle_name: string; soup_name: string; image_url: string }[]> = {
  1: [
    { id: 101, name: "昭和（むかし）ラーメン", genre_name: "ラーメン", noodle_name: "細麺", soup_name: "豚骨", image_url: "https://placehold.co/400x300?text=Ramen+1" },
    { id: 102, name: "博多ラーメン",           genre_name: "ラーメン", noodle_name: "極細麺", soup_name: "豚骨", image_url: "https://placehold.co/400x300?text=Ramen+2" },
    { id: 103, name: "チャーシュー麺",         genre_name: "ラーメン", noodle_name: "細麺", soup_name: "豚骨", image_url: "https://placehold.co/400x300?text=Ramen+3" },
  ],
  2: [
    { id: 201, name: "一蘭ラーメン",           genre_name: "ラーメン", noodle_name: "細麺", soup_name: "豚骨", image_url: "https://placehold.co/400x300?text=Ichiran" },
  ],
  3: [
    { id: 301, name: "黒亭ラーメン",           genre_name: "ラーメン", noodle_name: "中細麺", soup_name: "豚骨", image_url: "https://placehold.co/400x300?text=Kokutei" },
    { id: 302, name: "黒亭チャーシュー麺",     genre_name: "ラーメン", noodle_name: "中細麺", soup_name: "豚骨", image_url: "https://placehold.co/400x300?text=Kokutei+2" },
  ],
};

const DEFAULT_MENUS = [
  { id: 901, name: "醤油ラーメン", genre_name: "ラーメン", noodle_name: "中細麺", soup_name: "醤油", image_url: "https://placehold.co/400x300?text=Shoyu" },
  { id: 902, name: "味噌ラーメン", genre_name: "ラーメン", noodle_name: "太麺",   soup_name: "味噌", image_url: "https://placehold.co/400x300?text=Miso" },
];

const PER_PAGE = 20;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const allMenus = MENUS_BY_SHOP[Number(id)] ?? DEFAULT_MENUS;
  const totalCount = allMenus.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PER_PAGE;
  const menus = allMenus.slice(offset, offset + PER_PAGE);

  return NextResponse.json(
    { menus },
    {
      headers: {
        "Current-Page": String(currentPage),
        "Page-Items": String(PER_PAGE),
        "Total-Pages": String(totalPages),
        "Total-Count": String(totalCount),
      },
    }
  );
}
