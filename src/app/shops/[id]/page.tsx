"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { apiService } from "@/lib/api-client";

type Shop = {
  id: number;
  name: string;
  address: string;
  google_map_url: string;
};

type Menu = {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string | null;
  shop: Shop;
};

type Pagination = {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ShopDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setShopId(p.id));
  }, [params]);

  useEffect(() => {
    if (!shopId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [shopData, menusData] = await Promise.all([
          apiService.getShopDetail(shopId),
          apiService.getShopMenus(shopId, currentPage),
        ]);
        setShop(shopData.shop ?? shopData);
        setMenus(menusData.menus);
        setPagination(menusData.pagination);
      } catch (err) {
        console.error("店舗詳細の取得に失敗しました:", err);
        setError("店舗情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId, currentPage]);

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

  if (error || !shop) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error ?? "店舗が見つかりませんでした"}</p>
          <Button variant="outline" onClick={() => router.back()}>
            ← 戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 店舗情報 */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h1 className="text-lg font-bold text-gray-800 mb-1">{shop.name}</h1>
          <p className="text-sm text-gray-600 mb-3">📍 {shop.address}</p>
          <a
            href={shop.google_map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            Google マップで見る
          </a>
        </div>

        {/* メニュー一覧 */}
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          メニュー一覧
          {pagination && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              （{pagination.total_count}件）
            </span>
          )}
        </h2>

        {menus.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            メニュー情報がありません
          </div>
        ) : (
          <>
            <ul className="space-y-4">
              {menus.map((menu) => (
                <li key={menu.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {menu.image_url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={menu.image_url}
                        alt={menu.name}
                        fill
                        sizes="(max-width: 672px) 100vw, 672px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{menu.name}</h3>
                    <p className="text-sm text-gray-500">
                      {menu.genre_name} · {menu.soup_name}スープ · {menu.noodle_name}
                    </p>
                  </div>
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

        <div className="mt-8">
          <Button variant="outline" onClick={() => router.back()} className="w-full">
            ← 戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
