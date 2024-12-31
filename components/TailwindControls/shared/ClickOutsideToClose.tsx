import { MutableRefObject, useEffect } from "react";

export function ClickOutsideToClose(
  ref: MutableRefObject<any>,
  handleOutsideClick: (value: boolean) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleOutsideClick(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handleOutsideClick]);
}
