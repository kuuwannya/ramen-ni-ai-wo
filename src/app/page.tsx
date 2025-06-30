import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  //const router = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-medium">Welcome to Ramen AI!</h1>
          <Button variant="outline" asChild>
            <Link href="/preferences">ラーメン愛はある？</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
