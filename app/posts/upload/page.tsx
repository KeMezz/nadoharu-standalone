import Layout from "@/components/layouts/layout";
import UploadForm from "@/components/domains/post/upload-form";

export default async function UploadPost() {
  return (
    <Layout canGoBack title="새 글 업로드">
      <section className="p-4">
        <UploadForm />
      </section>
    </Layout>
  );
}
