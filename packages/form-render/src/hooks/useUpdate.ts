import { useCallback, useEffect, useRef, useState } from "react";

export default function useUpdate() {
  const [_, update] = useState({});
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return useCallback(() => isMounted.current && update({}), []);
}
