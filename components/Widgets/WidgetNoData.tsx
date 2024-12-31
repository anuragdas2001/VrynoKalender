export const WidgetNoData = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <img src="/nodata-visual.svg" alt="No Data" className="w-32" />
      <p className="text-sm mt-2 text-vryno-card-heading-text">
        No data available
      </p>
    </div>
  );
};
