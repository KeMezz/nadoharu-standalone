import Header from "@/components/layouts/header";

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function Layout({ children }: LayoutProps) {
  return (
    <main className="max-w-2xl mx-auto">
      <Header canGoBack />
      <section className="mt-14 mb-20">{children}</section>
    </main>
  );
}
