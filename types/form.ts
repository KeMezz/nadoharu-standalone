import { typeToFlattenedError } from "zod";

export type ActionPrevState<T> =
  | typeToFlattenedError<T, string>
  | null
  | undefined;
