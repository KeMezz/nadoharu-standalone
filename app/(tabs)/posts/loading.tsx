import FooterItem from "@/components/layouts/footer-item";
import SkPostPreview from "@/components/skeletons/sk-post-preview";

export default function PostsLoading() {
  return (
    <main className="max-w-2xl mx-auto">
      <div className="px-4 h-14 border-b-2 border-violet-600 dark:border-violet-400 text-center flex justify-between max-w-2xl w-full bg-white dark:bg-neutral-800 z-20 shadow-md">
        <section className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-violet-600 dark:text-violet-400">
            모아보는
          </h1>
        </section>
      </div>
      {[...Array(10)].map((_, index) => (
        <SkPostPreview key={index} />
      ))}
      <footer className="max-w-2xl w-full grid grid-cols-4 mx-auto h-20 bg-violet-600 dark:bg-neutral-800 fixed bottom-0 border-t-2 border-violet-800 dark:border-violet-400 z-20">
        <FooterItem title="모아보는" link="/posts" />
        <FooterItem title="메시지" link="/chat" />
        <FooterItem title="나는" link="/me" />
        <FooterItem title="친구들은" link="/friends" />
      </footer>
    </main>
  );
}
