import ProfileImage from "@/components/domains/profile/image";

interface ChatBubbleProps {
  message: string;
  avatar: string | null;
  reversed?: boolean;
  username: string;
}

export default function ChatBubble({
  message,
  reversed,
  avatar,
  username,
}: ChatBubbleProps) {
  return (
    <div className={`flex gap-3 ${reversed ? "justify-end" : "justify-start"}`}>
      {!reversed ? <ProfileImage avatar={avatar} username={username} /> : null}
      <div
        className={`flex items-center p-3 rounded-lg max-w-[70%] ${
          reversed ? "bg-violet-500" : "bg-neutral-800"
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
}
