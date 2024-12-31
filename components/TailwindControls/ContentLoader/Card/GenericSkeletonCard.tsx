import React from "react";

export const GenericSkeletonCard = () => {
  return (
    <>
      <div className="bg-white pt-6 pl-7 pr-5 pb-3 w-full rounded-xl shadow-sm">
        <div className="border-b-2">
          <div className="flex flex-col mb-2 bg-gray-200 animate-pulse w-20 h-5" />
          <div className="animate-pulse bg-vryno-card-value bg-opacity-40 mb-4 h-4 w-16" />
          <div className="flex flex-col mb-2 bg-gray-200 animate-pulse w-28 h-5" />
          <div className="animate-pulse bg-vryno-card-value bg-opacity-40 h-4 mb-4 w-14" />
        </div>
        <div className="flex flex-row justify-end">
          <div className="animate-pulse mt-3.5 h-8 w-28 bg-vryno-theme-blue bg-opacity-30 p-1 shadow-lg" />
        </div>
      </div>
    </>
  );
};
