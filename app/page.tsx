import Layout from "@/components/layout";
import EmptyStateFooter from "@/components/empty-state-has-footer";

export default function Timeline() {
  return (
    <Layout title="모아보는" showNewPostBtn>
      <EmptyStateFooter text="타임라인이 텅 비었어요" />
    </Layout>
  );
}
