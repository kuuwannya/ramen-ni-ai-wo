import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    access_token: "mock-access-token-12345",
    user: {
      id: 1,
      name: "テストユーザー",
      image_url: "https://placehold.co/40x40?text=User",
    },
  });
}
