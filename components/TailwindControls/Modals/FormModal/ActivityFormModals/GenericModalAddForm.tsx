import React from "react";
import { useTranslation } from "next-i18next";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { GenericModalForm } from "./GenericModalForm";
import { FormikValues } from "formik";
import { IGenericFormDetails } from "../../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { appsUrlGenerator } from "../../../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { getAppPathParts } from "../../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ICustomField } from "../../../../../models/ICustomField";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { ILayout } from "../../../../../models/ILayout";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { User } from "../../../../../models/Accounts";
import { IUserPreference } from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { getDefaultDropdowns } from "../../../../../screens/modules/crm/generic/GenericForms/Shared/genericFormSharedFunctions";

export const GenericModalAddForm = ({
  formDetails,
  fieldsList,
  onCancel,
  stopRouting,
  passedId,
  currentLayout,
  currentModule,
  externalData = {},
  handleAddedRecord = () => {},
  userPreferences,
  user,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  ...props
}: {
  formDetails: IGenericFormDetails;
  fieldsList: ICustomField[];
  onCancel: () => void;
  stopRouting?: boolean;
  passedId: string | null;
  currentLayout?: ILayout;
  currentModule?: IModuleMetadata;
  externalData?: { [key: string]: any };
  userPreferences: IUserPreference[];
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  handleAddedRecord?: (data: any, modelName?: string) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const { appName, modelName, id, relatedFilter, relatedFilterId } =
    getAppPathParts();
  const router = useRouter();
  const [savingProcess, setSavingProcess] = React.useState(false);

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: formDetails.appName,
      },
    },
    onCompleted: (data) => {
      setSavingProcess(false);
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("-create-success")
      ) {
        toast.success(
          `${
            formDetails?.modelName === "calllog"
              ? "callLog"
              : formDetails.modelName
          } created successfully`
        );
        if (!stopRouting) {
          handleAddedRecord(data.save.data, formDetails.modelName);
          router.push({
            pathname: appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.detail,
              passedId ? passedId : id,
              [relatedFilter || "", relatedFilterId || ""]
            ),
          });
        } else {
          handleAddedRecord(data.save.data, formDetails.modelName);
        }
        return onCancel();
      }
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleFormSave = async (values: FormikValues) => {
    setSavingProcess(true);
    try {
      await saveData({
        variables: {
          id: null,
          modelName: formDetails.modelName,
          saveInput: {
            ...values,
            layoutId: currentLayout?.id,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GenericModalForm
      data={{
        ...externalData,
        ...getDefaultDropdowns(fieldsList),
        ownerId: cookieUserStore?.getUserId(),
        relatedTo: formDetails.parentModelName
          ? [
              {
                moduleName: formDetails.parentModelName,
                recordId: formDetails.parentId,
                createdAt: "",
              },
            ]
          : [],
      }}
      currentModule={currentModule}
      saveLoading={savingProcess}
      fieldList={fieldsList}
      handleSave={(data) => handleFormSave(data)}
      formDetails={formDetails}
      onCancel={onCancel}
      editData={{}}
      user={user}
      userPreferences={userPreferences}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
      allModulesFetched={allModulesFetched}
    />
  );
};
