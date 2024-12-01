import { useAtom } from "jotai";
import { useActionState, useEffect } from "react";
import { Alert, alertAtom } from "@/libs/atoms";

export interface ResponseWithAlert {
  success: boolean;
  alert?: Alert;
}

export function useActionWithAlert<T extends ResponseWithAlert>(
  action: (state: Awaited<T> | void | null) => Promise<T> | T,
  initialState: Awaited<T>
) {
  const [state, dispatch] = useActionState<T>(action, initialState);
  const [, setAlert] = useAtom(alertAtom);

  useEffect(() => {
    if (state?.alert?.visible) {
      setAlert(state.alert);
    }
  }, [state, setAlert]);

  return [state, dispatch] as const;
}
