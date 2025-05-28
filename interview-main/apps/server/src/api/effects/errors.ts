import { Data } from "effect";

export class DBError extends Data.TaggedError("DBError")<{
  cause?: unknown;
  operation: "insert" | "update" | "delete" | "findMany";
  message: string;
}> {}

export class RecordNotFoundError extends Data.TaggedError(
  "RecordNotFoundError",
)<{
  message: string;
  tableName: string;
}> {}
export class RecordAlreadyExistsError extends Data.TaggedError(
  "RecordAlreadyExistsError",
)<{
  message: string;
  tableName: string;
}> {}
