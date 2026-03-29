import { NextResponse } from "next/server";

const ALL_SHOPS = [
  { id: 1,  name: "九州 筑豊ラーメン山小屋",       address: "佐賀県嬉野市嬉野町大字下宿甲４００２−４",       google_map_url: "https://maps.app.goo.gl/BvuQTxGsmKLJ68yL9" },
  { id: 2,  name: "博多ラーメン 一蘭",              address: "福岡県福岡市博多区博多駅前２−１",              google_map_url: "https://maps.app.goo.gl/example2" },
  { id: 3,  name: "熊本ラーメン 黒亭",              address: "熊本県熊本市中央区上通町１−１",              google_map_url: "https://maps.app.goo.gl/example3" },
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shop = ALL_SHOPS.find((s) => s.id === Number(id)) ?? {
    id: Number(id),
    name: "サンプルラーメン店",
    address: "東京都新宿区1-1-1",
    google_map_url: "https://maps.app.goo.gl/example",
  };

  return NextResponse.json({ shop });
}
