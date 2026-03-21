import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    menus: [
      {
        id: 1,
        name: "博多とんこつラーメン",
        genre_name: "とんこつ",
        noodle_name: "細麺",
        soup_name: "とんこつ",
        image_url: "https://placehold.co/400x300?text=Ramen+1",
      },
      {
        id: 2,
        name: "札幌味噌ラーメン",
        genre_name: "味噌",
        noodle_name: "中太縮れ麺",
        soup_name: "味噌",
        image_url: "https://placehold.co/400x300?text=Ramen+2",
      },
      {
        id: 3,
        name: "旭川醤油ラーメン",
        genre_name: "醤油",
        noodle_name: "中細麺",
        soup_name: "醤油",
        image_url: "https://placehold.co/400x300?text=Ramen+3",
      },
      {
        id: 4,
        name: "尾道ラーメン",
        genre_name: "醤油",
        noodle_name: "細麺",
        soup_name: "背脂醤油",
        image_url: "https://placehold.co/400x300?text=Ramen+4",
      },
      {
        id: 5,
        name: "喜多方ラーメン",
        genre_name: "醤油",
        noodle_name: "平打ち縮れ麺",
        soup_name: "あっさり醤油",
        image_url: "https://placehold.co/400x300?text=Ramen+5",
      },
    ],
  });
}
