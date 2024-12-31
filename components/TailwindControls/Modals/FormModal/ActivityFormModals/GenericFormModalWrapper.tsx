import React, { useContext, useEffect, useRef } from "react";
import { ClickOutsideToClose } from "../../../shared/ClickOutsideToClose";
import { GenericModalAddForm } from "./GenericModalAddForm";
import { GenericModalEditForm } from "./GenericModalEditForm";
import { IGenericFormDetails } from "../../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import GenericFormModalContainer from "../GenericFormModalContainer";
import { ILayout } from "../../../../../models/ILayout";
import { ICustomField } from "../../../../../models/ICustomField";
import { GenericLeadConversionMappingScreen } from "../../../../../screens/modules/crm/generic/GenericLeadConversion/GenericLeadConversionMappingScreen";
import { Loading } from "../../../Loading/Loading";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { getDataObject } from "../../../../../screens/modules/crm/shared/utils/getDataObject";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { observer } from "mobx-react-lite";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { lookupFieldsOptionsResolver } from "../../../../../screens/modules/crm/shared/components/Form/FormFields/FormFieldLookup";
import {
  lookupMapper,
  stringLookupMapper,
} from "../../../../../screens/modules/crm/shared/utils/staticLookupMapper";

export type GenericFormModalWrapperProps = {
  onCancel?: () => void;
  onOutsideClick?: (value: boolean) => void;
  formDetails: IGenericFormDetails;
  stopRouting?: boolean;
  passedId?: string | null;
  onUpdatedData?: (data: any) => void;
  handleAddedRecord?: (data: any, modelName?: string) => void;
  externalData?: { [key: string]: any; setBy?: "value" | "label" };
};

const GenericFormModalWrapper = observer(
  (
    {
      onCancel = () => {},
      onOutsideClick = () => {},
      formDetails,
      stopRouting = true,
      passedId = "",
      externalData = {},
      onUpdatedData,
      handleAddedRecord = () => {},
    }: GenericFormModalWrapperProps,
    ref: React.Ref<any>
  ) => {
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      allLayoutFetched,
      allModulesFetched,
      userPreferences,
      removeModuleDataById,
    } = generalModelStore;
    const wrapperRef = useRef(null);
    ClickOutsideToClose(wrapperRef, (value) => onOutsideClick(value));
    const [formLoading, setFormLoading] = React.useState<boolean>(true);
    const [currentLayout, setCurrentLayout] = React.useState<ILayout>();
    const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
    const [moduleFetched, setModuleFetched] = React.useState<IModuleMetadata>();
    const [updateExternalData, setUpdateExternalData] = React.useState<{
      [key: string]: any;
      setBy?: "value" | "label";
    }>();

    useEffect(() => {
      if (
        Object.keys(genericModels)?.length > 0 &&
        formDetails.modelName &&
        allModulesFetched &&
        allLayoutFetched
      ) {
        genericModels[formDetails.modelName]?.moduleInfo &&
          genericModels[formDetails.modelName]?.layouts?.length > 0 &&
          genericModels[formDetails.modelName]?.fieldsList;
        if (genericModels[formDetails.modelName]?.moduleInfo) {
          setModuleFetched(genericModels[formDetails.modelName]?.moduleInfo);
        }
        if (genericModels[formDetails.modelName]?.layouts?.length > 0) {
          setCurrentLayout(genericModels[formDetails.modelName]?.layouts[0]);
        }
        if (genericModels[formDetails.modelName]?.fieldsList?.length > 0) {
          setFieldsList(genericModels[formDetails.modelName]?.fieldsList);
        }
        setFormLoading(false);
      }
    }, [
      genericModels,
      allLayoutFetched,
      allModulesFetched,
      formDetails.modelName,
    ]);

    React.useEffect(() => {
      if (Object.keys(externalData)?.length > 0 && fieldsList?.length > 0) {
        if (externalData?.setBy === "label") {
          let updatedExternalData: { [key: string]: any } = {};
          for (let key in externalData) {
            let field = fieldsList?.find((field) => field.name === key);
            if (field) {
              if (field.dataType === "lookup") {
                let options: Partial<
                  Array<{
                    label: string;
                    value: string | null;
                    visible?: boolean;
                    extraInfoField?: boolean;
                    colourHex?: string;
                    defaultOption?: boolean;
                  }>
                > = lookupFieldsOptionsResolver(field);
                let valueIndex = options.find(
                  (option) => option?.label === externalData[key]
                );
                if (valueIndex) {
                  updatedExternalData[key] = valueIndex.value;
                }
              } else if (field.dataType === "multiSelectLookup") {
                let options =
                  field.dataTypeMetadata?.type === "string"
                    ? stringLookupMapper(field.dataTypeMetadata)?.map(
                        (option) => {
                          return { ...option, visible: true };
                        }
                      )
                    : lookupMapper(field.dataTypeMetadata?.lookupOptions);
                let updatedValue: string[] = [];
                for (let values of externalData[key]) {
                  let valueIndex = options.find(
                    (option) => option?.label === values
                  );
                  if (valueIndex && valueIndex.value) {
                    updatedValue.push(valueIndex.value);
                  }
                }
                updatedExternalData[key] = updatedValue;
              } else {
                updatedExternalData[key] = externalData[key];
              }
            }
          }
          setUpdateExternalData(getDataObject(updatedExternalData));
        } else {
          setUpdateExternalData(getDataObject(externalData));
        }
      }
    }, [externalData, fieldsList]);

    const modalForm = {
      Add: (
        <GenericModalAddForm
          currentLayout={currentLayout}
          formDetails={formDetails}
          currentModule={moduleFetched}
          fieldsList={fieldsList}
          onCancel={onCancel}
          stopRouting={stopRouting}
          passedId={passedId}
          externalData={updateExternalData}
          handleAddedRecord={(data, modelName) =>
            handleAddedRecord(data, modelName)
          }
          userPreferences={userPreferences}
          user={user}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
          allModulesFetched={allModulesFetched}
        />
      ),
      Edit: (
        <GenericModalEditForm
          currentLayout={currentLayout}
          formDetails={formDetails}
          currentModule={moduleFetched}
          fieldsList={fieldsList}
          onCancel={onCancel}
          stopRouting={stopRouting}
          passedId={passedId}
          onUpdatedData={onUpdatedData}
          userPreferences={userPreferences}
          user={user}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
          allModulesFetched={allModulesFetched}
        />
      ),
      Conversion: <GenericLeadConversionMappingScreen />,
    };

    return (
      <GenericFormModalContainer
        topIconType="Close"
        formHeading={`${
          formDetails.type === "Add"
            ? `Create ${formDetails.aliasName}`
            : `Edit ${formDetails.aliasName}`
        }`}
        onCancel={onCancel}
        onOutsideClick={onOutsideClick}
      >
        <>
          {formLoading ? (
            <div className="w-full flex items-center justify-center py-5">
              <Loading color="Blue" />
            </div>
          ) : !fieldsList.length ? (
            <div className="w-full flex items-center justify-center py-6">
              <p
                className="text-vryno-danger text-sm"
                id={`${formDetails.aliasName}-module-not-found`}
              >
                Module not found
              </p>
            </div>
          ) : (
            formDetails.type !== null && modalForm[formDetails.type]
          )}
        </>
      </GenericFormModalContainer>
    );
  }
);

export default GenericFormModalWrapper;
