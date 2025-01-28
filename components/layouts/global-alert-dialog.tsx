"use client";

import * as ReactAlertDialog from "@radix-ui/react-alert-dialog";
import { alertAtom } from "@/libs/atoms";
import { cls } from "@/libs/utils";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function GlobalAlertDialog() {
  const router = useRouter();
  const [
    {
      visible,
      title,
      description,
      descriptionElement,
      closeBtn = true,
      closeBtnAction,
      extraBtnText,
      extraBtnAction,
      extraBtnColor,
      extraBtnLoading,
      relogin,
    },
    setAlert,
  ] = useAtom(alertAtom);

  const buttonColor = (color: "neutral" | "red" | "green") => {
    switch (color) {
      case "neutral":
        return "text-neutral-500 bg-neutral-100 hover:bg-neutral-200";
      case "red":
        return "text-white bg-rose-600 hover:bg-rose-700-";
      case "green":
        return "text-white bg-green-500 hover:bg-green-600";
    }
  };

  const closeDialog = () => {
    setAlert({ visible: false, title: "", description: "" });
    if (closeBtnAction) {
      closeBtnAction();
    }
  };

  const onExtraBtnClick = () => {
    if (extraBtnAction) {
      extraBtnAction();
    }
    closeDialog();
  };

  const pushToLogin = () => {
    router.push("/login");
    closeDialog();
  };

  return (
    <ReactAlertDialog.Root open={visible}>
      <ReactAlertDialog.Portal>
        <ReactAlertDialog.Overlay className="data-[state=open]:animate-overlayShow bg-black bg-opacity-20 fixed inset-0 z-30" />
        <ReactAlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white dark:bg-neutral-800 p-[25px] shadow-lg focus:outline-none z-40">
          <ReactAlertDialog.Title className="font-semibold text-lg">
            {title}
          </ReactAlertDialog.Title>
          <ReactAlertDialog.Description className="mt-4 mb-5 leading-normal">
            {descriptionElement}
            {description}
          </ReactAlertDialog.Description>
          <div className="flex justify-end gap-4">
            {extraBtnText ? (
              <ReactAlertDialog.Action asChild>
                <button
                  onClick={onExtraBtnClick}
                  className={cls(
                    "h-10 items-center justify-center rounded-md px-4 font-medium outline-none",
                    extraBtnColor
                      ? buttonColor(extraBtnColor)
                      : buttonColor("neutral")
                  )}
                >
                  {extraBtnLoading ? "로딩 중..." : extraBtnText}
                </button>
              </ReactAlertDialog.Action>
            ) : null}
            {relogin ? (
              <ReactAlertDialog.Action asChild>
                <button
                  disabled={extraBtnLoading}
                  onClick={pushToLogin}
                  className={cls(
                    "h-10 items-center justify-center rounded-md px-4 font-medium outline-none",
                    extraBtnColor
                      ? buttonColor(extraBtnColor)
                      : buttonColor("neutral")
                  )}
                >
                  로그인 페이지로
                </button>
              </ReactAlertDialog.Action>
            ) : null}
            {closeBtn ? (
              <ReactAlertDialog.Cancel asChild>
                <button
                  disabled={extraBtnLoading}
                  onClick={closeDialog}
                  className="text-neutral-500 bg-neutral-100 hover:bg-neutral-200 dark:text-neutral-100 dark:bg-neutral-600 dark:hover:bg-neutral-400 h-10 items-center justify-center rounded-md px-4 font-medium outline-none"
                >
                  닫기
                </button>
              </ReactAlertDialog.Cancel>
            ) : null}
          </div>
        </ReactAlertDialog.Content>
      </ReactAlertDialog.Portal>
    </ReactAlertDialog.Root>
  );
}
