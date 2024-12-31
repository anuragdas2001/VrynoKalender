import React from "react";
import _ from "lodash";

enum backgroundColors {
  "vryno-blue" = "vryno-theme-light-blue",
  "black" = "black",
  "danger" = "vryno-danger",
  "warning" = "vryno-warning-secondary",
  "info" = "toast-info-color",
  "message" = "vryno-message",
  "grey" = "gray-400",
}

const GenericBanner = ({
  messageList,
  backgroundColor = "vryno-blue",
  marginFromTop = 0,
  type,
}: {
  messageList: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  backgroundColor?:
    | "vryno-blue"
    | "black"
    | "danger"
    | "warning"
    | "info"
    | "message"
    | "grey";
  marginFromTop?: 0 | 5;
  type?: "Instance" | "Application";
}) => {
  if (!messageList.length) return null;
  return (
    <div
      className={`origin-top-right sticky top-${marginFromTop} right-0 z-[999] w-full h-[20px] bg-${backgroundColors[backgroundColor]} text-white text-xsm flex items-center justify-center`}
    >
      <p
        data-testid={`${type}-banner-message`}
        dangerouslySetInnerHTML={{
          __html: `${_.get(
            messageList[messageList.length - 1].message,
            "message",
            ""
          )}`,
        }}
      />
    </div>
  );
};

export default GenericBanner;
