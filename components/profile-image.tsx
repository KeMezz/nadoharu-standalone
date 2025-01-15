import Image from "next/image";

export default function ProfileImage({
  avatar,
  username,
  size = 10,
}: {
  avatar: string | null;
  username: string;
  size?: number;
}) {
  return avatar ? (
    <Image
      src={avatar}
      alt={username}
      width={40}
      height={40}
      className={`size-${size} rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm`}
    />
  ) : (
    <div
      className={`size-${size} rounded-md bg-neutral-200 dark:bg-neutral-600 shadow-sm`}
    />
  );
}
