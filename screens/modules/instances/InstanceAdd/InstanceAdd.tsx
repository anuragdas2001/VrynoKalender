import React, { useContext, useState } from "react";
import { ConnectedInstanceAddForm } from "./ConnectedInstanceAddForm";
import { useMutation } from "@apollo/client";
import {
  CREATE_INSTANCE_MUTATION,
  CreateInstanceData,
  CreateInstanceVars,
} from "../../../../graphql/mutations/instances";
import { useTranslation } from "next-i18next";
import { subdomainSlugify } from "../subdomainSlugify";
import {
  SETUP_SERVICE_MUTATION,
  SetupServiceData,
} from "../../../../graphql/mutations/applications";
import { useRouter } from "next/router";
import { Toast } from "../../../../components/TailwindControls/Toast";
import { accountsContext } from "../../../../shared/apolloClient";
import { mutationResponseHandler } from "../../../../shared/serverResponseHandlingUtils";
import { cookieUserStore } from "../../../../shared/CookieUserStore";
import { IInstance } from "../../../../models/Accounts";
import { InstanceStoreContext } from "../../../../stores/InstanceStore";

export const InstanceAdd = ({
  onOutsideClick,
  handleButtonClose,
  renderFullPage = false,
  itemsCount = 0,
  setItemsCount = () => {},
}: {
  handleButtonClose: () => void;
  onOutsideClick: (value: boolean) => void;
  renderFullPage?: boolean;
  itemsCount?: number;
  setItemsCount?: (value: number) => void;
}) => {
  const user = cookieUserStore.getUserDetails();
  const [loadingState, setLoadingState] = useState(false);
  const [currentSubdomain, setCurrentSubdomain] = useState("");
  const [processCompleted, setProcessCompleted] = useState(false);

  const { t } = useTranslation("instances");
  const router = useRouter();
  const servicesToSetup = ["crm", "accounts", "workflow", "notify"];

  const [setupService] = useMutation<SetupServiceData>(SETUP_SERVICE_MUTATION);
  const { addInstance } = useContext(InstanceStoreContext);

  const [steps, setSteps] = React.useState(0);

  const [createInstance] = useMutation<CreateInstanceData, CreateInstanceVars>(
    CREATE_INSTANCE_MUTATION,
    {
      onCompleted: (responseOnCompletion) => {
        if (
          responseOnCompletion?.createInstance?.messageKey?.includes("-success")
        ) {
          addInstance(responseOnCompletion?.createInstance?.data);
          setItemsCount(itemsCount + 1);
        }
      },
    }
  );

  const createAndValidateInstance = async (
    values: Partial<IInstance>,
    subdomain: string
  ) => {
    const { data, errors } = await createInstance({
      variables: {
        instance: {
          name: values.name,
          subdomain,
          description: values.description ? values.description : "",
          instanceAdmins: values.instanceAdmins,
          isSample: values.isSample,
          region: "in",
        },
      },
      ...accountsContext,
    });

    const actualResponse = mutationResponseHandler(
      errors,
      data,
      t,
      (input) => input?.createInstance
    );
    if (!actualResponse) return;

    return actualResponse;
  };

  const handleInstanceCreation = async (values: Partial<IInstance>) => {
    setLoadingState(true);
    const subdomain = values?.subdomain
      ? subdomainSlugify(values.subdomain)
      : "";
    try {
      const response = await createAndValidateInstance(values, subdomain);
      // instance creation failed
      if (!response) {
        setLoadingState(false);
        setSteps(1);
        return;
      }

      const allServicesSetup = await Promise.all(
        servicesToSetup.map((oneService) => {
          return setupService({
            context: {
              headers: {
                vrynopath: oneService,
                subdomain: subdomain,
              },
            },
          });
        })
      );
      const allServiceData = allServicesSetup
        .map(
          (oneResponse) =>
            !!mutationResponseHandler(
              oneResponse.errors,
              oneResponse.data,
              t,
              (input) => input?.setupService
            )
        )
        .reduce((acc, curr) => acc && curr);

      setCurrentSubdomain(subdomain);

      // setLoadingState(allServiceData);
      //TODO: set correct status and error handling
      setProcessCompleted(true);
    } catch (error) {
      console.error(error);
      Toast.error(t("common:unknown-message"));
      router.replace("/instances");
      return handleButtonClose();
    }
  };

  return (
    <ConnectedInstanceAddForm
      steps={steps}
      setSteps={setSteps}
      instance={{
        instanceAdmins: [user ? user.email : ""],
        name: "",
        subdomain: "",
      }}
      loading={loadingState}
      processCompleted={processCompleted}
      currentSubdomain={currentSubdomain}
      handleSubmit={handleInstanceCreation}
      onOutsideClick={onOutsideClick}
      handleButtonClose={handleButtonClose}
      renderFullPage={renderFullPage}
    />
  );
};
