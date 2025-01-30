import { atom } from "jotai";

export interface Alert {
  visible: boolean;
  title?: string;
  description?: string;
  descriptionElement?: React.ReactNode;
  closeBtn?: boolean;
  closeBtnAction?: (() => void) | null;
  extraBtn?: boolean;
  extraBtnText?: string;
  extraBtnAction?: (() => void) | null;
  extraBtnColor?: "neutral" | "red" | "green";
  extraBtnLoading?: boolean;
  relogin?: boolean;
}

export const alertAtom = atom<Alert>({
  visible: false,
});

export interface Toast {
  visible: boolean;
  title?: string;
  description?: string;
  undoAction?: () => void;
  duration?: number;
}

export const toastAtom = atom<Toast>({
  visible: false,
});
