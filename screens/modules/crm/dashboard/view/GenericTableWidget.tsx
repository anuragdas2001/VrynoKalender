import React from "react";
import { GenericWidgetCard } from "./GenericWidgetCard";
import { ICustomField } from "../../../../../models/ICustomField";
import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { WidgetNoData } from "../../../../../components/Widgets/WidgetNoData";
import { getDataObjectArrayForCustomViews } from "../../shared/utils/getDataObject";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { getAppPathParts } from "../../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { getSortedFieldList } from "../../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import {
  SingleWidgetDataLoader,
  SingleWidgetLoader,
} from "../../../../../components/TailwindControls/ContentLoader/Card/DashboardSkeletonLoader";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

const GenericTableWidget = ({
  widgetName,
  widgetId,
  widgetFilterDataLoading,
  widgetHeaders,
  data,
  moduleName,
  totalRecords = 0,
  handleFilterSelection = () => {},
  showFilterBar,
  genericModels,
  userPreferences,
  allLayoutFetched,
  handleWidgetViewOnPreference,
}: {
  widgetName: string;
  widgetId: string;
  widgetFilterDataLoading: boolean;
  widgetHeaders: Array<string>;
  data: BaseGenericObjectType[];
  moduleName: string;
  totalRecords?: number;
  handleFilterSelection?: (
    value: "null" | "day" | "week" | "month" | "year",
    pageNumber?: number
  ) => void;
  showFilterBar?: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
}) => {
  const { appName } = getAppPathParts();
  const [dataFetchLoading, setDataFetchLoading] = React.useState<boolean>(true);
  const [fieldsList, setFieldsList] = React.useState<{
    data: ICustomField[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [filterIsActive, setFilterIsActive] = React.useState<string>("null");
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);

  React.useEffect(() => {
    if (!moduleName || !allLayoutFetched) return;
    let fieldList: ICustomField[] = [];
    for (let index = 0; index < widgetHeaders.length; index++) {
      let findField = genericModels[moduleName]?.fieldsList?.filter((field) => {
        if (field.systemDefined) {
          if (field.name === widgetHeaders[index]) return field;
        } else {
          if (`fields.${field.name}` === widgetHeaders[index]) return field;
        }
      });
      if (findField?.length > 0) fieldList = fieldList?.concat([findField[0]]);
    }
    setFieldsList({ data: [...getSortedFieldList(fieldList)], loading: false });
    setDataFetchLoading(false);
  }, [moduleName, allLayoutFetched]);

  return (
    <>
      {dataFetchLoading ? (
        <SingleWidgetLoader />
      ) : (
        <GenericWidgetCard
          widgetName={widgetName}
          filterIsActive={filterIsActive}
          setFilterIsActive={(value) => setFilterIsActive(value)}
          handleFilterSelection={(value) => handleFilterSelection(value)}
          showCardInfo={false}
          showFilterBar={showFilterBar}
          widgetId={widgetId}
          totalRecords={totalRecords}
          userPreferences={userPreferences}
          handleWidgetViewOnPreference={handleWidgetViewOnPreference}
          showPageChanger={true}
          showPagination={true}
          currentPageItemCount={getDataObjectArrayForCustomViews(data)?.length}
          currentPageNumber={currentPageNumber}
          handlePageChange={(filter, pageNumber) => {
            setCurrentPageNumber(pageNumber);
            handleFilterSelection(filter, pageNumber);
          }}
        >
          <div className="w-full h-full p-4 pb-15">
            <div
              className={`w-full h-full overflow-auto sm:overflow-hidden sm:hover:overflow-auto pb-2`}
            >
              {widgetFilterDataLoading || fieldsList?.loading ? (
                <SingleWidgetDataLoader />
              ) : data && data.length > 0 ? (
                moduleName !== "note" ? (
                  <GenericList
                    data={getDataObjectArrayForCustomViews(data)}
                    tableHeaders={fieldsList?.data
                      ?.filter((field) => field.visible)
                      .map((field) => {
                        return {
                          label: field.label.en,
                          columnName: field.name,
                          dataType: field.dataType,
                        };
                      })}
                    fieldsList={fieldsList?.data}
                    onDetail={true}
                    showIcons={false}
                    listSelector={false}
                    imageSize={`w-12 h-12`}
                    rowUrlGenerator={(item) =>
                      appsUrlGenerator(
                        appName,
                        moduleName,
                        AllowedViews.detail,
                        item.id as string
                      )
                    }
                    externalModelName={moduleName}
                    truncate={true}
                  />
                ) : (
                  <GenericList
                    data={getDataObjectArrayForCustomViews(data)}
                    tableHeaders={fieldsList?.data
                      .filter((field) => field.dataType !== "relatedTo")
                      .map((field) => {
                        return {
                          label: field.label.en,
                          columnName: field.name,
                          dataType: field.dataType,
                        };
                      })}
                    fieldsList={fieldsList?.data}
                    onDetail={true}
                    showIcons={false}
                    listSelector={false}
                    imageSize={`w-16 h-16`}
                    externalModelName={moduleName}
                    rowUrlGenerator={(value) => {
                      return value.relatedTo
                        ? appsUrlGenerator(
                            appName,
                            value.relatedTo[0]?.moduleName,
                            AllowedViews.detail,
                            value.relatedTo[0]?.recordId
                          )
                        : "#";
                    }}
                    target="_blank"
                    truncate={true}
                  />
                )
              ) : (
                <WidgetNoData />
              )}
            </div>
          </div>
        </GenericWidgetCard>
      )}
    </>
  );
};
export default GenericTableWidget;
