import { FormikValues } from "formik";
import { IConversionDropdownListType } from "../conversionTypes";
import { QuotedItemConversionDropdown } from "./QuotedItemConversionDropdown";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import {
  IQuotedItemMappingLabels,
  QuotedItemConversionDataType,
} from "./QuotedItemConversionMappingScreen";

export const QuotedItemConversionMappingList = ({
  quoteMappingExcludedFieldNames,
  quoteItemListItems,
  orderedItemList,
  invoicedItemList,
  quotedItemConversionData,
  dropdownChangeHandler,
  labelData,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  quoteItemListItems: IConversionDropdownListType[];
  orderedItemList: IConversionDropdownListType[];
  invoicedItemList: IConversionDropdownListType[];
  quotedItemConversionData: QuotedItemConversionDataType;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IQuotedItemMappingLabels;
}) => {
  return (
    <div className="flex flex-col w-full">
      {quoteItemListItems.map((item, index) => {
        if (!quoteMappingExcludedFieldNames.has(item.value)) {
          return (
            <QuotedItemConversionDropdown
              key={item.value}
              quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
              item={item}
              orderedItemList={orderedItemList}
              invoicedItemList={invoicedItemList}
              quotedItemConversionData={quotedItemConversionData}
              dataType={item.dataType as SupportedDataTypes}
              dropdownChangeHandler={dropdownChangeHandler}
              labelData={labelData}
              marginBottom={
                index === quoteItemListItems?.length - 1 ? "" : "mb-3"
              }
            />
          );
        }
      })}
    </div>
  );
};
