export const WidgetNoFieldPermission = ({
  message,
  displayIcon = true,
}: {
  message: string;
  displayIcon?: boolean;
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {displayIcon && (
        <img src="/nodata-visual.svg" alt="No Data" className="w-32" />
      )}
      <p
        className={`text-sm mt-2 text-vryno-card-heading-text ${
          !displayIcon ? "py-10" : ""
        }`}
      >
        {message}
      </p>
    </div>
  );
};
