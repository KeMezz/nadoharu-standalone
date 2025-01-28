"use client";

import { toastAtom } from "@/libs/atoms";
import { useAtom } from "jotai";
import * as Toast from "@radix-ui/react-toast";
import { useEffect, useRef } from "react";

export default function GlobalToast() {
  const [
    { visible, title, description, undoAction, duration = 5000 },
    setToast,
  ] = useAtom(toastAtom);

  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

  useEffect(() => {
    if (visible) {
      eventDateRef.current = new Date();
      timerRef.current = window.setTimeout(() => {
        setToast({ visible: false });
      }, duration);
    }
  }, [visible, setToast, duration]);

  return (
    <Toast.Provider swipeDirection="right" duration={duration}>
      <Toast.Root
        className="grid grid-cols-[auto_max-content] items-center gap-x-4 rounded-md bg-neutral-50 dark:bg-neutral-900 px-4 py-3 shadow-md [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={visible}
      >
        <Toast.Title className="[grid-area:_title]">{title}</Toast.Title>
        {description ? (
          <Toast.Description className="text-xs mt-2">
            {description}
          </Toast.Description>
        ) : null}
        {undoAction ? (
          <Toast.Action
            className="[grid-area:_action]"
            asChild
            altText="Goto schedule to undo"
          >
            <button
              onClick={undoAction}
              className="inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
            >
              취소
            </button>
          </Toast.Action>
        ) : null}
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-24 right-0 z-50 m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}
