import { FormikValues } from "formik";
import { IConversionDropdownListType } from "../conversionTypes";
import {
  IQuoteMappingLabels,
  QuoteConversionDataType,
} from "./QuoteConversionMappingScreen";
import { QuoteConversionDropdown } from "./QuoteConversionDropdown";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";

export const QuoteConversionMappingList = ({
  quoteMappingExcludedFieldNames,
  quoteListItems,
  salesOrderList,
  invoiceList,
  quoteConversionData,
  dropdownChangeHandler,
  labelData,
  salesOrderViewPermission,
  invoiceViewPermission,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  quoteListItems: IConversionDropdownListType[];
  salesOrderList: IConversionDropdownListType[];
  invoiceList: IConversionDropdownListType[];
  quoteConversionData: QuoteConversionDataType;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IQuoteMappingLabels;
  salesOrderViewPermission: boolean;
  invoiceViewPermission: boolean;
}) => {
  return (
    <div className="flex flex-col w-full">
      {quoteListItems.map((item, index) => {
        if (!quoteMappingExcludedFieldNames.has(item.value)) {
          return (
            <QuoteConversionDropdown
              key={item.value}
              quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
              item={item}
              salesOrderList={salesOrderList}
              invoiceList={invoiceList}
              quoteConversionData={quoteConversionData}
              dataType={item.dataType as SupportedDataTypes}
              dropdownChangeHandler={dropdownChangeHandler}
              labelData={labelData}
              marginBottom={index === quoteListItems?.length - 1 ? "" : "mb-3"}
              salesOrderViewPermission={salesOrderViewPermission}
              invoiceViewPermission={invoiceViewPermission}
            />
          );
        }
      })}
    </div>
  );
};
