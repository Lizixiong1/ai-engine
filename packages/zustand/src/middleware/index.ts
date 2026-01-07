import { API, CreateState } from "../index";
import persist from "./persist";
export type Middleware<T, A extends API<T>, E extends object> = (
  create: CreateState<T, A>
) => CreateState<T, A & E>;

export { persist };
