import { FaceFrownIcon } from "@heroicons/react/24/solid";

export default function EmptyState({ text }: { text: string }) {
  return (
    <section className="flex flex-col gap-6 justify-center items-center h-[calc(100vh-80px)] text-gray-400">
      <FaceFrownIcon className="size-10" />
      <h3 className="font-medium text-lg">{text}</h3>
    </section>
  );
}
