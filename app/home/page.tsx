import Layout from "@/components/layouts/layout";
import EmptyStateFooter from "@/components/layouts/empty-state-has-footer";

export const metadata = {
  title: "모아보는",
};

export default function Timeline() {
  return (
    <Layout title="모아보는" showNewPostBtn>
      <EmptyStateFooter text="타임라인이 텅 비었어요" />
    </Layout>
  );
}
