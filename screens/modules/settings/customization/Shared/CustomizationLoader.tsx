import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";

export const CustomizationLoader = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <div className="px-6 mb-6 w-full ">
      <ItemsLoader currentView="List" loadingItemCount={2} />
    </div>
  );
};
