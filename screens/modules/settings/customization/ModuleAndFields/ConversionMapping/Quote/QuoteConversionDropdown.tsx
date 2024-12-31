import React from "react";
import { FormikValues, useFormikContext } from "formik";
import { conversionDropdownFilterHelper } from "../conversionMappingHelper";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import GenericHeaderCardContainerTransparentBackground from "../../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainerTransparentDropdown";
import {
  IConversionDropdownListType,
  IMappingDropdownType,
} from "../conversionTypes";
import {
  IQuoteMappingLabels,
  QuoteConversionDataType,
} from "./QuoteConversionMappingScreen";

export const QuoteConversionDropdown = ({
  quoteMappingExcludedFieldNames,
  item,
  salesOrderList,
  invoiceList,
  quoteConversionData,
  dataType,
  dropdownChangeHandler,
  labelData,
  marginBottom,
  salesOrderViewPermission,
  invoiceViewPermission,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  item: IConversionDropdownListType;
  salesOrderList: IConversionDropdownListType[];
  invoiceList: IConversionDropdownListType[];
  quoteConversionData: QuoteConversionDataType;
  dataType: SupportedDataTypes;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IQuoteMappingLabels;
  marginBottom: string;
  salesOrderViewPermission: boolean;
  invoiceViewPermission: boolean;
}) => {
  const { values, setFieldValue, setValues } = useFormikContext<FormikValues>();
  const [salesOrderDropdown, setSalesOrderDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);
  const [invoiceDropdown, setInvoiceDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);

  React.useEffect(() => {
    if (!quoteMappingExcludedFieldNames.has(item.value)) {
      if (salesOrderList.length)
        setSalesOrderDropdown(
          salesOrderList.filter((val) =>
            conversionDropdownFilterHelper(val, dataType, item)
          )
        );
      if (invoiceList.length)
        setInvoiceDropdown(
          invoiceList.filter((val) =>
            conversionDropdownFilterHelper(val, dataType, item)
          )
        );
    }
  }, [quoteMappingExcludedFieldNames, salesOrderList, invoiceList]);

  React.useEffect(() => {
    // if (!salesOrderDropdown.length || !invoiceDropdown.length) return;
    if (Object?.keys(quoteConversionData || {})?.length === 0) return;

    setFieldValue(
      `${item.value}-salesOrder`,
      quoteConversionData[item.value]?.salesOrder?.value || null
    );
    setFieldValue(
      `${item.value}-invoice`,
      quoteConversionData[item.value]?.invoice?.value || null
    );
  }, [quoteConversionData]);
  // }, [quoteConversionData, salesOrderDropdown, invoiceDropdown]);

  return (
    <GenericHeaderCardContainerTransparentBackground
      cardHeading={item.label}
      extended={false}
      key={item.value}
      paddingY="py-3"
      marginBottom={marginBottom}
    >
      <div className="flex justify-between gap-6 px-4">
        {salesOrderViewPermission ? (
          <div className={invoiceViewPermission ? "w-1/2" : "w-full"}>
            <FormDropdown
              name={`${item.value}-salesOrder`}
              label={labelData.salesOrder}
              placeholder="None"
              options={[
                {
                  dataType: dataType,
                  label: "None",
                  value: "none",
                },
                ...salesOrderDropdown,
              ]}
              onChange={(selectedOption) => {
                setFieldValue(
                  `${item.value}-salesOrder`,
                  selectedOption.currentTarget.value
                );
                dropdownChangeHandler(
                  selectedOption.currentTarget.name,
                  values
                );
              }}
              allowMargin={false}
              dataTestId={`${item.label}-salesOrder`}
            />
          </div>
        ) : (
          <></>
        )}
        {invoiceViewPermission ? (
          <div className={salesOrderViewPermission ? "w-1/2" : "w-full"}>
            <FormDropdown
              name={`${item.value}-invoice`}
              label={labelData.invoice}
              placeholder="None"
              options={[
                {
                  dataType: dataType,
                  label: "None",
                  value: "none",
                },
                ...invoiceDropdown,
              ]}
              onChange={(selectedOption) => {
                setFieldValue(
                  `${item.value}-invoice`,
                  selectedOption.currentTarget.value
                );
                dropdownChangeHandler(
                  selectedOption.currentTarget.name,
                  values
                );
              }}
              allowMargin={false}
              dataTestId={`${item.label}-invoice`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </GenericHeaderCardContainerTransparentBackground>
  );
};
