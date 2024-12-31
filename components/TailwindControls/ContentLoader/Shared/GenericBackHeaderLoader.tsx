import React from "react";

export const GenericBackHeaderLoader = () => {
  return (
    <>
      <div
        className={`w-full min-h-[53px] justify-between bg-vryno-header-color py-2 px-6 flex top-20 sm:top-[86px] md:top-[60px] shadow-md z-[500] mb-2 flex-row items-center`}
      >
        <div className={`flex items-center justify-between w-full`}>
          <div className="h-9 w-32 animate-pulse rounded-md bg-vryno-theme-blue bg-opacity-10" />
        </div>
      </div>
    </>
  );
};
