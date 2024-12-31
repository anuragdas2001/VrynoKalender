import React from "react";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import ViewButtonLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ViewButtonLoader";

export type GeneralScreenLoaderProps = {
  modelName: string;
  loadingCardCount?: number;
  showItemsLoader?: boolean;
};

const GeneralScreenLoader = ({
  modelName,
  loadingCardCount = 3,
  showItemsLoader = true,
}: GeneralScreenLoaderProps) => {
  return (
    <div className="flex flex-col w-full h-full p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end">
        {/* <span className="text-lg font-semibold">{`${modelName} Dashboard`}</span> */}
        <div className="flex justify-between gap-x-4 mt-10 sm:mt-0">
          {ViewButtonLoader()}
          {ViewButtonLoader()}
          {ViewButtonLoader()}
        </div>
      </div>
      {showItemsLoader && (
        <ItemsLoader
          currentView={sessionStorage.getItem("currentView") || "Card"}
          loadingItemCount={loadingCardCount}
        />
      )}
    </div>
  );
};
export default GeneralScreenLoader;
