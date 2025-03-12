import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export type MoreBtn = {
  action: () => void;
  name: string;
  icon: JSX.Element;
};

export default function MoreButtons({ buttons }: { buttons: MoreBtn[] }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsisVerticalIcon className="size-6" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-20 min-w-[180px] bg-white dark:bg-neutral-900 rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
        >
          {buttons.map((button) => (
            <DropdownMenu.Item
              key={button.name}
              className="group leading-none rounded-md flex items-center h-8 p-3 relative select-none outline-none data-[disabled]:pointer-events-none hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer"
              onSelect={button.action}
            >
              <div className="pr-2">{button.icon}</div>
              <p className="text-sm">{button.name}</p>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
