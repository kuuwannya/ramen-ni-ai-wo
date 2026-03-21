"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { apiService } from "@/lib/api-client";

type Shop = {
  id: number;
  name: string;
  address: string;
  google_map_url: string;
};

export default function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiService.getShops();
        setShops(response.shops || []);
      } catch (error) {
        console.error("店舗一覧の取得に失敗しました:", error);
        setError("店舗一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">店舗情報を取得中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild variant="outline">
            <Link href="/">ホームに戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">ラーメン店舗一覧</h1>
        <p className="text-sm text-gray-600 mt-2">{shops.length}件の店舗</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        {shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">表示できる店舗情報がありません。</p>
            <Button asChild variant="outline">
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {shops.map((shop) => (
              <li key={shop.id} className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{shop.name}</h2>
                <p className="text-sm text-gray-600 mb-3">{shop.address}</p>
                <a
                  href={shop.google_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Google マップで見る
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
