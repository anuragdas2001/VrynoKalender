import React, { useContext } from "react";
import { GenericAdd } from "./GenericAdd";
import { GenericEdit } from "./GenericEdit";
import { ILayout } from "../../../../../models/ILayout";
import { getAllFieldsArray } from "../../shared/utils/getFieldsArray";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { getFieldsFromDisplayExpression } from "../../shared/utils/getFieldsFromDisplayExpression";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../models/ICustomField";
import {
  ISubFormDataDict,
  ISubFormItemDataType,
  SupportedApps,
} from "../../../../../models/shared";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { observer } from "mobx-react-lite";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { useSearchParams } from "next/navigation";
import { camelCase } from "lodash";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { UserStoreContext } from "../../../../../stores/UserStore";

export const GenericAddAndEditWrapper = observer(
  ({
    appName,
    modelName,
    id,
    currentModule,
    setBackgroundProcessRunning = () => {},
    type,
  }: {
    id?: string;
    appName: SupportedApps;
    modelName: string;
    currentModule?: IModuleMetadata;
    backgroundProcessRunning?: boolean;
    setBackgroundProcessRunning?: (value: boolean) => void;
    type: "add" | "edit";
  }) => {
    const searchParams = useSearchParams();
    const quoteSubForm = camelCase(searchParams.get("subform") ?? "");
    const quoteDependingModule = camelCase(
      searchParams.get("dependingModule") ?? ""
    );
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      allLayoutFetched,
      allModulesFetched,
      userPreferences,
      importUserPreferences,
      addModuleData,
    } = generalModelStore;
    const userContext = React.useContext(UserStoreContext);
    const { user } = userContext;
    const { navigations } = useContext(NavigationStoreContext);
    const [currentLayout, setCurrentLayout] = React.useState<ILayout>();
    const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
    const [layoutLoading, setLayoutLoading] = React.useState<boolean>(true);
    const [subFormDict, setSubFormDict] = React.useState<
      Record<string, ISubFormItemDataType>
    >({});
    const [isSubFormDictUpdated, setIsSubFormDictUpdated] =
      React.useState(false);
    const [subFormDataDict, setSubFormDataDict] = React.useState<
      ISubFormDataDict[]
    >([]);
    const [subFormFieldsListDict, setSubFormFieldsListDict] = React.useState<
      Record<
        string,
        {
          fieldsList: ICustomField[];
          fieldsName: string[];
          modelName: string;
        }
      >
    >({});
    const [subFormClear, setSubFormClear] = React.useState(false);

    React.useEffect(() => {
      if (allLayoutFetched) {
        let fieldsList =
          genericModels[modelName]?.fieldsList &&
          genericModels[modelName]?.fieldsList?.length > 0
            ? [...getSortedFieldList(genericModels[modelName]?.fieldsList)]
            : [];
        if (genericModels[modelName]?.layouts?.length > 0) {
          setCurrentLayout(genericModels[modelName]?.layouts[0]);
        }
        setFieldsList([...fieldsList]);
      }
    }, [allLayoutFetched]);

    React.useEffect(() => {
      if (fieldsList?.length) {
        const subFormDict: Record<string, ISubFormItemDataType> = {};
        fieldsList?.forEach((field) => {
          if (
            field.dataType === "multiSelectRecordLookup" &&
            field.visible &&
            !field.readOnly &&
            field.dataTypeMetadata?.isSubform
          ) {
            subFormDict[field.name] = {
              modelName:
                field.dataTypeMetadata?.allLookups?.[0]?.moduleName.split(
                  "."
                )[1],
              label: field.label.en,
              systemDefined: field.systemDefined,
              fieldName: field.name,
              displayExpression: getFieldsFromDisplayExpression(
                field?.dataTypeMetadata?.allLookups?.[0]?.displayExpression ||
                  "${name}"
              ),
            };
          }
        });
        setSubFormDict(subFormDict);
        setIsSubFormDictUpdated(true);
      }
    }, [fieldsList]);

    React.useEffect(() => {
      if (!isSubFormDictUpdated || !allLayoutFetched) return;
      if (!Object.keys(subFormDict)?.length) {
        setLayoutLoading(false);
        return;
      }
      (async () => {
        const fieldsMetaDataFromStorePerSubFromDictKey: {
          response: ICustomField[];
          fieldsMetaData: ISubFormItemDataType;
        }[] = [];
        for (const key in subFormDict) {
          let fieldsListForKeyFromStore =
            genericModels[subFormDict[key]["modelName"]]?.fieldsList ?? [];
          fieldsMetaDataFromStorePerSubFromDictKey.push({
            response: [...fieldsListForKeyFromStore],
            fieldsMetaData: subFormDict[key],
          });
        }
        const resultData: {
          fieldsList: ICustomField[];
          visibleFieldsList: ICustomField[];
          fieldsMetaData: ISubFormItemDataType;
          data: any[];
          fieldNameToSearchWith: string;
        }[] = [];
        const updatedSubFormFieldsListDict: Record<
          string,
          {
            fieldsList: ICustomField[];
            fieldsName: string[];
            modelName: string;
          }
        > = {};
        fieldsMetaDataFromStorePerSubFromDictKey?.forEach(
          (item: { [x: string]: any }) => {
            const fields = item["response"];

            const visibleFieldsList = fields
              ? getSortedFieldList(
                  fields.filter(
                    (field: ICustomField) =>
                      field.visible &&
                      !field.readOnly &&
                      field.dataType !== "recordImage" &&
                      field.dataType !== "relatedTo" &&
                      !field?.dataTypeMetadata?.isSubform
                  )
                )
              : [];
            const updatedFieldsList = fields
              ? getSortedFieldList(
                  fields.filter(
                    (field: ICustomField) =>
                      (field.dataType !== "recordImage" &&
                        field.dataType !== "relatedTo" &&
                        field.visible &&
                        field.mandatory &&
                        field.addInForm &&
                        (field.dataType === SupportedDataTypes.expression
                          ? true
                          : !field.readOnly)) ||
                      (field.dataType !== "recordImage" &&
                        field.dataType !== "relatedTo" &&
                        field.visible &&
                        field.addInForm &&
                        (field.dataType === SupportedDataTypes.expression
                          ? true
                          : !field.readOnly) &&
                        field.showInQuickCreate)
                  )
                )
              : [];
            const fieldName = item.fieldsMetaData.fieldName;
            if (visibleFieldsList.length) {
              resultData.push({
                fieldsList: updatedFieldsList,
                visibleFieldsList: visibleFieldsList,
                fieldsMetaData: item["fieldsMetaData"],
                data: [],
                fieldNameToSearchWith: fieldName,
              });
              updatedSubFormFieldsListDict[item.fieldsMetaData.fieldName] = {
                fieldsList: visibleFieldsList,
                fieldsName: getAllFieldsArray(visibleFieldsList),
                modelName: item.fieldsMetaData.modelName,
              };
            }
          }
        );
        setSubFormDataDict(resultData);
        setSubFormFieldsListDict(updatedSubFormFieldsListDict);
        setLayoutLoading(false);
      })();
    }, [isSubFormDictUpdated, allLayoutFetched]);

    if (fieldsList.length <= 0 || !currentModule) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    return layoutLoading ? (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col items-center justify-center"
      >
        <PageLoader />
      </div>
    ) : type === "add" ? (
      <GenericAdd
        appName={appName}
        modelName={modelName}
        currentModule={currentModule}
        currentUser={user}
        subFormDict={subFormDict}
        subFormDataDict={subFormDataDict}
        subFormFieldsListDict={subFormFieldsListDict}
        subFormClear={subFormClear}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
        userPreferences={userPreferences}
        quoteSubForm={quoteSubForm}
        quoteDependingModule={quoteDependingModule}
        searchParams={searchParams}
        fieldsList={fieldsList}
        currentLayout={currentLayout}
        navigations={navigations}
        importUserPreferences={importUserPreferences}
        addModuleData={addModuleData}
        setSubFormClear={setSubFormClear}
        setSubFormDataDict={(value) => setSubFormDataDict(value)}
        setBackgroundProcessRunning={(value) =>
          setBackgroundProcessRunning(value)
        }
      />
    ) : (
      <GenericEdit
        appName={appName}
        modelName={modelName}
        id={id}
        currentModule={currentModule}
        currentUser={user}
        subFormDict={subFormDict}
        subFormDataDict={subFormDataDict}
        subFormFieldsListDict={subFormFieldsListDict}
        subFormClear={subFormClear}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
        userPreferences={userPreferences}
        quoteSubForm={quoteSubForm}
        quoteDependingModule={quoteDependingModule}
        searchParams={searchParams}
        fieldsList={fieldsList}
        currentLayout={currentLayout}
        navigations={navigations}
        addModuleData={addModuleData}
        importUserPreferences={importUserPreferences}
        setSubFormClear={(value: boolean) => setSubFormClear(value)}
        setSubFormDataDict={(value) => setSubFormDataDict(value)}
        setBackgroundProcessRunning={(value) =>
          setBackgroundProcessRunning(value)
        }
      />
    );
  }
);
