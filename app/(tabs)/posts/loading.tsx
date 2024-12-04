import Layout from "@/components/layouts/layout";
import SkPostPreview from "@/components/skeletons/sk-post-preview";

export default function PostsLoading() {
  return (
    <Layout>
      {[...Array(10)].map((_, index) => (
        <SkPostPreview key={index} />
      ))}
    </Layout>
  );
}
