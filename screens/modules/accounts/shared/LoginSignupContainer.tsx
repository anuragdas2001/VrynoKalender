import React from "react";
import RecaptchaFooter from "../Login/RecaptchaFooter";

export const VrynoLogo = () => (
  <img src={"/vryno_new_logo.svg"} alt="vryno logo" />
);

export const LoginSignupContainer = ({
  children = <></>,
  title = "",
  footer = <></>,
  showCaptchaMessage = false,
  widthClass = "sm:w-97",
  hideLogoOnBigResolution = false,
  leftPanel = <></>,
  applyPadding = false,
}) => {
  return (
    <div className="flex h-screen">
      <div
        className={`w-[604px] lg:w-[924px] m-auto px-5 md:px-0 flex justify-center`}
      >
        <div>
          <div className={`pb-2 ${hideLogoOnBigResolution && "lg:hidden"}`}>
            <VrynoLogo />
          </div>
          <div className="lg:flex">
            {leftPanel}
            <div
              style={{ width: widthClass }}
              className={`bg-white flex flex-col justify-center rounded-xl shadow-lg px-5 py-7`}
            >
              {title && <div className="mb-3 text-lg font-bold">{title}</div>}
              {children}
            </div>
          </div>
          {footer && <div className="text-center mt-5">{footer}</div>}
          {showCaptchaMessage && (
            <div className={`${widthClass}`}>
              <RecaptchaFooter />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
