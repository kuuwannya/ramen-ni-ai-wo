"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type MenuType = {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string;
};

type CardDataType = {
  id: number;
  image: string;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
};

// APIサービス（簡略化版）
const apiService = {
  getRandomMenus: async (): Promise<{ menus: MenuType[] }> => {
    // ダミーデータ
    return {
      menus: [
        {
          id: 1,
          name: "醤油ラーメン",
          genre_name: "ラーメン",
          noodle_name: "中太麺",
          soup_name: "醤油",
          image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
        },
        {
          id: 2,
          name: "味噌ラーメン",
          genre_name: "ラーメン",
          noodle_name: "太麺",
          soup_name: "味噌",
          image_url: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop"
        },
        {
          id: 3,
          name: "塩ラーメン",
          genre_name: "ラーメン",
          noodle_name: "細麺",
          soup_name: "塩",
          image_url: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop"
        }
      ]
    };
  },
  
  sendRecommendedMenus: async (
    selectMenuIds: number[],
    notSelectedMenuIds: number[] = []
  ) => {
    // ダミーレスポンス
    return {
      recommended_menu: {
        id: 1,
        name: "おすすめ醤油ラーメン",
        genre_name: "ラーメン",
        noodle_name: "中太麺",
        soup_name: "醤油",
        image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
        shop: {
          name: "ラーメン太郎",
          address: "東京都渋谷区",
          google_map_url: "https://maps.google.com"
        }
      },
      reason: "あなたの好みに合わせて選ばれました。"
    };
  }
};

export default function Preferences() {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [likedMenuIds, setLikedMenuIds] = useState<number[]>([]);
  const [passedMenuIds, setPassedMenuIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // メニューデータ取得
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await apiService.getRandomMenus();
        setMenus(response.menus || []);
      } catch (err) {
        setError("メニューの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const transformedCardData = useMemo(() => {
    if (!menus || !Array.isArray(menus)) {
      return [];
    }
    return menus.map((menu) => ({
      id: menu.id,
      image: menu.image_url,
      name: menu.name,
      genre_name: menu.genre_name,
      noodle_name: menu.noodle_name,
      soup_name: menu.soup_name,
    }));
  }, [menus]);

  const handleSwipe = useCallback(
    async (direction: 'left' | 'right') => {
      if (currentIndex >= transformedCardData.length || isSubmitting) return;

      const menuId = transformedCardData[currentIndex].id;
      const menuName = transformedCardData[currentIndex].name;

      setSwipeDirection(direction);
      
      // アニメーション時間を考慮
      setTimeout(() => {
        if (direction === 'right') {
          const newLikedMenuIds = [...likedMenuIds, menuId];
          setLikedMenuIds(newLikedMenuIds);
          console.log(`いいね: ${menuName} (ID: ${menuId})`);
        } else {
          const newPassedMenuIds = [...passedMenuIds, menuId];
          setPassedMenuIds(newPassedMenuIds);
          console.log(`パス: ${menuName} (ID: ${menuId})`);
        }

        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      }, 300);
    },
    [currentIndex, transformedCardData, likedMenuIds, passedMenuIds, isSubmitting]
  );

  const handleAllCardsComplete = useCallback(
    async () => {
      console.log("全てのカードを見ました");
      console.log("いいねしたメニューID:", likedMenuIds);
      console.log("パスしたメニューID:", passedMenuIds);

      if (likedMenuIds.length > 0) {
        try {
          setIsSubmitting(true);
          
          const response = await apiService.sendRecommendedMenus(
            likedMenuIds,
            passedMenuIds
          );

          if (response && response.recommended_menu) {
            router.push(`/suggestions?data=${encodeURIComponent(JSON.stringify(response))}`);
          } else {
            router.push("/suggestions?error=" + encodeURIComponent("APIレスポンスの形式が不正です"));
          }
        } catch (error) {
          console.error("API送信に失敗しました:", error);
          router.push("/suggestions?error=" + encodeURIComponent("APIエラーが発生しました"));
        } finally {
          setIsSubmitting(false);
        }
      } else {
        router.push("/suggestions?error=" + encodeURIComponent("いいねしたメニューがありません"));
      }
    },
    [router, likedMenuIds, passedMenuIds]
  );

  // 全てのカードが完了したかチェック
  useEffect(() => {
    if (currentIndex >= transformedCardData.length && transformedCardData.length > 0) {
      handleAllCardsComplete();
    }
  }, [currentIndex, transformedCardData.length, handleAllCardsComplete]);

  if (loading) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">ラーメン情報を取得中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(transformedCardData) || transformedCardData.length === 0) {
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

  const currentCard = transformedCardData[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">ラーメンスワイパー</h1>
        <p className="text-sm text-gray-600 mt-2">
          {currentIndex + 1} / {transformedCardData.length}
        </p>
      </div>

      {/* カード表示エリア */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <div className="relative w-full max-w-sm">
          {/* 現在のカード */}
          {currentCard && (
            <div 
              className={`
                relative w-full h-96 rounded-xl overflow-hidden bg-white shadow-lg transition-transform duration-300
                ${swipeDirection === 'left' ? 'transform -translate-x-full rotate-12' : ''}
                ${swipeDirection === 'right' ? 'transform translate-x-full -rotate-12' : ''}
              `}
            >
              <img
                src={currentCard.image}
                alt={currentCard.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {currentCard.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  ジャンル: {currentCard.genre_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  麺: {currentCard.noodle_name}
                </p>
                <p className="text-sm text-gray-600">
                  スープ: {currentCard.soup_name}
                </p>
              </div>

              {/* スワイプオーバーレイ */}
              {swipeDirection === 'left' && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-xl">
                  <span className="text-4xl font-bold text-white">パス</span>
                </div>
              )}
              {swipeDirection === 'right' && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center rounded-xl">
                  <span className="text-4xl font-bold text-white">いいね！</span>
                </div>
              )}
            </div>
          )}

          {/* 次のカード（背景） */}
          {transformedCardData[currentIndex + 1] && (
            <div className="absolute inset-0 w-full h-96 rounded-xl overflow-hidden bg-white shadow-lg -z-10 transform scale-95 opacity-50">
              <img
                src={transformedCardData[currentIndex + 1].image}
                alt={transformedCardData[currentIndex + 1].name}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* コントロールボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 p-6">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {/* パスボタン */}
          <button
            className={`w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleSwipe('left')}
            disabled={isSubmitting}
          >
            <span className="text-3xl text-white">✕</span>
          </button>

          {/* ホームボタン */}
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <Link href="/">ホーム</Link>
          </Button>

          {/* いいねボタン */}
          <button
            className={`w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-all ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleSwipe('right')}
            disabled={isSubmitting}
          >
            <span className="text-3xl text-white">♥</span>
          </button>
        </div>
      </div>

      {/* 提出中のローディング */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">おすすめを生成中...</p>
          </div>
        </div>
      )}
    </div>
  );
}