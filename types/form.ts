import { typeToFlattenedError } from "zod";

export type ActionPrevState<T> =
  | typeToFlattenedError<T, string>
  | { success: boolean; message?: string }
  | null
  | undefined;
