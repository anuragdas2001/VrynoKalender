import { SupportedDashboardViews } from "../../../models/shared";
import { GenericSkeletonList } from "../../../components/TailwindControls/ContentLoader/List/GenericSkeletonList";
import { GenericSkeletonCards } from "../../../components/TailwindControls/ContentLoader/Card/GenericSkeletonCards";
import React from "react";

export const InstanceItemsLoader = (
  currentView: SupportedDashboardViews,
  loadingItemCount = 3
) => {
  return currentView === SupportedDashboardViews.List ? (
    <GenericSkeletonList itemCount={loadingItemCount} />
  ) : (
    <GenericSkeletonCards itemCount={loadingItemCount} />
  );
};
