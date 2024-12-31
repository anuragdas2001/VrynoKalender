import React from "react";
import { get } from "lodash";
import { AddField } from "./AddField";
import { IRole } from "../../../../../../models/shared";
import { ILayout } from "../../../../../../models/ILayout";
import CustomizationFieldsTable from "./CustomizationFieldsTable";
import { ICustomField } from "../../../../../../models/ICustomField";
import { CustomizationLoader } from "../../Shared/CustomizationLoader";
import { ConnectedAddEditFieldForm } from "./ConnectedAddEditFieldForm";
import { CustomizationContainer } from "../../Shared/CustomizationContainer";
import { NoViewPermission } from "../../../../crm/shared/components/NoViewPermission";
import { User } from "../../../../../../models/Accounts";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";

type LayoutFieldsProps = {
  moduleLabel: string;
  currentLayout: ILayout | null;
  tableDataProcessing: boolean;
  layoutFetchLoading: boolean;
  fieldList: ICustomField[];
  addEditField: { visible: boolean; uniqueName: string | null };
  moduleName: string;
  viewPermission: boolean;
  user: User | null;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  savingProcess: boolean;
  setSavingProcess: (value: boolean) => void;
  mergeAndSaveLayout: (
    values: ICustomField,
    refetchModuleDetails?: {
      modelName: string;
      serviceName: string;
    }
  ) => Promise<void>;
  handleCustomFieldOrderUpdate: (
    itemOne: ICustomField,
    itemTwo: ICustomField
  ) => Promise<void>;
  setFieldList: (
    value: ((prevState: ICustomField[]) => ICustomField[]) | ICustomField[]
  ) => void;
  setAddEditField: (
    value:
      | ((prevState: { visible: boolean; uniqueName: string | null }) => {
          visible: boolean;
          uniqueName: string | null;
        })
      | { visible: boolean; uniqueName: string | null }
  ) => void;
  handleNewFieldAdd: (
    value: {
      message: string;
      resetForm: { visible: boolean; uniqueName: string | null };
      setSavingProcess: boolean;
    },
    refetchModuleDetails: {
      modelName: string;
      serviceName: string;
    }
  ) => void;
  userRoles: IRole[];
  fieldPermissionData: Record<string, Record<string, boolean>>;
  setFieldPermissionData: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, boolean>>>
  >;
  setSavedFieldPermissionData: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  savedFieldPermissionData: Record<string, string>;
  userRoleLoader: boolean;
  fieldPermissionLoader: boolean;
  currentPageNumber: number;
  itemsCount: number;
  filterValue: string;
  setFilterValue: (value: string) => void;
};

export function LayoutFields({
  moduleLabel,
  currentLayout,
  tableDataProcessing,
  layoutFetchLoading,
  fieldList,
  addEditField,
  moduleName,
  viewPermission,
  user,
  genericModels,
  allModulesFetched,
  setFieldList,
  savingProcess,
  setSavingProcess,
  mergeAndSaveLayout,
  handleCustomFieldOrderUpdate,
  setAddEditField,
  handleNewFieldAdd,
  userRoles,
  fieldPermissionData,
  setFieldPermissionData,
  savedFieldPermissionData,
  setSavedFieldPermissionData,
  userRoleLoader,
  fieldPermissionLoader,
  currentPageNumber,
  itemsCount,
  filterValue,
  setFilterValue,
}: LayoutFieldsProps) {
  return (
    <>
      <CustomizationContainer
        heading={moduleLabel}
        subHeading={`(${get(currentLayout, "name", "Default")} Layout)`}
        showTabBar={true}
        buttons={<AddField onAddClick={setAddEditField} />}
        currentPageNumber={currentPageNumber}
        itemsCount={itemsCount}
        currentPageItemCount={
          fieldList
            ?.filter((field) => field.addInForm)
            .filter((field) => field.recordStatus !== "d")?.length
        }
        onPageChange={(pageNumber) => console.log(pageNumber)}
        setFilterValue={(value) => setFilterValue(value)}
      >
        <CustomizationLoader loading={layoutFetchLoading} />
        {!layoutFetchLoading ? (
          viewPermission ? (
            <CustomizationFieldsTable
              fieldList={fieldList}
              tableDataProcessing={tableDataProcessing}
              onEditCustomField={(item) =>
                setAddEditField({ visible: true, uniqueName: item.uniqueName })
              }
              handleCustomFieldUpdate={(item) => mergeAndSaveLayout(item)}
              handleOrderUpdate={(itemOne, itemTwo) =>
                handleCustomFieldOrderUpdate(itemOne, itemTwo)
              }
              userRoles={userRoles}
              filterValue={filterValue}
              fieldPermissionData={fieldPermissionData}
              setFieldPermissionData={setFieldPermissionData}
              savedFieldPermissionData={savedFieldPermissionData}
              setSavedFieldPermissionData={setSavedFieldPermissionData}
              userRoleLoader={userRoleLoader}
              fieldPermissionLoader={fieldPermissionLoader}
            />
          ) : (
            <NoViewPermission shadow={false} modelName={"Layout"} />
          )
        ) : (
          <></>
        )}
      </CustomizationContainer>
      <ConnectedAddEditFieldForm
        visible={addEditField.visible}
        fieldList={fieldList}
        mergeAndSaveLayout={mergeAndSaveLayout}
        onResetForm={setAddEditField}
        currentLayout={currentLayout}
        currentModule={moduleName}
        user={user}
        data={
          fieldList?.findIndex(
            (field) => field.uniqueName === addEditField.uniqueName
          ) !== -1
            ? fieldList?.filter(
                (field) => field.uniqueName === addEditField.uniqueName
              )[0]
            : {}
        }
        genericModels={genericModels}
        allModulesFetched={allModulesFetched}
        setSavingProcess={setSavingProcess}
        savingProcess={savingProcess}
        handleNewFieldAdd={(message, refetchModuleDetails) =>
          handleNewFieldAdd(message, refetchModuleDetails)
        }
      />
    </>
  );
}
