import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    id: 1,
    name: "テストユーザー",
    image_url: "https://placehold.co/40x40?text=User",
  });
}
