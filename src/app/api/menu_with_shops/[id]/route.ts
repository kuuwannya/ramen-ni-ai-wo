import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    id: Number(id),
    name: "博多とんこつラーメン",
    genre_name: "とんこつ",
    noodle_name: "細麺",
    soup_name: "とんこつ",
    image_url: "https://placehold.co/400x300?text=Ramen",
    shop: {
      id: 1,
      name: "九州 筑豊ラーメン山小屋",
      address: "佐賀県嬉野市嬉野町大字下宿甲４００２−４",
      google_map_url: "https://maps.app.goo.gl/BvuQTxGsmKLJ68yL9",
    },
  });
}
