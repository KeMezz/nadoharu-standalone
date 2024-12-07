import { TABS } from "@/libs/constants";
import FooterItem, { Tabs } from "./footer-item";

export default function Footer() {
  return (
    <footer className="max-w-2xl w-full grid grid-cols-4 mx-auto h-20 bg-violet-600 dark:bg-neutral-800 fixed bottom-0 border-t-2 border-violet-800 dark:border-violet-400 z-20">
      {TABS.map((tab) => (
        <FooterItem key={tab.link} title={tab.name} link={tab.link as Tabs} />
      ))}
    </footer>
  );
}
