import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const data = await res.json();

    const response = NextResponse.redirect(new URL("/", request.url));

    response.cookies.set("accessToken", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
