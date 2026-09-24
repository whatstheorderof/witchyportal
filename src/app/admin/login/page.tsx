import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { Wordmark } from "@/components/Logo";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getAdmin()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Wordmark /></div>
        <div className="card p-7">
          <h1 className="font-display text-3xl text-plum">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">For Yulia and her team only.</p>
          <LoginForm next={next ?? ""} />
        </div>
      </div>
    </main>
  );
}
