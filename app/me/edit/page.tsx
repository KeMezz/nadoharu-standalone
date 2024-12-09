import SubmitButton from "@/components/buttons/submit-button";
import getSession from "@/libs/session";
import { redirect } from "next/navigation";

export default function EditProfile() {
  async function logout() {
    "use server";
    const session = await getSession();
    session.destroy();
    redirect("/login");
  }

  return (
    <div>
      EditProfile
      <form action={logout} className="p-4">
        <SubmitButton text="로그아웃" />
      </form>
    </div>
  );
}
