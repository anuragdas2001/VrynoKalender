import React, { useRef } from "react";
import { SecureImage } from "../Form/SecureImage/SecureImage";
import { ClickOutsideToClose } from "../shared/ClickOutsideToClose";

export type ImageModalTypes = {
  url: string;
  alt: string;
  onOutsideClick?: (value: boolean) => void;
};

export default function ImageModal({
  url,
  alt,
  onOutsideClick = () => {},
}: ImageModalTypes) {
  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value) => onOutsideClick(value));

  return (
    <div className="w-screen h-screen z-[2000] fixed top-0 left-0 flex items-center justify-center">
      <div
        className="rounded-xl shadow-lg bg-white mx-5 flex flex-col items-center"
        ref={wrapperRef}
      >
        <SecureImage
          url={url}
          alt={alt ? alt : "Notes Attachment"}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
