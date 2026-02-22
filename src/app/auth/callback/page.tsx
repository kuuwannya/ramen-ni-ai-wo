"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService } from "../../../lib/api-client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalled = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (code && !hasCalled.current) {
      hasCalled.current = true;
      
      const authenticate = async () => {
        try {
          const backendData = await apiService.googleAuth(code);
          
          // トークンとユーザー情報を保存
          localStorage.setItem("accessToken", backendData.token);
          localStorage.setItem("user", JSON.stringify(backendData.user));
          
          router.push("/");
          router.refresh();
        } catch (error) {
          console.error("Authentication failed:", error);
          router.push("/login?error=auth_failed");
        }
      };
      
      authenticate();
    } else if (!code) {
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-semibold mb-4">認証中...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">読み込み中...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
