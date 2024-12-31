import React, { useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import ReloadIcon from "remixicon-react/RestartLineIcon";
import getNoteSuggestions from "../Notes/NoteSuggestions";
import { TimelineRecordList } from "./TimelineRecordList";
import { TimelineEventType } from "./auditLogDataExtractor";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import { IUserPreference } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import { SEARCH_QUERY } from "../../../../../../graphql/queries/searchQuery";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { LoadMoreDataComponent } from "../../../../../../components/TailwindControls/LoadMoreDataComponent";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { ILayout } from "../../../../../../models/ILayout";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const TimelineContent = ({
  recordId,
  modelName,
  userPreferences,
  moduleArray,
  updateTimelineFilter,
  timelineFilter,
  filteredTimelineData,
  fieldsList,
  timelineDataLoading,
  timelineDataReload,
  onAuditDataLoadMore,
  showLoadMore,
  onDataReload,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: {
  recordId: string;
  modelName: string;
  userPreferences: IUserPreference[];
  moduleArray: string[];
  updateTimelineFilter: (module: string) => void;
  timelineFilter: string;
  filteredTimelineData: TimelineEventType[];
  fieldsList: ICustomField[];
  timelineDataLoading: boolean;
  timelineDataReload: boolean;
  onAuditDataLoadMore: () => void;
  showLoadMore: boolean;
  onDataReload: () => void;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
}) => {
  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const noteSuggestions = getNoteSuggestions(getSearchResults);
  const { navigations } = useContext(NavigationStoreContext);
  const [layouts, setLayouts] = React.useState<{
    data: ILayout[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [modules, setModules] = React.useState<{
    data: IModuleMetadata[];
    loading: boolean;
  }>({ data: [], loading: true });

  React.useEffect(() => {
    if (navigations?.length > 0 && allLayoutFetched && allModulesFetched) {
      let modulesListFromStore = [
        ...Object.keys(genericModels)?.map(
          (module) => genericModels[module]?.moduleInfo
        ),
      ];
      let layoutsFromStore = [
        ...Object.keys(genericModels)
          ?.map((module) =>
            genericModels[module]?.layouts?.length > 0
              ? genericModels[module]?.layouts[0]
              : undefined
          )
          ?.filter((layout) => layout !== undefined),
      ];
      setModules({ data: [...modulesListFromStore], loading: false });
      setLayouts({ data: [...layoutsFromStore], loading: false });
    }
  }, [navigations, allLayoutFetched, allModulesFetched]);

  return (
    <GenericHeaderCardContainer
      cardHeading={"Timeline"}
      extended={true}
      id={recordId}
      modelName={modelName}
      userPreferences={userPreferences}
      headerButton={
        <div className="mt-2">
          {timelineDataLoading || timelineDataReload ? (
            <Loading color={"Black"} />
          ) : (
            <Button
              id="reload-timeline"
              userEventName="timeline-reload-click"
              customStyle={""}
              onClick={(e) => {
                e.stopPropagation();
                onDataReload();
              }}
            >
              <ReloadIcon size={18} color={"black"} />
            </Button>
          )}
        </div>
      }
    >
      <>
        {timelineDataLoading || layouts?.loading || modules?.loading ? (
          <ItemsLoader currentView="List" loadingItemCount={0} />
        ) : (
          <>
            <div className="w-full flex flex-wrap justify-between px-6 gap-x-4 mb-6 mx-auto">
              {["All", ...moduleArray].map((module, index) => (
                <button
                  key={index}
                  id={`timeline-${module}`}
                  data-testid={`timeline-${module}`}
                  className={`text-sm px-4 py-2 font-medium ${
                    timelineFilter === module
                      ? "text-vryno-theme-blue border-b-2 border-b-vryno-theme-blue font-semibold"
                      : ""
                  }`}
                  onClick={() => {
                    updateTimelineFilter(module);
                    MixpanelActions.track(
                      `Button:${
                        window?.location?.hostname?.split(".")[0] || "-"
                      }:${modelName}-timeline-view:${module}-click`,
                      { type: "click" }
                    );
                  }}
                >
                  <p>{`${module === "callLog" ? "CALL" : module.toUpperCase()}${
                    module !== "All" ? "S" : ""
                  }`}</p>
                </button>
              ))}
            </div>
            <TimelineRecordList
              filteredTimelineData={filteredTimelineData}
              userPreferences={userPreferences}
              modelName={modelName}
              noteSuggestions={noteSuggestions}
              fieldsList={fieldsList}
              layouts={layouts?.data}
            />
          </>
        )}
        {!filteredTimelineData?.length || !showLoadMore ? (
          <></>
        ) : (
          <LoadMoreDataComponent
            itemsCount={0}
            currentDataCount={filteredTimelineData?.length ?? 0}
            loading={timelineDataReload}
            handleLoadMoreClicked={onAuditDataLoadMore}
            bypassLoadingCheck={true}
          />
        )}
      </>
    </GenericHeaderCardContainer>
  );
};
