import React from "react";

export const SingleWidgetDataLoader = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="animate-pulse bg-vryno-theme-blue bg-opacity-10 mr-20 ml-14 h-8 mt-4 " />
        <div className="animate-pulse bg-gray-200 mr-20 ml-14 h-8 mt-4 " />
        <div className="animate-pulse bg-gray-200 mr-28 ml-14 h-8 mt-4" />
        <div className="animate-pulse bg-gray-200 w-60 h-8 mt-4 ml-14" />
      </div>
    </>
  );
};

export const SingleWidgetLoader = () => {
  return (
    <div className="bg-white px-5 pb-5 w-full h-80 max-h-80 rounded-xl">
      <div className="grid grid-cols-12 bg-white pt-5.6 pb-4.5 border-b">
        <div className="animate-pulse bg-gray-200 w-36 h-8 col-span-6" />
        <div className="flex flex-row items-end justify-end col-span-6">
          <div className="mx-1 w-14 h-7 py-1 animate-pulse bg-vryno-theme-blue rounded-md bg-opacity-30" />
        </div>
      </div>
      <SingleWidgetDataLoader />
    </div>
  );
};

export const DashboardSkeletonLoader = ({
  itemCount = 6,
}: {
  itemCount?: number;
}) => {
  return (
    <div className="w-full h-full">
      <div className="my-5.5 px-6 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4  md:gap-x-10 gap-y-9">
        {Array.from(Array(itemCount).keys()).map((key, index) => (
          <SingleWidgetLoader key={index} />
        ))}
      </div>
    </div>
  );
};
