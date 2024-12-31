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
  ISalesOrderMappingLabels,
  SalesOrderConversionDataType,
} from "./SalesOrderConversionMappingScreen";
import {
  checkMandatoryFields,
  dropdownListHelper,
  mandatoryFieldsExtractor,
  quoteMappingExcludedFieldNames,
} from "../conversionMappingHelper";
import { IConversionDropdownListType } from "../conversionTypes";
import { toast } from "react-toastify";
import {
  handleSalesOrderMappingFormSaveHelper,
  salesOrderMappingResponseDataHandler,
} from "./salesOrderConversionMappingHelper";
import { SalesOrderConversionContainer } from "./SalesOrderConversionContainer";

export const ConnectedSalesOrderConversionMapping = ({
  salesOrderConversionData,
  labelData,
  rootPermissionData,
  setSalesOrderConversionData,
  setRootPermissionData,
  moduleLoading,
}: {
  salesOrderConversionData: SalesOrderConversionDataType;
  labelData: ISalesOrderMappingLabels;
  rootPermissionData: Record<string, string | null>[];
  setSalesOrderConversionData: (value: SalesOrderConversionDataType) => void;
  setRootPermissionData: (value: Record<string, string | null>[]) => void;
  moduleLoading: boolean;
}) => {
  const [invoiceList, setInvoiceList] = React.useState<
    IConversionDropdownListType[]
  >([]);

  const [salesOrderListItems, setSalesOrderListItems] = React.useState<
    IConversionDropdownListType[]
  >([]);
  const [originalListValues, setOriginalListValues] = React.useState<
    Record<string, string | null>
  >({});
  const [layoutLoading, setLayoutLoading] = React.useState(true);
  const [changedValuesList, setChangedValuesList] = React.useState<string[]>(
    []
  );
  const [salesOrderMappingSaving, setSalesOrderMappingSaving] =
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
    setSalesOrderMappingSaving(true);
    try {
      const fetchPromises = [];
      const { saveInputArray, modifiedRootPermissionData, message } =
        handleSalesOrderMappingFormSaveHelper(
          values,
          changedValuesList,
          rootPermissionData,
          salesOrderConversionData,
          invoiceList,
          salesOrderListItems,
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
          setSalesOrderMappingSaving(false);
        } else {
          toast.success(`Successfully saved mapping`);
          const { salesOrderConversionDataDict, updatedListValues } =
            salesOrderMappingResponseDataHandler(
              result,
              salesOrderConversionData,
              originalListValues
            );
          setSalesOrderConversionData(salesOrderConversionDataDict);
          setOriginalListValues(updatedListValues);
          setChangedValuesList([]);
          setRootPermissionData(modifiedRootPermissionData);
          setSalesOrderMappingSaving(false);
        }
      });
    } catch (error) {
      console.error(error);
      setSalesOrderMappingSaving(false);
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
            value: ["invoice", "salesOrder"],
          },
        ],
      },
    }).then((response) => {
      const mandatoryFieldsData: {
        salesOrder: ICustomField[];
        invoice: ICustomField[];
      } = { salesOrder: [], invoice: [] };

      if (response?.data?.fetch?.messageKey.includes("-success")) {
        const result = response.data.fetch.data;
        for (let val of result) {
          if (!val) continue;
          if (val.moduleName === "salesOrder") {
            setSalesOrderListItems(
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
          } else if (val.moduleName === "invoice") {
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
    <SalesOrderConversionContainer
      quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
      salesOrderListItems={salesOrderListItems}
      invoiceList={invoiceList}
      salesOrderConversionData={salesOrderConversionData}
      dropdownChangeHandler={dropdownChangeHandler}
      layoutLoading={layoutLoading}
      handleFormSave={handleFormSave}
      changedValuesList={changedValuesList}
      setChangedValuesList={(value: string[]) => {
        setChangedValuesList(value);
      }}
      originalListValues={originalListValues}
      errorMessage={errorMessage}
      salesOrderMappingSaving={salesOrderMappingSaving}
      labelData={labelData}
    />
  );
};
