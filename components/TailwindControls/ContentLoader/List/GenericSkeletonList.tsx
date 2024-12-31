import React from "react";
import { range } from "lodash";

export const GenericSkeletonList = ({
  itemCount = 3,
  marginTop = "mt-8",
}: {
  itemCount?: number;
  marginTop?: string;
}) => {
  return (
    <>
      <div
        className={`bg-white px-6 pt-6 pb-6 w-full rounded-xl shadow-sm flex flex-row ${marginTop}`}
      >
        <div className="w-full overflow-x-scroll">
          <table className="w-full">
            <thead className="bg-vryno-table-background w-full">
              <tr className="">
                <th className="grid grid-cols-6 gap-4 py-5 px-6">
                  <div className="h-7 animate-pulse bg-gray-200 rounded col-span-5" />
                  <div className="h-7 animate-pulse bg-gray-300 rounded col-span-1" />
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {range(itemCount).map((idx) => (
                <tr key={idx}>
                  <td className="grid grid-cols-6 gap-4 py-5 px-6">
                    <div className="h-7 animate-pulse bg-gray-200 rounded col-span-5" />
                    <div className="h-7 animate-pulse bg-vryno-theme-blue bg-opacity-20 rounded col-span-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
