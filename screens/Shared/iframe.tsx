import React, { LegacyRef, useState } from "react";
import { createPortal } from "react-dom";

export const IFrame = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [contentRef, setContentRef] = useState<any>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe {...props} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
