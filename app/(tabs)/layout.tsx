"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import Footer from "@/components/layouts/footer";
import Header from "@/components/layouts/header";
import { TABS } from "@/libs/constants";

export default function TabsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="max-w-2xl mx-auto">
      <Header title={TABS.find((tab) => tab.link === pathname)?.name}>
        {pathname === "/chat" ? (
          <Link
            href="/chat/new"
            className="text-violet-600 dark:text-violet-400"
          >
            <PlusIcon className="size-6" />
          </Link>
        ) : (
          <Link
            href="/posts/upload"
            className="text-violet-600 dark:text-violet-400"
          >
            <PencilSquareIcon className="size-6" />
          </Link>
        )}
      </Header>
      <section className={"mt-14 mb-20"}>{children}</section>
      <Footer />
    </main>
  );
}
