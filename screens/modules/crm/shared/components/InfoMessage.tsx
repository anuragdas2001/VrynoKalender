import React from "react";
import WarningFillIcon from "remixicon-react/ErrorWarningFillIcon";
import InformationFillIcon from "remixicon-react/InformationFillIcon";

export type InfoMessageProps = {
  messageType: "warning" | "information" | "none";
  message?: string;
  children?: React.ReactElement;
  alignItems?: "left" | "center" | "right";
};

export const InfoMessage = ({
  messageType,
  message,
  children,
  alignItems = "center",
}: InfoMessageProps) => {
  const MessageIconMapper = {
    warning: <WarningFillIcon className="mr-2 text-red-300" />,
    information: (
      <InformationFillIcon className="mr-2 text-vryno-theme-light-blue" />
    ),
    none: <></>,
  };

  const Backgroundmapper = {
    warning: "bg-gray-100",
    information: "bg-gray-100",
    none: "bg-gray-100",
  };

  const AlignContent = {
    left: "flex items-center justify-start",
    center: "flex items-center justify-center",
    right: "flex items-center justify-end",
  };

  return (
    <span
      className={`${Backgroundmapper[messageType]} w-full text-xsm ${AlignContent[alignItems]} p-2 rounded-lg my-2`}
    >
      {MessageIconMapper[messageType]}
      <span className={`px-2`}>{message}</span>
      {children}
    </span>
  );
};
