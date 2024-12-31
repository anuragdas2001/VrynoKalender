import { Toast } from "../../../../components/TailwindControls/Toast";
import { Config } from "../../../../shared/constants";
import { redirectAsPerInstances } from "../../shared";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { InstanceStoreContext } from "../../../../stores/InstanceStore";
import { useLazyQuery } from "@apollo/client";
import {
  INSTANCE_LIST_QUERY,
  InstanceListData,
} from "../../../../graphql/queries/instances";
import { queryOptionsAccounts } from "../../../../shared/apolloClient";

export const RedirectToInstances = ({
  setInstanceProcessing,
  loginSuccess,
}: {
  setInstanceProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  loginSuccess: boolean;
}) => {
  const router = useRouter();
  const { t } = useTranslation(["login", "common"]);
  const { locale } = router;
  const { importAllInstances, resetInstances, setItemsCount } =
    useContext(InstanceStoreContext);

  const [getInstanceList] = useLazyQuery<InstanceListData>(
    INSTANCE_LIST_QUERY,
    {
      ...queryOptionsAccounts,
      ...{
        fetchPolicy: "no-cache",
      },
    }
  );
  const getInstancesAndRedirect = async () => {
    resetInstances();
    setInstanceProcessing(true);
    const { error, data } = await getInstanceList();
    if (error || !(data && data.instances)) {
      Toast.error(
        `${t("common:unknown-message")}, ${
          Config.isClientDevMode() ? error?.message : ""
        }`
      );
      setInstanceProcessing(false);
      return;
    }
    const instances = data.instances.data;
    setItemsCount(data.instances.count);
    importAllInstances(instances, 1, data.instances.count);
    // importInstances(instances);
    redirectAsPerInstances(instances, router, locale);
    // setInstanceProcessing(false);
  };

  React.useEffect(() => {
    if (loginSuccess) {
      getInstancesAndRedirect();
    }
  }, [loginSuccess]);

  return <></>;
};
