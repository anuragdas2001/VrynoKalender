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
  IOrderedItemMappingLabels,
  OrderedItemConversionDataType,
} from "./OrderedItemConversionMappingScreen";

export const OrderedItemConversionDropdown = ({
  quoteMappingExcludedFieldNames,
  item,
  invoicedItemList,
  orderedItemConversionData,
  dataType,
  dropdownChangeHandler,
  labelData,
  marginBottom,
}: {
  quoteMappingExcludedFieldNames: Set<string>;
  item: IConversionDropdownListType;
  invoicedItemList: IConversionDropdownListType[];
  orderedItemConversionData: OrderedItemConversionDataType;
  dataType: SupportedDataTypes;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IOrderedItemMappingLabels;
  marginBottom: string;
}) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [invoiceDropdown, setInvoiceDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);

  React.useEffect(() => {
    if (
      !quoteMappingExcludedFieldNames.has(item.value) &&
      invoicedItemList.length
    ) {
      setInvoiceDropdown(
        invoicedItemList.filter((val) =>
          conversionDropdownFilterHelper(val, dataType, item)
        )
      );
    }
  }, [quoteMappingExcludedFieldNames, invoicedItemList]);

  React.useEffect(() => {
    // if (!salesOrderDropdown.length || !invoiceDropdown.length) return;
    if (Object?.keys(orderedItemConversionData || {})?.length === 0) return;

    setFieldValue(
      `${item.value}-invoicedItem`,
      orderedItemConversionData[item.value]?.invoicedItem?.value || null
    );
  }, [orderedItemConversionData]);
  // }, [orderedItemConversionData, salesOrderDropdown, invoiceDropdown]);

  return (
    <GenericHeaderCardContainerTransparentBackground
      cardHeading={item.label}
      extended={false}
      key={item.value}
      paddingY="py-3"
      marginBottom={marginBottom}
    >
      <div className="flex justify-between gap-6 px-4">
        <div className="w-full">
          <FormDropdown
            name={`${item.value}-invoicedItem`}
            label={labelData.invoicedItem}
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
                `${item.value}-invoicedItem`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
            dataTestId={`${item.label}-invoicedItem`}
          />
        </div>
      </div>
    </GenericHeaderCardContainerTransparentBackground>
  );
};
