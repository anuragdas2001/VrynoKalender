import { Loading } from "./Loading/Loading";

export const LoadMoreDataComponent = ({
  itemsCount,
  currentDataCount,
  loading,
  handleLoadMoreClicked,
  bypassLoadingCheck = false,
}: {
  itemsCount: number;
  currentDataCount: number;
  loading: boolean;
  handleLoadMoreClicked: () => void;
  bypassLoadingCheck?: boolean;
}) => {
  return itemsCount > currentDataCount || bypassLoadingCheck ? (
    <div className="separator">
      <p
        className={`text-sm text-gray-400 flex items-center gap-x-2 cursor-pointer hover:text-vryno-theme-light-blue`}
        onClick={() => {
          handleLoadMoreClicked();
        }}
      >
        {loading ? <Loading color="Blue" /> : "Load More"}
      </p>
    </div>
  ) : (
    <></>
  );
};
