import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold">Team Wiki SaaS</h1>
      </main>
    );
  }

  redirect("/onboarding");
}