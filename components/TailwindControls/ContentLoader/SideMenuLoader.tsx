import React from "react";
import { range } from "lodash";

export const SideMenuLoader = ({ itemCount = 5 }: { itemCount?: number }) => {
  return (
    <div className="bg-white mt-8 p-6 w-full  flex flex-col">
      {range(itemCount).map((index) => (
        <div
          className="h-7 animate-pulse py-5 px-6 bg-gray-200 w-full mb-4"
          key={index}
        />
      ))}
    </div>
  );
};
