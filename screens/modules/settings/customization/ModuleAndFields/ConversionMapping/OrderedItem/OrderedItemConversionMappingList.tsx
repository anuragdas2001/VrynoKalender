import { FormikValues } from "formik";
import { IConversionDropdownListType } from "../conversionTypes";
import {
  IOrderedItemMappingLabels,
  OrderedItemConversionDataType,
} from "./OrderedItemConversionMappingScreen";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import { OrderedItemConversionDropdown } from "./OrderedItemConversionDropdown";

export const OrderedItemConversionMappingList = ({
  quoteMappingExcludedFieldNames,
  orderedItemListItems,
  invoicedItemList,
  orderedItemConversionData,
  dropdownChangeHandler,
  labelData,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  orderedItemListItems: IConversionDropdownListType[];
  invoicedItemList: IConversionDropdownListType[];
  orderedItemConversionData: OrderedItemConversionDataType;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IOrderedItemMappingLabels;
}) => {
  return (
    <div className="flex flex-col w-full">
      {orderedItemListItems.map((item, index) => {
        if (!quoteMappingExcludedFieldNames.has(item.value)) {
          return (
            <OrderedItemConversionDropdown
              key={item.value}
              quoteMappingExcludedFieldNames={quoteMappingExcludedFieldNames}
              item={item}
              invoicedItemList={invoicedItemList}
              orderedItemConversionData={orderedItemConversionData}
              dataType={item.dataType as SupportedDataTypes}
              dropdownChangeHandler={dropdownChangeHandler}
              labelData={labelData}
              marginBottom={
                index === orderedItemListItems?.length - 1 ? "" : "mb-3"
              }
            />
          );
        }
      })}
    </div>
  );
};
