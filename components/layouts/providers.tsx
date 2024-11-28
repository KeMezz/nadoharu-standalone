import { ReactNode } from "react";
import { Provider } from "jotai";

export default function Providers({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
