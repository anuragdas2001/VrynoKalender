import React, { useContext, useRef } from "react";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import { CHECK_SUBDOMAIN_QUERY } from "../../../../graphql/queries/checkSubDomain";
import { useRouter } from "next/router";
import { ClickOutsideToClose } from "../../../../components/TailwindControls/shared/ClickOutsideToClose";
import { Toast } from "../../../../components/TailwindControls/Toast";
import { InstanceAddFinished } from "./InstanceAddFinished";
import { InstanceAddProcessing } from "./InstanceAddProcessing";
import { InstanceAddStepTwoFormWrapper } from "./InstanceAddStepTwoFormWrapper";
import { InstanceAddStepOneFormWrapper } from "./InstanceAddStepOneFormWrapper";
import { InstanceAddStepThreeFormWrapper } from "./InstanceAddStepThreeFormWrapper";
import {
  detailsValidationSchema,
  formStepperArray,
  getLaunchUrl,
  loadingArray,
} from "./sharedData";
import { IInstance } from "../../../../models/Accounts";
import { SupportedApps } from "../../../../models/shared";
import { InstanceStoreContext } from "../../../../stores/InstanceStore";
import { observer } from "mobx-react-lite";

export const ConnectedInstanceAddForm = observer(
  ({
    instance,
    handleSubmit,
    loading,
    steps,
    setSteps,
    currentSubdomain,
    editMode = false,
    processCompleted,
    onOutsideClick = () => {},
    handleButtonClose = () => {},
    renderFullPage = false,
  }: {
    instance?: Partial<IInstance>;
    handleSubmit: (input: Partial<IInstance>) => void;
    loading: boolean;
    steps: number;
    setSteps: (value: ((prevState: number) => number) | number) => void;
    currentSubdomain: string;
    editMode?: boolean;
    processCompleted?: boolean;
    onOutsideClick?: (value: boolean) => void;
    handleButtonClose?: () => void;
    renderFullPage?: boolean;
  }) => {
    const internalInstance: Partial<IInstance> = {
      ...{
        instanceAdmins: [],
        subdomain: "",
        description: "",
        name: "",
      },
      ...instance,
    };
    const { t } = useTranslation(["instances", "common"]);
    const { instances } = useContext(InstanceStoreContext);
    const [instanceAdmins, setAdmin] = React.useState<string[]>(
      internalInstance.instanceAdmins || []
    );
    const wrapperRef = useRef(null);
    ClickOutsideToClose(wrapperRef, (value: boolean) => onOutsideClick(value));

    const [adminsError, setAdminsError] = React.useState<string>("");
    const [formArray, setFormArray] = React.useState<Record<string, any>>({});
    const [selectedApp, setSelectedApp] = React.useState(["crm"]);

    const [checksubdomain] = useLazyQuery(CHECK_SUBDOMAIN_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      onCompleted: (data) => {
        if (!data) return;
        if (!data.checkSubdomain) return;
        if (!data.checkSubdomain.messageKey) return;
        if (data.checkSubdomain.messageKey === "instance-subdomain-exists") {
          Toast.error(t("checkdomain-error"));
        }
      },
    });

    const handleDomainCheck = async (values: string) => {
      try {
        await checksubdomain({
          variables: { subdomain: values.toLowerCase() },
        });
      } catch (error) {
        console.error(error);
      }
    };

    const handleAppSelection = (app: string) => {
      let newSelectedApp = [];
      if (selectedApp.includes(app)) {
        newSelectedApp = selectedApp.filter((sApp) => sApp !== app);
        setSelectedApp(newSelectedApp);
      } else {
        setSelectedApp([...selectedApp, app]);
      }
    };

    const rou = useRouter();
    if (processCompleted) {
      return (
        <InstanceAddFinished
          href={getLaunchUrl(currentSubdomain, rou?.locale)}
          onButtonClose={handleButtonClose}
          instanceAdmins={formArray?.instanceAdmins}
        />
      );
    }

    if (loading && !processCompleted) {
      return (
        <InstanceAddProcessing
          renderFullPage={renderFullPage}
          messages={loadingArray}
        />
      );
    }
    if (steps === 0) {
      return (
        <InstanceAddStepOneFormWrapper
          renderFullPage={renderFullPage}
          t={t}
          onOutsideClick={onOutsideClick}
          FormStepperArray={formStepperArray}
          steps={steps}
          internalInstance={internalInstance}
          formArray={formArray}
          setFormArray={setFormArray}
          setSteps={setSteps}
          instancesExist={instances.length !== 0}
          handleButtonClose={handleButtonClose}
        />
      );
    }
    if (steps === 1) {
      return (
        <InstanceAddStepTwoFormWrapper
          renderFullPage={renderFullPage}
          onOutsideClick={onOutsideClick}
          FormStepperArray={formStepperArray}
          steps={steps}
          internalInstance={internalInstance}
          formArray={formArray}
          detailsValidationSchema={detailsValidationSchema(t)}
          instanceAdmins={instanceAdmins}
          setAdminsError={setAdminsError}
          setFormArray={setFormArray}
          setSteps={setSteps}
          t={t}
          handleDomainCheck={handleDomainCheck}
          editMode={editMode}
          setAdmin={setAdmin}
          adminsError={adminsError}
        />
      );
    }

    return (
      <InstanceAddStepThreeFormWrapper
        renderFullPage={renderFullPage}
        onOutsideClick={onOutsideClick}
        FormStepperArray={formStepperArray}
        steps={steps}
        selectedApp={selectedApp}
        handleAppSelection={handleAppSelection}
        internalInstance={internalInstance}
        formArray={formArray}
        detailsValidationSchema={detailsValidationSchema(t)}
        handleSubmit={handleSubmit}
        setSteps={setSteps}
        loading={loading}
      />
    );
  }
);
