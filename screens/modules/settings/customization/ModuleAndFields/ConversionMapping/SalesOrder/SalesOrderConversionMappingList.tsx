import { FormikValues } from "formik";
import { IConversionDropdownListType } from "../conversionTypes";
import {
  ISalesOrderMappingLabels,
  SalesOrderConversionDataType,
} from "./SalesOrderConversionMappingScreen";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import { SalesOrderConversionDropdown } from "./SalesOrderConversionDropdown";

export const SalesOrderConversionMappingList = ({
  quoteMappingExcludedFieldNames,
  salesOrderListItems,
  invoiceList,
  salesOrderConversionData,
  dropdownChangeHandler,
  labelData,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  salesOrderListItems: IConversionDropdownListType[];
  invoiceList: IConversionDropdownListType[];
  salesOrderConversionData: SalesOrderConversionDataType;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: ISalesOrderMappingLabels;
}) => {
  return (
    <div className="flex flex-col w-full">
      {salesOrderListItems.map((item, index) => {
        if (!quoteMappingExcludedFieldNames.has(item.value)) {
          return (
            <SalesOrderConversionDropdown
              key={item.value}
              quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
              item={item}
              invoiceList={invoiceList}
              salesOrderConversionData={salesOrderConversionData}
              dataType={item.dataType as SupportedDataTypes}
              dropdownChangeHandler={dropdownChangeHandler}
              labelData={labelData}
              marginBottom={
                index === salesOrderListItems?.length - 1 ? "" : "mb-3"
              }
            />
          );
        }
      })}
    </div>
  );
};
