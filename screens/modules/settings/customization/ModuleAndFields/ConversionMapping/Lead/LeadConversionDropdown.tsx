import React from "react";
import { FormikValues, useFormikContext } from "formik";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import GenericHeaderCardContainerTransparentBackground from "../../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainerTransparentDropdown";
import {
  IMappingLabels,
  LeadConversionDataType,
} from "./LeadConversionMappingScreen";
import {
  IConversionDropdownListType,
  IMappingDropdownType,
} from "../conversionTypes";

export const LeadConversionDropdown = ({
  leadMappingExcludedFieldNames,
  item,
  organizationList,
  contactList,
  dealList,
  leadConversionData,
  dataType,
  dropdownChangeHandler,
  labelData,
  marginBottom,
}: {
  leadMappingExcludedFieldNames: Set<string>;
  item: IConversionDropdownListType;
  organizationList: IConversionDropdownListType[];
  contactList: IConversionDropdownListType[];
  dealList: IConversionDropdownListType[];
  leadConversionData: LeadConversionDataType;
  dataType: SupportedDataTypes;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  labelData: IMappingLabels;
  marginBottom: string;
}) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [organizationDropdown, setOrganizationDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);
  const [contactDropdown, setContactDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);
  const [dealDropdown, setDealDropdown] = React.useState<
    IMappingDropdownType[]
  >([]);

  const leadDropdownFilterHelper = (val: IConversionDropdownListType) => {
    if (
      val.dataType === dataType &&
      [
        SupportedDataTypes.recordLookup,
        SupportedDataTypes.multiSelectRecordLookup,
      ].includes(dataType)
    ) {
      return (
        val.dataTypeMetadata.allLookups[0]?.moduleName ===
        item.dataTypeMetadata.allLookups[0]?.moduleName
      );
    }
    return val.dataType === dataType;
  };

  React.useEffect(() => {
    if (
      !leadMappingExcludedFieldNames.has(item.value) &&
      organizationList.length &&
      contactList.length &&
      dealList.length
    ) {
      setOrganizationDropdown(
        organizationList.filter((val) => leadDropdownFilterHelper(val))
      );
      setContactDropdown(
        contactList.filter((val) => leadDropdownFilterHelper(val))
      );
      setDealDropdown(dealList.filter((val) => leadDropdownFilterHelper(val)));
    }
  }, [leadMappingExcludedFieldNames, organizationList, contactList, dealList]);

  React.useEffect(() => {
    setFieldValue(
      `${item.value}-organization`,
      leadConversionData[item.value]
        ? leadConversionData[item.value].organization
        : null
    );
    setFieldValue(
      `${item.value}-contact`,
      leadConversionData[item.value]
        ? leadConversionData[item.value].contact
        : null
    );
    setFieldValue(
      `${item.value}-deal`,
      leadConversionData[item.value]
        ? leadConversionData[item.value].deal
        : null
    );
  }, [leadConversionData]);

  return (
    <GenericHeaderCardContainerTransparentBackground
      cardHeading={item.label}
      extended={false}
      key={item.value}
      paddingY="py-3"
      marginBottom={marginBottom}
    >
      <div className="flex justify-between gap-6 px-4">
        <div className="w-1/3">
          <FormDropdown
            name={`${item.value}-organization`}
            label={labelData.organization}
            placeholder="None"
            options={[
              {
                dataType: dataType,
                label: "None",
                value: "none",
              },
              ...organizationDropdown,
            ]}
            onChange={(selectedOption) => {
              setFieldValue(
                `${item.value}-organization`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
          />
        </div>
        <div className="w-1/3">
          <FormDropdown
            name={`${item.value}-contact`}
            label={labelData.contact}
            placeholder="None"
            options={[
              {
                dataType: dataType,
                label: "None",
                value: "none",
              },
              ...contactDropdown,
            ]}
            onChange={(selectedOption) => {
              setFieldValue(
                `${item.value}-contact`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
          />
        </div>
        <div className="w-1/3">
          <FormDropdown
            name={`${item.value}-deal`}
            label={labelData.deal}
            placeholder="None"
            options={[
              {
                dataType: dataType,
                label: "None",
                value: "none",
              },
              ...dealDropdown,
              ,
            ]}
            onChange={(selectedOption) => {
              setFieldValue(
                `${item.value}-deal`,
                selectedOption.currentTarget.value
              );
              dropdownChangeHandler(selectedOption.currentTarget.name, values);
            }}
            allowMargin={false}
          />
        </div>
      </div>
    </GenericHeaderCardContainerTransparentBackground>
  );
};
