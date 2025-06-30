"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api-client";
import Link from "next/link";

interface MenuDetail {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string | null;
  shop: {
    id: number;
    name: string;
    address: string;
    google_map_url: string;
  };
}

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function MenuDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMenuDetail(params.id);
        setMenuData(data);
      } catch (err) {
        console.error("Failed to fetch menu detail:", err);
        setError("メニューの詳細情報を取得できませんでした。");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuDetail();
  }, [params.id]);

  const handleMapPress = () => {
    if (menuData?.shop?.google_map_url) {
      window.open(menuData.shop.google_map_url, '_blank');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🍜</div>
              <p className="text-gray-600">メニュー情報を読み込み中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">😵</div>
              <p className="text-red-600 mb-4">{error || "メニューが見つかりませんでした。"}</p>
              <Button onClick={handleBack} variant="outline">
                ← 戻る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {menuData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {menuData.image_url ? (
              <div className="mb-6">
                <img
                  src={menuData.image_url}
                  alt={menuData.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="mb-6 w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-gray-500 text-4xl">🍜</span>
                  <p className="text-gray-500 text-sm mt-2">画像なし</p>
                </div>
              </div>
            )}

            <div className="mb-6 text-center">
              <p className="text-gray-600 text-lg">
                {menuData.genre_name} - {menuData.soup_name}スープ - {menuData.noodle_name}
              </p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">🏪 お店情報</h3>
              <h4 className="font-bold text-xl mb-1">{menuData.shop.name}</h4>
              <p className="text-gray-600 mb-3">📍 {menuData.shop.address}</p>

              <Button
                onClick={handleMapPress}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                📍 地図で見る
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/">ホーム</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}