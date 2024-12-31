import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import NavigationForm from "./NavigationForm/NavigationForm";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { useContext, useState } from "react";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { useTranslation } from "next-i18next";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { INavigation } from "../../../../../../models/INavigation";
import { get } from "lodash";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const AddEditNavigationModal = ({
  addNavigationModal,
  setAddNavigationModal,
  currentNavigationGroup,
  navigationByGroupKey,
  navigationItems,
  genericModels,
  allModulesFetched,
  handleNavigationAddUpdate = () => {},
}: {
  addNavigationModal: {
    visible: boolean;
    data: INavigation | null;
  };
  setAddNavigationModal: (value: {
    visible: boolean;
    data: INavigation | null;
  }) => void;
  currentNavigationGroup: string;
  navigationByGroupKey: INavigation[];
  navigationItems: INavigation[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  handleNavigationAddUpdate?: (item: INavigation) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const { appName } = getAppPathParts();
  const { importNavigations, removeNavigationByUniqueName } = useContext(
    NavigationStoreContext
  );
  const [savingProcess, setSavingProcess] = useState(false);

  const [createNavigationModule] = useAppSaveMutation<INavigation>({
    appPath: appName,
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        handleNavigationAddUpdate(responseOnCompletion.save.data);
        const updatedNavigationIndex = navigationByGroupKey.findIndex(
          (navigation) =>
            navigation.uniqueName === responseOnCompletion.save.data.uniqueName
        );
        if (updatedNavigationIndex >= 0)
          removeNavigationByUniqueName(
            responseOnCompletion.save.data.uniqueName
          );
        updatedNavigationIndex >= 0
          ? importNavigations(
              [responseOnCompletion.save.data],
              updatedNavigationIndex
            )
          : importNavigations([responseOnCompletion.save.data]);
        Toast.success(responseOnCompletion.save.message);
        setSavingProcess(false);
        setAddNavigationModal({ visible: false, data: null });
        return;
      }
      setSavingProcess(false);
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.messageKey);
        return;
      }
      Toast.error(t("common:unknown-message"));
    },
  });

  const handleNavigationCreation = async (
    values: INavigation,
    editMode: boolean
  ) => {
    setSavingProcess(true);
    try {
      await createNavigationModule({
        variables: {
          id:
            editMode && addNavigationModal.data?.id
              ? addNavigationModal.data?.id
              : null,
          modelName: "NavigationItem",
          saveInput: {
            name: editMode ? values.name : values.label,
            label: { en: values.label },
            groupKey: values.groupKey,
            navType: values.navType,
            navTypeMetadata:
              values.navType === "module"
                ? { moduleName: values.navTypeMetadata }
                : { relativeUrl: values.navTypeMetadata },
            uniqueName: values.uniqueName,
            order: values.order,
            visible: true,
          },
        },
      });
    } catch (error) {}
  };

  if (!addNavigationModal.visible) {
    return null;
  }

  return (
    <>
      <GenericFormModalContainer
        formHeading={
          addNavigationModal?.data &&
          Object.keys(addNavigationModal?.data)?.length > 0
            ? "Edit Navigation"
            : "Add Navigation"
        }
        onOutsideClick={() =>
          setAddNavigationModal({ visible: false, data: null })
        }
        onCancel={() => setAddNavigationModal({ visible: false, data: null })}
      >
        <NavigationForm
          data={
            addNavigationModal?.data &&
            Object.keys(addNavigationModal?.data)?.length > 0
              ? {
                  ...addNavigationModal.data,
                  name: get(
                    addNavigationModal?.data?.navTypeMetadata,
                    "moduleName",
                    ""
                  ),
                }
              : null
          }
          currentNavigationGroup={currentNavigationGroup}
          navigationByGroupKey={navigationByGroupKey}
          navigationItems={navigationItems}
          saveLoading={savingProcess}
          genericModels={genericModels}
          allModulesFetched={allModulesFetched}
          handleSave={(values, editMode) =>
            handleNavigationCreation(values, editMode)
          }
          onCancel={() => setAddNavigationModal({ visible: false, data: null })}
          editMode={addNavigationModal.data ? true : false}
        />
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => setAddNavigationModal({ visible: false, data: null })}
      />
    </>
  );
};
