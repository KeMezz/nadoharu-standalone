import SubmitButton from "@/components/buttons/submit-button";
import Textarea from "@/components/inputs/textarea";

export default async function SendRequest({
  params,
}: {
  params: { id: string };
}) {
  const { id: loginId } = await params;
  return (
    <form className="flex flex-col gap-4 p-4">
      <Textarea placeholder={`@${loginId} 님! 우리 친구해요!`} />
      <SubmitButton text="친구 신청 보내기" />
    </form>
  );
}
