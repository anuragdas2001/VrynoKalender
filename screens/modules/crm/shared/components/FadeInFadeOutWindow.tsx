import React from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";

export type fadeInFadeOutWindowType = 0 | 100;

export type FadeInFadeOutProps = {
  fadeInFadeOutWindow: fadeInFadeOutWindowType;
  children?: React.ReactElement;
  onClose: () => void;
};

export const FadeInFadeOutWindow = ({
  fadeInFadeOutWindow,
  children,
  onClose,
}: FadeInFadeOutProps) => {
  return (
    <div
      className={`sidebar w-full overflow-y-hidden absolute inset-y-0 left-0 transition-opacity opacity-${fadeInFadeOutWindow.toString()}  duration-1000 ease-in `}
    >
      {children}
      <Backdrop onClick={() => onClose()} />
    </div>
  );
};
