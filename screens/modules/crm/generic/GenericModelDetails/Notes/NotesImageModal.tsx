import ImageModal from "../../../../../../components/TailwindControls/Modals/ImageModal";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import React from "react";

export type NotesImageModalProps = {
  imageModal: { visible: boolean; alt: string; url: string };
  setImageModal: (
    value:
      | ((prevState: { visible: boolean; alt: string; url: string }) => {
          visible: boolean;
          alt: string;
          url: string;
        })
      | { visible: boolean; alt: string; url: string }
  ) => void;
};

export function NotesImageModal({
  imageModal,
  setImageModal,
}: NotesImageModalProps) {
  return (
    <>
      {imageModal.visible && (
        <>
          <ImageModal
            url={imageModal.url}
            alt={imageModal.alt}
            onOutsideClick={() =>
              setImageModal({
                visible: false,
                url: "",
                alt: "",
              })
            }
          />
          <Backdrop
            fireOnClickOnEscape={true}
            onClick={() =>
              setImageModal({
                visible: false,
                url: "",
                alt: "",
              })
            }
          />
        </>
      )}
    </>
  );
}
