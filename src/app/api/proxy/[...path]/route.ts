import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PAGINATION_HEADERS = ["current-page", "page-items", "total-pages", "total-count"];

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const url = `${API_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const body = request.method !== "GET" ? await request.text() : undefined;

  const res = await fetch(url, { method: request.method, headers, body });

  const responseHeaders = new Headers();
  PAGINATION_HEADERS.forEach((key) => {
    const value = res.headers.get(key);
    if (value) responseHeaders.set(key, value);
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status, headers: responseHeaders });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
};
