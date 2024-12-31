import React from "react";
import { GenericSkeletonCard } from "./GenericSkeletonCard";
import { range } from "lodash";

export const GenericSkeletonCards = ({
  itemCount = 4,
}: {
  itemCount?: number;
}) => {
  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-x-6 gap-y-6">
        {range(itemCount).map((idx) => (
          <GenericSkeletonCard key={idx} />
        ))}
      </div>
    </div>
  );
};
