import React from "react";
import { SingleWidgetLoader } from "../../../../../components/TailwindControls/ContentLoader/Card/DashboardSkeletonLoader";
import { IWidget } from "../../../../../models/Dashboard";
import { AppModels } from "../../../../../models/AppModels";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { WidgetKeyComponentMapper } from "./WidgetKeyComponentMapper";
import { IndexExpressionMapper } from "../../generic/GenericAddCustomView/customViewHelpers/customViewShared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../models/Accounts";
import { IUserPreference } from "../../../../../models/shared";

const erroredWidgetData: IWidget = {
  id: "",
  fieldPermissionMessage: null,
  name: "",
  key: "",
  widgetType: "",
  widgetMetadata: null,
  moduleViewId: [],
  customView: [],
};

const Widget = ({
  data,
  widgetFilterDataLoading,
  timezone,
  genericModels,
  allLayoutFetched,
  userPreferences,
  user,
  handleFilterSelection = () => {},
  handleWidgetViewOnPreference,
}: {
  data: IWidget | undefined;
  widgetFilterDataLoading: boolean;
  timezone: string;
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  handleFilterSelection?: (
    value: "null" | "day" | "week" | "month" | "year",
    pageNumber?: number
  ) => void;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
}) => {
  return (
    <WidgetKeyComponentMapper
      data={data}
      timezone={timezone}
      widgetFilterDataLoading={widgetFilterDataLoading}
      user={user}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
      userPreferences={userPreferences}
      handleFilterSelection={(value, pageNumber) =>
        handleFilterSelection(value, pageNumber)
      }
      handleWidgetViewOnPreference={handleWidgetViewOnPreference}
    />
  );
};

const widgetCardFilters = {
  day: {
    name: "createdAt",
    operator: "between",
    value: ["${todayBegin}", "${todayEnd}"],
  },
  week: {
    name: "createdAt",
    operator: "between",
    value: ["${thisWeekBegin}", "${thisWeekEnd}"],
  },
  month: {
    name: "createdAt",
    operator: "between",
    value: ["${thisMonthBegin}", "${thisMonthEnd}"],
  },
  year: {
    name: "createdAt",
    operator: "between",
    value: ["${thisYearBegin}", "${thisYearEnd}"],
  },
};

export const DashboardWidget = ({
  widgetId,
  timezone,
  user,
  genericModels,
  allLayoutFetched,
  userPreferences,
  handleWidgetViewOnPreference,
}: {
  widgetId: string;
  timezone: string;
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
}) => {
  const { appName } = getAppPathParts();
  const [widgetData, setWidgetData] = React.useState<IWidget | undefined>(
    undefined
  );
  const [viewPermission, setViewPermission] = React.useState<boolean>(true);
  const [widgetDataFetchLoading, setWidgetDataFetchLoading] =
    React.useState<boolean>(true);
  const [widgetFilterDataLoading, setWidgetFilterDataLoading] =
    React.useState<boolean>(false);

  const [fetchWidgetData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        if (responseOnCompletion?.fetch?.data?.length) {
          if (
            responseOnCompletion?.fetch?.data[0]?.customView?.messageKey ===
            "field-permission-required"
          ) {
            setWidgetData({
              id: responseOnCompletion?.fetch?.data[0]?.id,
              fieldPermissionMessage:
                responseOnCompletion?.fetch?.data[0]?.customView?.message ||
                "You do not have field permission",
              name: responseOnCompletion?.fetch?.data[0]?.name,
              key: responseOnCompletion?.fetch?.data[0]?.key,
              widgetType: responseOnCompletion?.fetch?.data[0]?.widgetType,
              widgetMetadata:
                responseOnCompletion?.fetch?.data[0]?.widgetMetadata,
              moduleViewId: [],
              customView: [],
            });
            setViewPermission(true);
            setWidgetDataFetchLoading(false);
            return;
          }
          setWidgetData({
            ...responseOnCompletion?.fetch?.data[0],
            fieldPermissionMessage: null,
          });
          setViewPermission(true);
          setWidgetDataFetchLoading(false);
          return;
        } else {
          setWidgetData(erroredWidgetData);
          setViewPermission(true);
          setWidgetDataFetchLoading(false);
          return;
        }
      } else if (
        responseOnCompletion?.fetch?.messageKey.includes("requires-view")
      ) {
        setViewPermission(false);
      }
      setWidgetData(erroredWidgetData);
      setWidgetDataFetchLoading(false);
    },
    onError: (error) => {
      setWidgetData(erroredWidgetData);
      setWidgetDataFetchLoading(false);
    },
  });

  const [fetchFilteredWidgetData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  React.useEffect(() => {
    if (!widgetId) return;
    setWidgetDataFetchLoading(true);
    const handleFetchWidgetData = async () => {
      await fetchWidgetData({
        variables: {
          modelName: AppModels.Widget,
          fields: [
            "id",
            "name",
            "key",
            "widgetType",
            "moduleViewId",
            "widgetMetadata",
            "customView",
          ],
          filters: [{ name: "id", operator: "eq", value: [widgetId] }],
          options: {
            processedData: true,
          },
        },
      }).then();
    };
    if (!appName) return;
    handleFetchWidgetData();
  }, [widgetId, appName]);

  const handleFilterSelection = async (
    value: "null" | "day" | "week" | "month" | "year",
    pageNumber?: number
  ) => {
    setWidgetFilterDataLoading(true);
    await fetchFilteredWidgetData({
      variables: {
        modelName:
          widgetData?.customView[0].customViewQuery.variables.modelName,
        fields: [...widgetData?.customView[0].customViewQuery.variables.fields],
        filters:
          value === "null"
            ? widgetData?.customView[0].customViewQuery.variables.filters
              ? widgetData?.customView[0].customViewQuery.variables.filters
              : []
            : widgetData?.customView[0].customViewQuery.variables.filters
            ? [
                ...widgetData?.customView[0].customViewQuery.variables.filters,
                widgetCardFilters[value],
              ]
            : widgetCardFilters[value],
        expression: widgetData?.customView[0].expression
          ? value === "null"
            ? widgetData?.customView[0].expression
            : "( " +
              widgetData?.customView[0].expression +
              " and " +
              IndexExpressionMapper[
                widgetData?.customView[0].customViewQuery.variables.filters
                  .length + 1
              ] +
              " )"
          : null,
        pageNumber: pageNumber ?? 1,
      },
    }).then((response) => {
      if (response.data?.fetch?.data) {
        setWidgetData({
          id: widgetData?.name ?? "",
          fieldPermissionMessage: null,
          name: widgetData?.name ?? "",
          key: widgetData?.key ? widgetData.key : "",
          widgetType: widgetData?.widgetType ?? "",
          widgetMetadata: null,
          moduleViewId: widgetData?.moduleViewId ?? [],
          customView: [
            {
              ...widgetData?.customView[0],
              customViewData: response.data.fetch.data ?? [],
            },
          ],
        });
        setViewPermission(true);
        setWidgetFilterDataLoading(false);
        return;
      } else if (response.data?.fetch?.messageKey.includes("requires-view")) {
        setWidgetData(erroredWidgetData);
        setViewPermission(false);
      }
      setWidgetFilterDataLoading(false);
    });
  };

  return widgetDataFetchLoading ? (
    <SingleWidgetLoader />
  ) : viewPermission ? (
    <Widget
      data={widgetData}
      widgetFilterDataLoading={widgetFilterDataLoading}
      timezone={timezone}
      user={user}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
      userPreferences={userPreferences}
      handleFilterSelection={(filter, pageNumber) =>
        handleFilterSelection(filter, pageNumber)
      }
      handleWidgetViewOnPreference={handleWidgetViewOnPreference}
    />
  ) : (
    <NoViewPermission modelName={"Widget"} entireMessage={false} />
  );
};
