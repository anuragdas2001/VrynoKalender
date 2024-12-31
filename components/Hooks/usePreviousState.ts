import { useRef, useEffect } from "react";

export const usePrevious = <T extends unknown>(data: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = data;
  });
  return ref.current;
};
