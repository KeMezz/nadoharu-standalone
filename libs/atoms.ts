import { atom } from "jotai";

export interface Alert {
  // 모달 표시 여부
  visible: boolean;
  // 모달 제목
  title?: string;
  // 모달 설명
  description?: string;
  // 모달 설명 요소
  descriptionElement?: React.ReactNode;
  // 닫기 버튼 표시 여부
  closeBtn?: boolean;
  // 닫기 버튼 클릭 시 실행할 함수
  closeBtnAction?: (() => void) | null;
  // 추가 버튼 표시 여부
  extraBtn?: boolean;
  // 추가 버튼 텍스트
  extraBtnText?: string;
  // 추가 버튼 클릭 시 실행할 함수
  extraBtnAction?: (() => void) | null;
  // 추가 버튼 색상
  extraBtnColor?: "neutral" | "red" | "green";
  // 추가 버튼 로딩 여부
  extraBtnLoading?: boolean;
  // 재로그인 여부
  relogin?: boolean;
}

export const alertAtom = atom<Alert>({
  visible: false,
});
