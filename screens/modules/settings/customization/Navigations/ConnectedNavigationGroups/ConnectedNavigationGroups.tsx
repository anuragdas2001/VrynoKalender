import React from "react";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import NavigationsGroupsList from "./NavigationsGroupsList";
import { INavigation } from "../../../../../../models/INavigation";
import { CustomizationLoader } from "../../Shared/CustomizationLoader";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { CustomizationContainer } from "../../Shared/CustomizationContainer";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { NoViewPermission } from "../../../../crm/shared/components/NoViewPermission";
import DataLoadErrorContainer from "../../../../crm/shared/components/DataLoadErrorContainer";

const navigationFetchVariable = {
  modelName: "NavigationItem",
  fields: [
    "label",
    "groupKey",
    "uniqueName",
    "navType",
    "name",
    "visible",
    "order",
    "systemDefined",
    "parentNavigation",
    "navTypeMetadata",
  ],
  filters: [],
};

export const ConnectedNavigationGroups = () => {
  const { appName } = getAppPathParts();
  const [navigations, setNavigations] = React.useState<INavigation[]>([]);
  const [viewPermission, setViewPermission] = React.useState(true);
  const [navigationFetchLoading, setNavigationFetchLoading] =
    React.useState(true);
  const [errorLoadingPage, setErrorLoadingPage] = React.useState(false);
  const [reloadingPage, setReloadingPage] = React.useState(false);

  const [fetchNavigations] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (data) => {
      setNavigationFetchLoading(false);
      setErrorLoadingPage(false);
      setReloadingPage(false);
      if (data?.fetch?.data) {
        setNavigations(data?.fetch?.data);
        setViewPermission(true);
      } else if (data?.fetch.messageKey.includes("requires-view")) {
        toast.error(data?.fetch.message);
        setViewPermission(false);
      }
    },
    onError: () => {
      setErrorLoadingPage(true);
      setReloadingPage(false);
    },
  });

  React.useEffect(() => {
    if (navigations.length === 0 && appName) {
      fetchNavigations({
        variables: navigationFetchVariable,
      });
    }
  }, [navigations, appName]);

  React.useEffect(() => {
    if (reloadingPage && appName) {
      setReloadingPage(false);
      fetchNavigations({
        variables: navigationFetchVariable,
      });
    }
  }, [reloadingPage, appName]);

  return (
    <CustomizationContainer
      heading={"Navigations"}
      subHeading={""}
      showTabBar={true}
    >
      {viewPermission ? (
        errorLoadingPage ? (
          <DataLoadErrorContainer
            onClick={() => {
              setNavigationFetchLoading(true);
              setReloadingPage(true);
            }}
          />
        ) : (
          <>
            <CustomizationLoader loading={navigationFetchLoading} />
            <NavigationsGroupsList navigations={navigations} />
          </>
        )
      ) : (
        <NoViewPermission shadow={false} />
      )}
    </CustomizationContainer>
  );
};
