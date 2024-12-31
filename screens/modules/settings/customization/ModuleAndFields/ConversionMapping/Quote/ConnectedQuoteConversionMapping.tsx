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
import {
  IQuoteMappingLabels,
  QuoteConversionDataType,
} from "./QuoteConversionMappingScreen";
import {
  checkMandatoryFields,
  dropdownListHelper,
  mandatoryFieldsExtractor,
  quoteMappingExcludedFieldNames,
} from "../conversionMappingHelper";
import { IConversionDropdownListType } from "../conversionTypes";
import { QuoteConversionContainer } from "./QuoteConversionContainer";
import { toast } from "react-toastify";
import {
  handleQuoteMappingFormSaveHelper,
  quoteMappingResponseDataHandler,
} from "./quoteConversionMappingHelper";

export const ConnectedQuoteConversionMapping = ({
  quoteConversionData,
  labelData,
  rootPermissionData,
  setQuoteConversionData,
  setRootPermissionData,
  salesOrderViewPermission,
  invoiceViewPermission,
}: {
  quoteConversionData: QuoteConversionDataType;
  labelData: IQuoteMappingLabels;
  rootPermissionData: Record<string, string | null>[];
  setQuoteConversionData: (value: QuoteConversionDataType) => void;
  setRootPermissionData: (value: Record<string, string | null>[]) => void;
  salesOrderViewPermission: boolean;
  invoiceViewPermission: boolean;
}) => {
  const [salesOrderList, setSalesOrderList] = React.useState<
    IConversionDropdownListType[]
  >([]);
  const [invoiceList, setInvoiceList] = React.useState<
    IConversionDropdownListType[]
  >([]);

  const [quoteListItems, setQuoteListItems] = React.useState<
    IConversionDropdownListType[]
  >([]);
  const [originalListValues, setOriginalListValues] = React.useState<
    Record<string, string | null>
  >({});
  const [layoutLoading, setLayoutLoading] = React.useState(true);
  const [changedValuesList, setChangedValuesList] = React.useState<string[]>(
    []
  );
  const [quoteMappingSaving, setQuoteMappingSaving] = React.useState(false);
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
    setQuoteMappingSaving(true);
    try {
      const fetchPromises = [];
      const { saveInputArray, modifiedRootPermissionData, message } =
        handleQuoteMappingFormSaveHelper(
          values,
          changedValuesList,
          rootPermissionData,
          quoteConversionData,
          salesOrderList,
          invoiceList,
          quoteListItems,
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
          setQuoteMappingSaving(false);
        } else {
          toast.success(`Successfully saved mapping`);
          const { quoteConversionDataDict, updatedListValues } =
            quoteMappingResponseDataHandler(
              result,
              quoteConversionData,
              originalListValues
            );
          setQuoteConversionData(quoteConversionDataDict);
          setOriginalListValues(updatedListValues);
          setChangedValuesList([]);
          setRootPermissionData(modifiedRootPermissionData);
          setQuoteMappingSaving(false);
        }
      });
    } catch (error) {
      console.error(error);
      setQuoteMappingSaving(false);
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
            value: ["salesOrder", "invoice", "quote"],
          },
        ],
      },
    }).then((response) => {
      const mandatoryFieldsData: {
        salesOrder: ICustomField[];
        invoice: ICustomField[];
        quote: ICustomField[];
      } = { salesOrder: [], invoice: [], quote: [] };

      if (response?.data?.fetch?.messageKey.includes("-success")) {
        const result = response.data.fetch.data;
        for (let val of result) {
          if (!val) continue;
          if (val.moduleName === "quote") {
            setQuoteListItems(
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
          } else if (
            salesOrderViewPermission &&
            val.moduleName === "salesOrder"
          ) {
            mandatoryFieldsData["salesOrder"] = mandatoryFieldsExtractor(
              val.config.fields,
              quoteMappingExcludedFieldNames
            );
            setSalesOrderList(
              dropdownListHelper(
                val.config.fields,
                quoteMappingExcludedFieldNames,
                {}
              )
            );
          } else if (invoiceViewPermission && val.moduleName === "invoice") {
            mandatoryFieldsData["invoice"] = mandatoryFieldsExtractor(
              val.config.fields,
              quoteMappingExcludedFieldNames
            );
            setInvoiceList(
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

  return (
    <QuoteConversionContainer
      quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
      quoteListItems={quoteListItems}
      salesOrderList={salesOrderList}
      invoiceList={invoiceList}
      quoteConversionData={quoteConversionData}
      dropdownChangeHandler={dropdownChangeHandler}
      layoutLoading={layoutLoading}
      handleFormSave={handleFormSave}
      changedValuesList={changedValuesList}
      setChangedValuesList={(value: string[]) => {
        setChangedValuesList(value);
      }}
      originalListValues={originalListValues}
      errorMessage={errorMessage}
      quoteMappingSaving={quoteMappingSaving}
      labelData={labelData}
      salesOrderViewPermission={salesOrderViewPermission}
      invoiceViewPermission={invoiceViewPermission}
    />
  );
};
