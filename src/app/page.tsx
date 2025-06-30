import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          {/* メインタイトル */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            <span>ラーメンに</span>
            <span className="text-red-600 inline-block mx-2 text-5xl md:text-7xl">愛(AI)</span>
            <span>を！</span>
          </h1>

          {/* 説明文 */}
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              もうラーメン選びで迷うことはありません。<br />
              いつもとは違う、あなただけの特別なラーメン選びをお楽しみください！
            </p>
          </div>

          {/* CTAボタン */}
          <div className="space-y-4 mb-12">
            <Button 
              size="lg" 
              className="bg-orange-500 text-white hover:bg-orange-600 px-12 py-6 text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link href="/preferences">
                🍜 診断する？
              </Link>
            </Button>
          </div>

          {/* YouTube動画埋め込み */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden shadow-2xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/QbdjLjZIYnQ"
                title="ラーメンに愛を！紹介動画"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          © 2025 ラーメンに愛(AI)を！ All rights reserved.
        </p>
      </div>
    </div>
  );
}
