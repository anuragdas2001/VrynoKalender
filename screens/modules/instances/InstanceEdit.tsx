import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import {
  UPDATE_INSTANCE_MUTATION,
  UpdateInstanceData,
  UpdateInstanceVars,
} from "../../../graphql/mutations/instances";
import { toast } from "react-toastify";
import { INSTANCE_DETAIL_QUERY } from "../../../graphql/queries/instances";
import { InstanceEditForm } from "./InstanceEditForm";
import { FormikValues } from "formik";
import { IInstance } from "../../../models/Accounts";
import { SupportedApps } from "../../../models/shared";
import { InstanceStoreContext } from "../../../stores/InstanceStore";
import { observer } from "mobx-react-lite";
import { PageLoader } from "../../../components/TailwindControls/ContentLoader/Shared/PageLoader";

export const InstanceEdit = observer(
  ({
    onOutsideClick,
    handleButtonClose,
    instanceId,
    supportOutsideClick = false,
  }: {
    onOutsideClick?: () => void;
    handleButtonClose?: () => void;
    instanceId?: string;
    supportOutsideClick?: boolean;
  }) => {
    const { addInstance, getById, instances } =
      useContext(InstanceStoreContext);
    const router = useRouter();
    const instanceIdByUrl = router.query.id;
    const [loadingState, setLoadingState] = React.useState(false);
    const [instanceByIdLoading, setInstanceByIdLoading] =
      React.useState<boolean>(false);
    const [instanceById, setInstanceById] = React.useState<IInstance>();
    const { t } = useTranslation("instances");

    const clickedOutSide =
      onOutsideClick ||
      (() => {
        router?.replace("/instances").then();
      });

    const closeButtonClick =
      handleButtonClose ||
      (() => {
        router?.replace("/instances").then();
      });

    const [getInstance] = useLazyQuery(INSTANCE_DETAIL_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      onCompleted: (responseOnCompletion) => {
        setInstanceByIdLoading(false);
        if (responseOnCompletion?.instance?.data) {
          setInstanceById(responseOnCompletion.instance.data);
        }
      },
      variables: {
        id: instanceId || instanceIdByUrl,
      },
    });

    React.useEffect(() => {
      if (instanceId) {
        const instance = getById(instanceId);
        if (!instance) {
          getInstance().then();
        } else {
          setInstanceById(instance);
        }
      }
    }, [instanceId]);

    React.useEffect(() => {
      if (!router.asPath.includes("edit")) return;
      if (instanceIdByUrl) {
        setInstanceByIdLoading(true);
        getInstance({
          variables: {
            id: instanceIdByUrl,
          },
        });
      }
    }, [instanceIdByUrl]);

    const [UpdateInstance] = useMutation<
      UpdateInstanceData,
      UpdateInstanceVars
    >(UPDATE_INSTANCE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (
          responseOnCompletion?.updateInstance.data &&
          responseOnCompletion?.updateInstance.messageKey.includes("-success")
        ) {
          console.log("Instance updated successfully");
          toast.success(t("instance-updated-successfully"));
          addInstance(responseOnCompletion.updateInstance.data);
          closeButtonClick();
          setLoadingState(false);
          return;
        }
        if (responseOnCompletion?.updateInstance.messageKey) {
          toast.error(responseOnCompletion.updateInstance.message);
          setLoadingState(false);
          return;
        }
        toast.error(t("common:unknown-message"));
        setLoadingState(false);
        return;
      },
    });

    const handleInstanceUpdate = async (values: FormikValues) => {
      setLoadingState(true);
      try {
        await UpdateInstance({
          variables: {
            id: instanceById?.id || "",
            instance: {
              name: values.name,
              description: values.description,
              instanceAdmins: values.instanceAdmins,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (instanceByIdLoading) {
      return (
        <div
          style={{
            height: (window.innerHeight * 4) / 6,
          }}
          className="w-full flex flex-col items-center justify-center"
        >
          <PageLoader />
        </div>
      );
    } else if (instanceById) {
      return (
        <InstanceEditForm
          supportOutsideClick={supportOutsideClick}
          instance={instanceById}
          loading={loadingState}
          handleSubmit={handleInstanceUpdate}
          onOutsideClick={clickedOutSide}
        />
      );
    } else return null;
  }
);
