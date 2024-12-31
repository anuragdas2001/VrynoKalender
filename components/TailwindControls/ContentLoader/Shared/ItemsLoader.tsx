import { GenericSkeletonCards } from "../Card/GenericSkeletonCards";
import { GenericSkeletonList } from "../List/GenericSkeletonList";
import { SupportedDashboardViews } from "../../../../models/shared";

const ItemsLoader = ({
  currentView,
  loadingItemCount = 3,
  listTypeMarginTop = "mt-8",
}: {
  currentView: SupportedDashboardViews | string;
  loadingItemCount?: number;
  listTypeMarginTop?: string;
}) => {
  return currentView === SupportedDashboardViews.List ? (
    <GenericSkeletonList
      itemCount={loadingItemCount}
      marginTop={listTypeMarginTop}
    />
  ) : (
    <GenericSkeletonCards itemCount={loadingItemCount} />
  );
};
export default ItemsLoader;
