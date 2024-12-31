import React from "react";

export const DashboardFormSkeletonLoader = ({
  itemCount = 4,
}: {
  itemCount?: number;
}) => {
  return (
    <>
      <div className="p-5 pt-5 mt-3 rounded-xl h-102 bg-white shadow-md">
        <div className="items-center bg-gray-300 animate-pulse pt-5.6 pb-4.5 w-52 rounded border-b" />
        <div className="w-36 md:ml-4 mt-2 h-6 bg-gray-400 animate-pulse" />
        <div className="w-5/6 md:ml-4 mt-2 h-10 bg-gray-200 animate-pulse" />
        <div className="md:ml-4 grid md:grid-cols-2 md:gap-x-4">
          <div className="hidden md:flex mt-6 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-10" />
          <div className="hidden md:flex mt-6 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-10" />
          <div className="hidden md:flex mt-6 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-30" />
          <div className="hidden md:flex mt-6 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-30" />
          <div className="mt-7 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-10" />
          <div className="mt-7 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-10" />
          <div className="mt-7 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-30" />
          <div className="mt-7 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-30" />
          <div className="mt-7 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-10" />
          <div className="mt-7 w-64 h-8 animate-pulse bg-vryno-theme-blue-secondary bg-opacity-10" />
        </div>
        <div className="flex flex-row justify-end items-center">
          <div className="animate-pulse w-48 h-12 rounded-md mt-7 mr-1.5 bg-vryno-theme-blue-secondary bg-opacity-60" />
        </div>
      </div>
    </>
  );
};
