import ChatBubble from "@/components/chat-bubble";
import ChatInput from "@/components/chat-input";
import { notFound } from "next/navigation";

export default async function ChatDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const chatId = Number(id);
  if (isNaN(chatId)) {
    return notFound();
  }

  return (
    <section>
      <div className="flex flex-col gap-4 p-4">
        <ChatBubble message="lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." />
        <ChatBubble
          message="lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
          reversed={true}
        />
      </div>
      <ChatInput name="content" placeholder="채팅 입력.." />
    </section>
  );
}
