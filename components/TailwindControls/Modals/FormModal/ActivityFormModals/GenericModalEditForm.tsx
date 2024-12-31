import React from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { GenericModalForm } from "./GenericModalForm";
import { getVisibleFieldsArray } from "../../../../../screens/modules/crm/shared/utils/getFieldsArray";
import { FormikValues } from "formik";
import { IGenericFormDetails } from "../../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { toast } from "react-toastify";
import { ICustomField } from "../../../../../models/ICustomField";
import { appsUrlGenerator } from "../../../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { getAppPathParts } from "../../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ILayout } from "../../../../../models/ILayout";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { getDataObject } from "../../../../../screens/modules/crm/shared/utils/getDataObject";
import { User } from "../../../../../models/Accounts";
import { IUserPreference } from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const GenericModalEditForm = ({
  formDetails,
  fieldsList,
  onCancel,
  stopRouting,
  passedId,
  currentLayout,
  currentModule,
  onUpdatedData = null,
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
  onUpdatedData?: null | ((data: any) => void);
  userPreferences: IUserPreference[];
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
}) => {
  const router = useRouter();
  const { t } = useTranslation(["common"]);
  const { appName, modelName, id, relatedFilter, relatedFilterId } =
    getAppPathParts();
  const [idData, setIdData] = React.useState({});
  const [savingProcess, setSavingProcess] = React.useState(false);

  const [getDataById] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: formDetails.appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setIdData(getDataObject(responseOnCompletion.fetch.data[0]));
      }
    },
  });

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
        data.save.messageKey.includes(`updation-success`)
      ) {
        toast.success(
          `${
            formDetails?.modelName === "calllog"
              ? "callLog"
              : formDetails.modelName
          } updated successfully`
        );

        if (onUpdatedData) {
          onUpdatedData(data.save.data);
        }
        if (!stopRouting) {
          router.push({
            pathname: appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.detail,
              passedId ? passedId : id,
              [relatedFilter || "", relatedFilterId || ""]
            ),
          });
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
          id: formDetails.id,
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

  React.useEffect(() => {
    getDataById({
      variables: {
        modelName: formDetails.modelName,
        fields: getVisibleFieldsArray(fieldsList),
        filters: [{ operator: "eq", name: "id", value: formDetails.id }],
        options: {
          unmask: true,
        },
      },
    });
  }, [fieldsList]);

  if (idData && Object.keys(idData).length) {
    return (
      <GenericModalForm
        data={idData}
        saveLoading={savingProcess}
        fieldList={fieldsList}
        handleSave={(data) => handleFormSave(data)}
        formDetails={formDetails}
        editMode={true}
        onCancel={onCancel}
        editData={idData}
        user={user}
        userPreferences={userPreferences}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
      />
    );
  } else return null;
};
