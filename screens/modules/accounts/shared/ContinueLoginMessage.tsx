import Link from "next/link";
import React from "react";

export const ContinueLoginMessage = ({
  imagePath,
  heading,
  message,
}: {
  imagePath: string;
  heading?: React.ReactNode;
  message: React.ReactNode;
}) => {
  return (
    <>
      <div className="flex flex-col">
        <img className="mx-auto my-7" src={imagePath} alt="continue login" />
        {heading && (
          <span id="congratulations-label" className="text-lg font-bold ">
            {heading}
          </span>
        )}
        <span className="text-sm mb-7">{message}</span>
        <Link href="/login" passHref legacyBehavior>
          <a
            id="continue-login-link"
            className="py-2 text-center text-white rounded-md bg-vryno-theme-blue"
          >
            Continue to Login
          </a>
        </Link>
      </div>
    </>
  );
};
