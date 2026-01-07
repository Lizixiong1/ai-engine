import { API, CreateState } from "../index";

export interface PersistAPI {
  persist: {
    save(): void;
    restore(): void;
    clear(): void;
  };
}

export const persist =
  <T, A extends API<T>>(key: string) =>
  (create: CreateState<T, A>): CreateState<T, A & PersistAPI> =>
  (set, get, api) => {
    const extendedApi = api as A & PersistAPI;

    extendedApi.persist = {
      save() {
        const state = get();
        localStorage.setItem(key, JSON.stringify(state));
      },
      restore() {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        try {
          set(JSON.parse(raw), true);
        } catch {}
      },
      clear() {
        localStorage.removeItem(key);
      },
    };

    return create(set, get, extendedApi);
  };

export default persist;
