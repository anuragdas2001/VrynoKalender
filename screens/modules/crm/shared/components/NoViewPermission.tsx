export const NoViewPermission = ({
  addPadding = true,
  modelName = "",
  showIcon = true,
  autoHeight = true,
  shadow = true,
  fontSize = "text-sm",
  entireMessage = true,
  customMessage,
  secondaryMessage = true,
  marginTop = "mt-0",
  containerPadding = "px-5.6 pb-5.6",
}: {
  addPadding?: boolean;
  modelName?: string;
  showIcon?: boolean;
  autoHeight?: boolean;
  shadow?: boolean;
  fontSize?:
    | "text-base"
    | "text-sm"
    | "text-xsm"
    | "text-md"
    | "text-lg"
    | "text-xl"
    | "text-sl";
  entireMessage?: boolean;
  customMessage?: string;
  secondaryMessage?: boolean;
  marginTop?: string;
  containerPadding?: string;
}) => {
  return (
    <div className={`${addPadding ? "p-6" : ""} ${marginTop}`}>
      <div
        className={`flex flex-col items-center justify-center text-center bg-white w-full rounded-2xl ${containerPadding} ${
          autoHeight && "max-h-96  h-96"
        } ${shadow && "shadow-md"}`}
      >
        {showIcon && (
          <img
            src="/no-permission-icon.svg"
            alt="No Permission Image"
            className="my-5 w-[83px]"
          />
        )}
        {customMessage ? (
          <p className={`text-vryno-gray-secondary ${fontSize}`}>
            {customMessage} <br />
            {secondaryMessage && "Contact your administrator"}
          </p>
        ) : entireMessage ? (
          <p className={`text-vryno-gray-secondary ${fontSize}`}>
            <b className="font-medium">Oops!</b> Looks like you do not have
            permission to view {modelName} <br />
            {secondaryMessage && "Contact your administrator"}
          </p>
        ) : (
          <p className={`text-vryno-gray-secondary ${fontSize}`}>
            You do not have permission to view {modelName}
          </p>
        )}
      </div>
    </div>
  );
};
