import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import Sidebar from "~/components/dashboard/sidebar";
import Header from "~/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex min-h-screen" style={{ background: "#FBFAF6" }}>
      <Sidebar />

      <div
        className="flex flex-1 flex-col border-l"
        style={{ borderColor: "#E4DFD4" }}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:px-10 sm:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}