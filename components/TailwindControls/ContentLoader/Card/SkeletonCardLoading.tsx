import React from "react";
import { GenericSkeletonCard } from "./GenericSkeletonCard";
import { SkeletonNavbar } from "../Shared/SkeletonNavbar";

export const SkeletonCardLoading = () => {
  return (
    <>
      <SkeletonNavbar />
      <div className="flex flex-col w-full h-full p-6 pt-28 sm:pt-28 md:pt-21.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-pulse h-8 w-64 rounded-md bg-gray-300 flex" />
          <div className="grid grid-cols-3 sm:grid-cols-2 gap-x-4 mt-10 sm:mt-0">
            <div className="h-13 w-32 animate-pulse rounded-md bg-vryno-theme-blue bg-opacity-10 p-1 shadow-lg" />
            <div className="sm:hidden" />
            <div className="sm:hidden animate-pulse h-13 w-24 rounded-md bg-vryno-theme-blue bg-opacity-30 p-1 shadow-lg" />
            <div className="hidden sm:flex animate-pulse h-13 w-32 rounded-md bg-vryno-theme-blue bg-opacity-30 p-1 shadow-lg" />
          </div>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-x-3 gap-y-3">
          <GenericSkeletonCard />
          <GenericSkeletonCard />
          <GenericSkeletonCard />
          <GenericSkeletonCard />
        </div>
      </div>
    </>
  );
};
