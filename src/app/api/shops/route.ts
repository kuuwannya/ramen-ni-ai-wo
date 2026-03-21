import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    shops: [
      {
        id: 1,
        name: "九州 筑豊ラーメン山小屋",
        address: "佐賀県嬉野市嬉野町大字下宿甲４００２−４",
        google_map_url: "https://maps.app.goo.gl/BvuQTxGsmKLJ68yL9",
      },
      {
        id: 2,
        name: "博多ラーメン 一蘭",
        address: "福岡県福岡市博多区博多駅前２−１",
        google_map_url: "https://maps.app.goo.gl/example2",
      },
      {
        id: 3,
        name: "熊本ラーメン 黒亭",
        address: "熊本県熊本市中央区上通町１−１",
        google_map_url: "https://maps.app.goo.gl/example3",
      },
    ],
  });
}
