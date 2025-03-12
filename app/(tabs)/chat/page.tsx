import ProfileImage from "@/components/domains/profile/image";
import Link from "next/link";

export default function Chats() {
  return (
    <section className="flex flex-col divide-y divide-neutral-500">
      {Array.from({ length: 10 }).map((_, index) => (
        <Link
          href={`/chat/${index}`}
          key={index}
          className="flex items-center gap-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ProfileImage avatar={null} username="test" size={10} />
          <div className="flex flex-col">
            <p className="text-sm font-bold">John Doe</p>
            <p className="text-sm text-neutral-500">Last message</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
