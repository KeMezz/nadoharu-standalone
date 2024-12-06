import Link from "next/link";
import Image from "next/image";
interface CommentProps {
  avatar: string | null;
  username: string;
  content: string;
  accountId: string;
}

export default function Comment({
  avatar,
  username,
  content,
  accountId,
}: CommentProps) {
  return (
    <div className="p-4 flex gap-4 align-start">
      <Link href={`/users/${accountId}`} className="flex-shrink-0">
        <Image
          src={avatar ?? ""}
          alt={username}
          width={40}
          height={40}
          className="size-10 rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm"
        />
      </Link>
      <div className="flex flex-col text-sm gap-1">
        <Link href={`/users/${accountId}`} className="font-semibold">
          {username}
        </Link>
        <p>{content}</p>
      </div>
    </div>
  );
}
