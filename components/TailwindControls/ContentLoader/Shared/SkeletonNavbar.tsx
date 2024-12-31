import React from "react";

export const SkeletonNavbar = () => {
  return (
    <>
      <div className="origin-top-right absolute right-0 w-full shadow-sm h-20 sm:h-21.5 md:h-15 bg-white flex flex-row items-center">
        <div className="w-full flex flex-row items-center justify-between pl-5 pr-4">
          <img src={"/vryno_new_logo.svg"} alt="vryno logo" />
          <div className="flex flex-row">
            <div className="hidden sm:flex sm:flex-col pr-4 justify-center">
              <div className="text-right w-24 h-7 animate-pulse bg-vryno-label-gray bg-opacity-40" />
            </div>
            <div className="rounded-full justify-center items-center animate-pulse bg-vryno-theme-blue bg-opacity-60 h-12 w-12 md:w-10 md:h-10 lg:w-12 lg:h-12 mr-1" />
          </div>
        </div>
      </div>
    </>
  );
};
