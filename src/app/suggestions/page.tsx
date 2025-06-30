"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type RecommendedData = {
  recommended_menu: {
    id: number;
    name: string;
    genre_name: string;
    noodle_name: string;
    soup_name: string;
    image_url: string;
    shop?: {
      name: string;
      address: string;
      google_map_url?: string;
    };
  };
  reason: string;
};

export default function Suggestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recommendedData, setRecommendedData] = useState<RecommendedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processData = async () => {
      try {
        setLoading(true);
        
        // 最低限のローディング時間を確保
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));
        
        const errorParam = searchParams.get('error');
        const dataParam = searchParams.get('data');
        
        if (errorParam) {
          await minLoadingTime;
          throw new Error(decodeURIComponent(errorParam));
        }
        
        if (dataParam) {
          const parsedData = JSON.parse(decodeURIComponent(dataParam));
          
          if (!parsedData.recommended_menu) {
            throw new Error("おすすめデータの構造が不正です");
          }
          
          await minLoadingTime;
          setRecommendedData(parsedData);
        } else {
          await minLoadingTime;
          throw new Error("おすすめデータがありません");
        }
      } catch (parseError) {
        console.error("Failed to process recommended data:", parseError);
        setError(
          parseError instanceof Error
            ? parseError.message
            : "データの処理に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    processData();
  }, [searchParams]);

  const handleMapPress = () => {
    if (recommendedData?.recommended_menu?.shop?.google_map_url) {
      window.open(recommendedData.recommended_menu.shop.google_map_url, '_blank');
    }
  };

  const handleTwitterShare = () => {
    if (!recommendedData?.recommended_menu) return;

    const { recommended_menu } = recommendedData;
    const menuUrl = `${window.location.origin}/suggestions`;
    
    const shareText = `🍜 ラーメンに愛(AI)を！診断結果 🍜\n\nあなたにおすすめのラーメンは「${recommended_menu.name}」でした！\n\n📍 ${recommended_menu.shop?.name || "お店"}\n🥢 ${recommended_menu.genre_name} - ${recommended_menu.soup_name}スープ - ${recommended_menu.noodle_name}\n\n#ラーメンに愛を #ラーメン診断 #ラーメン\n\n`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(menuUrl)}`;
    
    window.open(twitterUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">おすすめを生成中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-center mb-4">エラーが発生しました</p>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <p className="text-gray-500 text-center mb-6">再度お試しください。</p>
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!recommendedData || !recommendedData.recommended_menu) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">表示できるラーメン情報がありません。</p>
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { recommended_menu, reason } = recommendedData;
  const { name, genre_name, noodle_name, soup_name, image_url, shop } = recommended_menu;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">あなたにおすすめのラーメン</h1>
          </div>

          {/* 画像 */}
          {image_url && (
            <div className="relative h-64 overflow-hidden">
              <img
                src={image_url}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* コンテンツ */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {name || "おすすめラーメン"}
            </h2>

            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {genre_name} - {soup_name}スープ - {noodle_name}
              </p>
            </div>

            {/* 店舗情報 */}
            {shop && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{shop.name}</h3>
                <p className="text-gray-600 mb-3">{shop.address}</p>
                {shop.google_map_url && (
                  <Button
                    onClick={handleMapPress}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    地図で見る
                  </Button>
                )}
              </div>
            )}

            {/* おすすめ理由 */}
            <div className="mb-6">
              <h3 className="font-bold mb-2">AIによるおすすめ理由:</h3>
              <p className="text-gray-700 leading-relaxed">
                {reason || "あなたの好みに合わせて選ばれました。"}
              </p>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button
                onClick={handleTwitterShare}
                className="w-full bg-sky-500 hover:bg-sky-600"
              >
                <span className="mr-2">🐦</span>
                診断結果をXでシェア
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/">もう一度診断する</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}