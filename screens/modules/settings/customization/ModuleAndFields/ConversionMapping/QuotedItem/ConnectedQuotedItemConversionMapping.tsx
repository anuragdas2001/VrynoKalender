import React from "react";
import { SupportedApps } from "../../../../../../../models/shared";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../../graphql/queries/fetchQuery";
import { ILayout } from "../../../../../../../models/ILayout";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { SAVE_MUTATION } from "../../../../../../../graphql/mutations/saveMutation";
import { FormikValues } from "formik";
import { PageLoader } from "../../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  checkMandatoryFields,
  dropdownListHelper,
  mandatoryFieldsExtractor,
  quoteMappingExcludedFieldNames,
} from "../conversionMappingHelper";
import { IConversionDropdownListType } from "../conversionTypes";
import { toast } from "react-toastify";
import {
  handleQuotedItemMappingFormSaveHelper,
  quotedItemMappingResponseDataHandler,
} from "./quotedItemConversionMappingHelper";
import {
  IQuotedItemMappingLabels,
  QuotedItemConversionDataType,
} from "./QuotedItemConversionMappingScreen";
import { QuotedItemConversionContainer } from "./QuotedItemConversionContainer";

export const ConnectedQuotedItemConversionMapping = ({
  quotedItemConversionData,
  labelData,
  rootPermissionData,
  setQuotedItemConversionData,
  setRootPermissionData,
  moduleLoading,
  conversionDataLoading,
}: {
  quotedItemConversionData: QuotedItemConversionDataType;
  labelData: IQuotedItemMappingLabels;
  rootPermissionData: Record<string, string | null>[];
  setQuotedItemConversionData: (value: QuotedItemConversionDataType) => void;
  setRootPermissionData: (value: Record<string, string | null>[]) => void;
  moduleLoading: boolean;
  conversionDataLoading: boolean;
}) => {
  const [orderedItemList, setOrderedItemList] = React.useState<
    IConversionDropdownListType[]
  >([]);
  const [invoicedItemList, setInvoicedItemList] = React.useState<
    IConversionDropdownListType[]
  >([]);

  const [quoteItemListItems, setQuotedItemListItems] = React.useState<
    IConversionDropdownListType[]
  >([]);
  const [originalListValues, setOriginalListValues] = React.useState<
    Record<string, string | null>
  >({});
  const [layoutLoading, setLayoutLoading] = React.useState(true);
  const [changedValuesList, setChangedValuesList] = React.useState<string[]>(
    []
  );
  const [quotedItemMappingSaving, setQuotedItemMappingSaving] =
    React.useState(false);
  const [mandatoryFields, setMandatoryFields] = React.useState<
    Record<string, ICustomField[]>
  >({});
  const [errorMessage, setErrorMessage] = React.useState("");

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const dropdownChangeHandler = (
    changedValue: string,
    values: FormikValues
  ) => {
    if (Object.keys(originalListValues).length === 0) {
      setOriginalListValues(values);
    }
    let found = false;
    for (const val of changedValuesList) {
      if (changedValue === val) {
        found = true;
        break;
      }
    }
    if (!found) {
      setChangedValuesList([...changedValuesList, changedValue]);
    }
  };

  const handleFormSave = async (values: FormikValues) => {
    if (!changedValuesList.length) {
      toast.warning("No changes to save");
      return;
    }
    setQuotedItemMappingSaving(true);
    try {
      const fetchPromises = [];
      const { saveInputArray, modifiedRootPermissionData, message } =
        handleQuotedItemMappingFormSaveHelper(
          values,
          changedValuesList,
          rootPermissionData,
          quotedItemConversionData,
          orderedItemList,
          invoicedItemList,
          quoteItemListItems,
          mandatoryFields
        );
      if (message.length) {
        toast.error(`Please select mandatory fields ${message}`);
        setErrorMessage(message);
      } else {
        setErrorMessage("");
      }
      for (let reqData of saveInputArray) {
        fetchPromises.push(
          await saveData({
            variables: reqData,
          })
        );
      }
      let errorCount = 0;
      Promise.all(fetchPromises).then((result) => {
        result.forEach((val) => {
          if (val.data.save.code !== 200) {
            errorCount += 1;
          }
        });
        if (errorCount > 0) {
          toast.error(`Failed to save mapping for ${errorCount} values`);
          setQuotedItemMappingSaving(false);
        } else {
          toast.success(`Successfully saved mapping`);
          const { quoteConversionDataDict, updatedListValues } =
            quotedItemMappingResponseDataHandler(
              result,
              quotedItemConversionData,
              originalListValues
            );
          setQuotedItemConversionData(quoteConversionDataDict);
          setOriginalListValues(updatedListValues);
          setChangedValuesList([]);
          setRootPermissionData(modifiedRootPermissionData);
          setQuotedItemMappingSaving(false);
        }
      });
    } catch (error) {
      console.error(error);
      setQuotedItemMappingSaving(false);
    }
  };

  React.useEffect(() => {
    getLayout({
      variables: {
        modelName: "Layout",
        fields: ["id", "name", "moduleName", "layout", "config", "type"],
        filters: [
          {
            name: "moduleName",
            operator: "in",
            value: ["orderedItem", "invoicedItem", "quotedItem"],
          },
        ],
      },
    }).then((response) => {
      const mandatoryFieldsData: {
        orderedItem: ICustomField[];
        invoicedItem: ICustomField[];
        quotedItem: ICustomField[];
      } = { orderedItem: [], invoicedItem: [], quotedItem: [] };

      if (response?.data?.fetch?.messageKey.includes("-success")) {
        const result = response.data.fetch.data;
        for (let val of result) {
          if (!val) continue;
          if (val.moduleName === "quotedItem") {
            setQuotedItemListItems(
              val.config.fields
                .filter((field) => field.readOnly === false && field.visible)
                .map((quoteValue) => {
                  return {
                    value: quoteValue.uniqueName.split(".").pop() || "",
                    label: quoteValue.label.en,
                    dataType: quoteValue.dataType,
                    uniqueName: quoteValue.uniqueName,
                    dataTypeMetadata: quoteValue.dataTypeMetadata,
                  };
                })
            );
          } else if (val.moduleName === "orderedItem") {
            mandatoryFieldsData["orderedItem"] = mandatoryFieldsExtractor(
              val.config.fields,
              quoteMappingExcludedFieldNames
            );
            setOrderedItemList(
              dropdownListHelper(
                val.config.fields,
                quoteMappingExcludedFieldNames,
                {}
              )
            );
          } else if (val.moduleName === "invoicedItem") {
            mandatoryFieldsData["invoicedItem"] = mandatoryFieldsExtractor(
              val.config.fields,
              quoteMappingExcludedFieldNames
            );
            setInvoicedItemList(
              dropdownListHelper(
                val.config.fields,
                quoteMappingExcludedFieldNames,
                {}
              )
            );
          }
        }
      }
      setMandatoryFields(mandatoryFieldsData);
      setLayoutLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (
      !errorMessage.length &&
      rootPermissionData.length &&
      Object.keys(mandatoryFields).length
    ) {
      const message = checkMandatoryFields(rootPermissionData, mandatoryFields);
      if (message.length) {
        setErrorMessage(message);
      } else {
        setErrorMessage("");
      }
    }
  }, [rootPermissionData, mandatoryFields]);

  if (moduleLoading || conversionDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        <PageLoader />
      </div>
    );
  }
  if (!quotedItemConversionData) return null;
  return (
    <QuotedItemConversionContainer
      quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
      quoteItemListItems={quoteItemListItems}
      orderedItemList={orderedItemList}
      invoicedItemList={invoicedItemList}
      quotedItemConversionData={quotedItemConversionData}
      dropdownChangeHandler={dropdownChangeHandler}
      layoutLoading={layoutLoading}
      handleFormSave={handleFormSave}
      changedValuesList={changedValuesList}
      setChangedValuesList={(value: string[]) => {
        setChangedValuesList(value);
      }}
      originalListValues={originalListValues}
      errorMessage={errorMessage}
      quotedItemMappingSaving={quotedItemMappingSaving}
      labelData={labelData}
    />
  );
};
