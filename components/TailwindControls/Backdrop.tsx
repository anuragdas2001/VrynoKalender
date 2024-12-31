import React, { useEffect } from "react";
import { MixpanelActions } from "../../screens/Shared/MixPanel";

export type BackdropProps = {
  onClick?: () => void;
  bgFade?: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
  fireOnClickOnEscape?: boolean;
  renderFullPage?: boolean;
};

export function Backdrop({
  onClick = () => {},
  bgFade = 20,
  fireOnClickOnEscape = false,
  renderFullPage = false,
}: BackdropProps) {
  useEffect(() => {
    if (!fireOnClickOnEscape) {
      return;
    }
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClick();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <button
      className={`bg-black opacity-${bgFade} w-screen h-screen fixed top-0 left-0 ${
        renderFullPage ? "z-[2002]" : "z-[1000]"
      }`}
      onClick={() => {
        onClick();
        MixpanelActions.track(
          `Button:${
            window?.location?.hostname?.split(".")[0] || "-"
          }:backdrop-click`,
          { type: "click" }
        );
      }}
    ></button>
  );
}
