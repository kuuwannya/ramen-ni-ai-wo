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

type Pagination = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export default function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await apiService.getShops(currentPage);
        setShops(response.shops || []);
        setPagination(response.pagination || null);
      } catch (error) {
        console.error("店舗一覧の取得に失敗しました:", error);
        setError("店舗一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [currentPage]);

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
        {pagination && (
          <p className="text-sm text-gray-600 mt-2">{pagination.total_count}件の店舗</p>
        )}
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
          <>
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

            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  前へ
                </button>

                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === pagination.total_pages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
