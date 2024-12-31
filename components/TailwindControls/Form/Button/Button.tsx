import React, { useCallback } from "react";
import { Loading } from "../../Loading/Loading";
import { kebabCase } from "change-case";
// import { MixpanelActions } from "../../../../screens/Shared/MixPanel";

export type ButtonProps = {
  id: string;
  children?: React.ReactElement | React.ReactNode | string;
  name?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  kind?:
    | "primary"
    | "secondary"
    | "white"
    | "back"
    | "next"
    | "danger"
    | "icon"
    | "iconInverted"
    | "invisible";
  buttonType?:
    | "thin"
    | "normal"
    | "icon"
    | "iconInverted"
    | "pointedDownBox"
    | "pointedRightBox"
    | "invisible";
  loading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  ref?: React.MutableRefObject<any>;
  contentAlignment?: "left" | "center" | "right" | "evenly";
  paddingStyle?: boolean | string;
  userEventName: string;
  customStyle?: null | string;
  customFontSize?: null | string;
  truncateText?: boolean;
  title?: string;
  dataTestId?: string;
  cssStyle?: Record<string, string>;
  renderChildrenOnly?: boolean;
};

export default function Button({
  type = "button",
  id,
  children,
  kind = "primary",
  buttonType = "normal",
  onClick = () => {},
  loading = false,
  disabled = false,
  autoFocus = false,
  contentAlignment = "center",
  ref,
  paddingStyle = false,
  userEventName,
  customStyle = null,
  customFontSize = null,
  truncateText = false,
  title = "",
  dataTestId,
  cssStyle = {},
  renderChildrenOnly = false,
}: ButtonProps) {
  const colorClassMap = {
    primary: "bg-vryno-theme-blue",
    icon: "bg-vryno-theme-light-blue",
    iconInverted: "bg-white",
    back: "bg-white",
    secondary: "bg-gray-400",
    next: "bg-vryno-theme-light-blue",
    danger: "bg-vryno-danger",
    white: "bg-white",
    invisible: "",
  };
  const finalColorClass = colorClassMap[kind];

  const callbackRef = useCallback((inputElement: any) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const paddingClassMap = {
    thin: "py-2 px-6",
    normal: "py-2 px-2",
    icon: "py-1 px-1",
    iconInverted: "py-1 px-1",
    pointedDownBox: "py-2 px-6",
    invisible: "p-0",
  };
  const overriddenBorderClasses: Record<string, string> = {
    back: "border border-vryno-theme-light-blue text-vryno-theme-light-blue",
    iconInverted: "text-vryno-theme-light-blue",
    white: "border",
    invisible: "text-vryno-icon-gray",
  };
  const finalTextClass = overriddenBorderClasses[kind] || "text-white";
  const borderRoundMap = {
    thin: "rounded-md",
    normal: "rounded-md",
    icon: "rounded-full",
    iconInverted: "rounded-full",
    invisible: "",
  };

  const widthClassOverride: Record<string, string> = {
    icon: "w-fit",
    iconInverted: "w-fit",
  };
  const finalWidthClass = widthClassOverride[buttonType] || "w-full";

  const contentAlignmentClass = {
    left: "items-center",
    center: "items-center justify-center",
    right: "items-center justify-right",
    evenly: "items-center justify-between",
  };

  return (
    <button
      id={kebabCase(id)}
      data-testid={kebabCase(dataTestId || id)}
      disabled={disabled}
      className={`${
        customStyle !== null
          ? customStyle
          : `${customFontSize ? customFontSize : "text-sm"} flex flex-row ${
              contentAlignmentClass[contentAlignment]
            } ${disabled ? "opacity-50" : ""} ${
              buttonType === "pointedDownBox"
                ? `arrow_box_down py-2 px-6`
                : buttonType === "pointedRightBox"
                ? `arrow_box_right py-2 px-2`
                : `${
                    paddingStyle ? paddingStyle : paddingClassMap[buttonType]
                  } ${finalWidthClass} ${
                    borderRoundMap[buttonType]
                  } ${finalColorClass} ${finalTextClass}`
            }`
      }`}
      type={type}
      ref={autoFocus ? callbackRef : ref}
      onClick={(e) => {
        onClick(e);
        // MixpanelActions.track(
        //   `Button:${window?.location?.hostname?.split(".")[0] || "-"}:${
        //     userEventName || id
        //   }`,
        //   { type: "click" }
        // );
      }}
      title={title}
      style={cssStyle}
    >
      {renderChildrenOnly ? (
        !loading && children
      ) : (
        <span
          className={`${
            customFontSize
              ? customFontSize
              : buttonType === "thin" || buttonType === "pointedDownBox"
              ? "text-sm"
              : "text-base"
          } ${truncateText ? "truncate" : ""}`}
        >
          {loading && <Loading color={kind === "white" ? "Black" : "White"} />}
          {!loading && children}
        </span>
      )}
    </button>
  );
}
