import SubmitButton from "@/components/buttons/submit-button";
import Layout from "@/components/layouts/layout";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

export default function Me() {
  async function logout() {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/");
  }

  return (
    <Layout title="나는">
      <form action={logout} className="p-4">
        <SubmitButton text="로그아웃" />
      </form>
    </Layout>
  );
}
