import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import CustomizationForm from "./CustomizationForm";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ILayout } from "../../../../../../models/ILayout";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { User } from "../../../../../../models/Accounts";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import _ from "lodash";

type ConnectedAddEditFieldFormType = {
  visible: boolean;
  currentModule: string;
  currentLayout: ILayout | null;
  fieldList: ICustomField[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  mergeAndSaveLayout: (
    values: ICustomField,
    refetchModuleDetails: { modelName: string; serviceName: string }
  ) => Promise<void>;
  data: {};
  user: User | null;
  savingProcess: boolean;
  setSavingProcess: (value: boolean) => void;
  onResetForm: Dispatch<
    SetStateAction<{ visible: boolean; uniqueName: string | null }>
  >;
  handleNewFieldAdd: (
    value: {
      message: string;
      resetForm: { visible: boolean; uniqueName: string | null };
      setSavingProcess: boolean;
    },
    refetchModuleDetails: { modelName: string; serviceName: string }
  ) => void;
};
export const ConnectedAddEditFieldForm = ({
  visible,
  data,
  onResetForm,
  currentModule,
  currentLayout,
  genericModels,
  allModulesFetched,
  fieldList,
  user,
  savingProcess,
  setSavingProcess,
  mergeAndSaveLayout,
  handleNewFieldAdd = () => {},
}: ConnectedAddEditFieldFormType) => {
  const { appName } = getAppPathParts();
  const [modules, setModules] = useState<IModuleMetadata[]>([]);
  const { t } = useTranslation(["common"]);

  const [createCustomField] = useAppSaveMutation<ICustomField>({
    appPath: appName,
  });

  const handleCustomFieldCreation = async (
    values: ICustomField,
    editMode: boolean
  ) => {
    setSavingProcess(true);
    let serviceName =
      _.get(_.get(values, "dataTypeMetadata", {}), "allLookups", [])?.length > 0
        ? _.get(
            _.get(_.get(values, "dataTypeMetadata", {}), "allLookups", [])[0],
            "moduleName",
            ""
          ).split(".")[0]
        : null;
    let modelName =
      _.get(_.get(values, "dataTypeMetadata", {}), "allLookups", [])?.length > 0
        ? _.get(
            _.get(_.get(values, "dataTypeMetadata", {}), "allLookups", [])[0],
            "moduleName",
            ""
          ).split(".")[1]
        : null;

    if (editMode) {
      await mergeAndSaveLayout(values, { serviceName, modelName });
    } else
      try {
        await createCustomField({
          variables: {
            id: null,
            modelName: "Field",
            saveInput: values,
          },
        }).then((responseOnCompletion) => {
          if (
            responseOnCompletion?.data?.save?.messageKey.includes("-success")
          ) {
            handleNewFieldAdd(
              {
                message: responseOnCompletion?.data.save.message,
                resetForm: { visible: false, uniqueName: null },
                setSavingProcess: false,
              },
              { serviceName, modelName }
            );
            return;
          }
          if (responseOnCompletion?.data?.save.messageKey) {
            toast.error(responseOnCompletion?.data.save.message);
            setSavingProcess(false);
            return;
          } else {
            toast.error(t("common:unknown-message"));
            setSavingProcess(false);
          }
        });
      } catch (error) {
        console.error(error);
        setSavingProcess(false);
      }
  };

  React.useEffect(() => {
    if (allModulesFetched) {
      let moduleInfoFromStore: IModuleMetadata[] = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined),
      ];
      setModules([...moduleInfoFromStore]);
    }
  }, [allModulesFetched]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <GenericFormModalContainer
        formHeading={Object.keys(data).length ? "Edit Field" : "Add Field"}
        onOutsideClick={() => onResetForm({ visible: false, uniqueName: null })}
        onCancel={() => onResetForm({ visible: false, uniqueName: null })}
      >
        <CustomizationForm
          data={
            Object.keys(data).length
              ? data
              : {
                  moduleName: currentModule,
                }
          }
          user={user}
          currentModule={currentModule}
          saveLoading={savingProcess}
          handleSave={(values) =>
            handleCustomFieldCreation(
              values as ICustomField,
              !!Object.keys(data).length
            )
          }
          onCancel={() => onResetForm({ visible: false, uniqueName: null })}
          editMode={!!Object.keys(data).length}
          modules={modules}
          fieldList={fieldList}
        />
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => onResetForm({ visible: false, uniqueName: null })}
      />
    </>
  );
};
