import { createContext, useContext, useMemo, useState } from "react";
const Ctx = createContext(null);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0);

  const value = useMemo(() => ({
    isLoading: count > 0,
    show: () => setCount((c) => c + 1),
    hide: () => setCount((c) => Math.max(0, c - 1)),
  }), [count]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLoading = () => useContext(Ctx);