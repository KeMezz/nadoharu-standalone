import Link from "next/link";
import Image from "next/image";
import CommentMoreBtns from "./buttons/comment-more-button";
interface CommentProps {
  avatar: string | null;
  username: string;
  content: string;
  accountId: string;
  isUserComment: boolean;
  commentId: number;
  postId: number;
}

export default function Comment({
  avatar,
  username,
  content,
  accountId,
  isUserComment,
  commentId,
  postId,
}: CommentProps) {
  return (
    <div className="flex p-4 justify-between">
      <div className="flex gap-4 align-start">
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
      <div className="flex gap-2 justify-end w-6 flex-shrink-0">
        <CommentMoreBtns
          isUserComment={isUserComment}
          commentId={commentId}
          postId={postId}
        />
      </div>
    </div>
  );
}
