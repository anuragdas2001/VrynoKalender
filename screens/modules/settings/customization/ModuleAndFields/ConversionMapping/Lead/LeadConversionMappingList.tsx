import { FormikValues } from "formik";
import { LeadConversionDropdown } from "./LeadConversionDropdown";
import {
  IMappingLabels,
  LeadConversionDataType,
} from "./LeadConversionMappingScreen";
import { IConversionDropdownListType } from "../conversionTypes";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";

export const LeadConversionMappingList = ({
  leadMappingExcludedFieldNames,
  leadListItems,
  organizationList,
  contactList,
  dealList,
  leadConversionData,
  dropdownChangeHandler,
  labelData,
}: {
  leadMappingExcludedFieldNames: Set<string>;
  leadListItems: IConversionDropdownListType[];
  organizationList: IConversionDropdownListType[];
  contactList: IConversionDropdownListType[];
  dealList: IConversionDropdownListType[];
  leadConversionData: LeadConversionDataType;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IMappingLabels;
}) => {
  return (
    <div className="flex flex-col w-full">
      {leadListItems.map((item, index) => {
        if (!leadMappingExcludedFieldNames.has(item.value)) {
          return (
            <LeadConversionDropdown
              leadMappingExcludedFieldNames={leadMappingExcludedFieldNames}
              item={item}
              organizationList={organizationList}
              contactList={contactList}
              dealList={dealList}
              key={item.value}
              leadConversionData={leadConversionData}
              dataType={item.dataType as SupportedDataTypes}
              dropdownChangeHandler={dropdownChangeHandler}
              labelData={labelData}
              marginBottom={index === leadListItems?.length - 1 ? "" : "mb-3"}
            />
          );
        }
      })}
    </div>
  );
};
