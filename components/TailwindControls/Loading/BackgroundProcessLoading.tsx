export const BackgroundProccessLoading = ({
  backgroundProcessLoading,
}: {
  backgroundProcessLoading: boolean;
}) => {
  if (backgroundProcessLoading) {
    return <div className={`h-[5px] w-full animate-pulse bg-blue-300`}></div>;
  } else {
    return <div className={`h-[5px] w-full bg-white shadow-sm`}></div>;
  }
};
