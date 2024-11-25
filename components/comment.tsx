import { NextPage } from "next";
import Link from "next/link";

interface CommentProps {
  avatar?: string;
  username: string;
  comment: string;
  accountId: string;
}

const Comment: NextPage<CommentProps> = ({ username, comment, accountId }) => {
  return (
    <div className="p-4 flex gap-4 align-start border-b">
      <Link href={`/users/${accountId}`}>
        <div className="w-10 h-10 rounded-md bg-gray-300 flex-shrink-0" />
      </Link>
      <div className="flex flex-col text-sm gap-1">
        <Link href={`/users/${accountId}`} className="font-semibold">
          {username}
        </Link>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default Comment;
