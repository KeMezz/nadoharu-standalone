import Image from "next/image";

interface BubbleProps {
  message: string;
  avatar?: string;
  reversed?: boolean;
}

const ProfileAvatar = ({ avatar }: { avatar?: string }) => {
  if (avatar)
    return (
      <Image
        width={40}
        height={40}
        className="w-10 h-10 rounded-md bg-neutral-300"
        src={`https://imagedelivery.net/bNh-NL16qgpnc_aca1vxPw/${avatar}/avatar`}
        alt="avatar"
      />
    );
  return <div className="size-10 rounded-lg bg-neutral-300" />;
};

export default function ChatBubble({ message, reversed, avatar }: BubbleProps) {
  return (
    <div className={`flex gap-3 ${reversed ? "justify-end" : "justify-start"}`}>
      {!reversed ? <ProfileAvatar avatar={avatar} /> : null}
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
