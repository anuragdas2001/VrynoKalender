import React from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";

export type sliderWindowType = "-translate-y-full" | "-translate-x-full" | "";

export type SliderWindowProps = {
  sliderWindow: sliderWindowType;
  children?: React.ReactElement;
  onClose: () => void;
};

export const SliderWindow = ({
  sliderWindow,
  children,
  onClose,
}: SliderWindowProps) => {
  return (
    <div
      className={`w-full h-full fixed top-0 left-0 transition duration-1000 ease-in-out z-[3000] ${
        sliderWindow === "" ? "" : "hidden"
      }`}
      style={{
        transform: sliderWindow === "" ? "translateY(0)" : "translateY(-150%)",
      }}
    >
      {sliderWindow === "" && children}
      <Backdrop onClick={() => onClose()} />
    </div>
  );
};
