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
  const width = size * 4;
  const height = size * 4;

  return avatar ? (
    <Image
      src={avatar}
      alt={username}
      width={width}
      height={height}
      className={`size-${size} rounded-md bg-neutral-200 dark:bg-neutral-600 object-cover shadow-sm`}
    />
  ) : (
    <div
      className={`size-${size} rounded-md bg-neutral-200 dark:bg-neutral-600 shadow-sm`}
    />
  );
}
