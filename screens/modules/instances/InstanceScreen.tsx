import React, { useContext, useEffect } from "react";
import {
  INSTANCE_LIST_QUERY,
  InstanceListData,
} from "../../../graphql/queries/instances";
import { useLazyQuery } from "@apollo/client";
import { Config } from "../../../shared/constants";
import { atRootApp } from "../../../shared/instanceUtils";
import { InstanceDashboard } from "./InstanceDashboard";
import { SupportedApps } from "../../../models/shared";
import { InstanceStoreContext } from "../../../stores/InstanceStore";
import { observer } from "mobx-react-lite";
import { getAppPathParts } from "../crm/shared/utils/getAppPathParts";
import { IInstance } from "../../../models/Accounts";

export interface IInstanceData extends IInstance {
  logo: string;
}

export const InstanceScreen = observer(() => {
  const { modelName } = getAppPathParts();
  const { importAllInstances, instances, itemsCount, setItemsCount } =
    useContext(InstanceStoreContext);
  const [dataProcessingCompleted, setDataProcessingCompleted] =
    React.useState(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);

  const [getInstances] = useLazyQuery<InstanceListData>(INSTANCE_LIST_QUERY, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion) {
        importAllInstances(
          responseOnCompletion.instances.data,
          currentPageNumber ?? 1,
          responseOnCompletion.instances.count
        );
        // importInstances(responseOnCompletion.instances.data);
        setItemsCount(responseOnCompletion.instances.count);
        setDataProcessingCompleted(true);
      }
    },
  });

  useEffect(() => {
    if (!atRootApp()) {
      window.location.href = Config.publicRootUrl();
      return;
    }
    if (instances.length === 0) {
      getInstances();
    } else {
      setDataProcessingCompleted(true);
    }
  }, []);

  useEffect(() => {
    if (instances.length === 0 || instances.length === 1) {
      getInstances();
    }
  }, [instances]);

  return (
    <InstanceDashboard
      instances={
        instances?.slice((currentPageNumber - 1) * 50, currentPageNumber * 50)
          .length > 0
          ? instances
              ?.slice((currentPageNumber - 1) * 50, currentPageNumber * 50)
              .filter((instance) => instance != null)
          : []
      }
      loading={!dataProcessingCompleted}
      loadingItemCount={4}
      dataProcessingCompleted={dataProcessingCompleted}
      modelName={modelName}
      itemsCount={itemsCount}
      setItemsCount={(value) => setItemsCount(value)}
      currentPageNumber={currentPageNumber}
      onPageChange={(pageNumber) => {
        setDataProcessingCompleted(false);
        getInstances({
          variables: {
            pageNumber: pageNumber,
          },
        });
        setCurrentPageNumber(pageNumber);
      }}
    />
  );
});
