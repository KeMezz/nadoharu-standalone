import Link from "next/link";
import CommentMoreBtns from "./buttons/comment-more-button";
import ProfileImage from "./profile-image";

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
          <ProfileImage avatar={avatar} username={username} />
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
