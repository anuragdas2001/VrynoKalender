import React from "react";
import { useFormikContext } from "formik";
import Pagination from "../../../shared/components/Pagination";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { LeadConversionConvertForm } from "./LeadConversionConvertForm";
import { BaseGenericObjectType } from "../../../../../../models/shared";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import FormRadioButton from "../../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";
import {
  IConvertLeadData,
  ILeadContactOrganization,
} from "../utils/genericLeadConversionInterfaces";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";

export const LeadContactOrganizationContainer = ({
  convertLeadData,
  leadModuleData,
  moduleFieldList,
  navModuleName,
  handleCheckboxSelect,
  convertRecordItemSelect,
  selectedItems,
  appName,
  id,
  moduleName,
  contactSelected,
  onPageChange,
  tableFieldsList,
  countryCodeInUserPreference,
  handleSelectedModule,
}: {
  convertLeadData: IConvertLeadData;
  leadModuleData: ILeadContactOrganization;
  moduleFieldList: ICustomField[];
  navModuleName: string;
  handleCheckboxSelect: (
    module: string,
    createNew: boolean,
    showTable: boolean
  ) => void;
  convertRecordItemSelect: (
    module: "contact" | "organization",
    record: BaseGenericObjectType
  ) => void;
  selectedItems: BaseGenericObjectType[];
  appName: string;
  id: string;
  moduleName: "contact" | "organization";
  contactSelected?: ILeadContactOrganization;
  onPageChange: (moduleName: string, pageNumber: number) => void;
  tableFieldsList: ICustomField[];
  countryCodeInUserPreference: string;
  handleSelectedModule: (name: string) => void;
}) => {
  const { setFieldValue } = useFormikContext<Record<string, string>>();

  const [tableHeaders, setTableHeaders] = React.useState([
    {
      columnName: "name",
      label: "Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "email",
      label: "Email",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "phoneNumber",
      label: "Phone Number",
      dataType: SupportedDataTypes.phoneNumber,
    },
  ]);

  React.useEffect(() => {
    if (tableFieldsList.length) {
      const list =
        moduleName === "contact"
          ? [
              {
                columnName: "firstName",
                label: "First Name",
                dataType: SupportedDataTypes.singleline,
              },
              ...tableHeaders,
            ]
          : tableHeaders;
      let updatedTableHeaders = list.map((header) => {
        let result = null;
        tableFieldsList.forEach((field) => {
          if (header.columnName === field.name) {
            result = { ...header, label: field.label.en };
          }
        });
        return result ? result : header;
      });
      setTableHeaders(updatedTableHeaders);
    }
  }, [tableFieldsList]);

  React.useEffect(() => {
    if (leadModuleData.processed && leadModuleData.showTable)
      setFieldValue(`add-create-${moduleName}`, `add-${moduleName}`);
    if (leadModuleData.processed && leadModuleData.available === false)
      setFieldValue(`add-create-${moduleName}`, `create-${moduleName}`);
  }, [leadModuleData]);

  const ContactModuleRadioComponentFoNotAvailable = () => (
    <FormRadioButton
      name={`add-create-${moduleName}`}
      label={navModuleName}
      required={true}
      options={[
        {
          value: `create-${moduleName}`,
          label: `Create a new ${navModuleName}${
            moduleName === "contact"
              ? convertLeadData.fullName
                ? `  (${convertLeadData.fullName})`
                : ""
              : convertLeadData.company
              ? `  (${convertLeadData.company})`
              : ""
          }`,
        },
      ]}
      disabled={true}
    />
  );

  return (moduleName === "organization" && contactSelected?.checked) ||
    moduleName === "contact" ? (
    <>
      {leadModuleData.available && (
        <FormRadioButton
          name={`add-create-${moduleName}`}
          label={navModuleName}
          required={true}
          options={[
            {
              value: `add-${moduleName}`,
              label: `Add to existing ${navModuleName}`,
            },
            {
              value: `create-${moduleName}`,
              label: `Create a new ${navModuleName}${
                moduleName === "contact"
                  ? convertLeadData.fullName
                    ? `  (${convertLeadData.fullName})`
                    : ""
                  : convertLeadData.company
                  ? `  (${convertLeadData.company})`
                  : ""
              }`,
            },
          ]}
          onChange={(e) => {
            if (e.target.value.includes("add")) {
              handleCheckboxSelect(moduleName, false, true);
            } else {
              handleCheckboxSelect(
                moduleName,
                !leadModuleData.createNew,
                false
              );
            }
            setFieldValue(`add-create-${moduleName}`, e.target.value);
          }}
        />
      )}

      {leadModuleData.showTable && leadModuleData.data && (
        <div>
          <div className="hidden sm:flex">
            <Pagination
              itemsCount={leadModuleData.itemsCount}
              currentPageItemCount={leadModuleData.data.length}
              pageSize={50}
              onPageChange={(pageNumber) =>
                onPageChange(moduleName, pageNumber)
              }
              currentPageNumber={leadModuleData.currentPageNumber}
              pageInfoLocation="between"
            />
          </div>
          <div className="sm:hidden flex flex-col">
            <Pagination
              itemsCount={leadModuleData.itemsCount}
              currentPageItemCount={leadModuleData.data.length}
              pageSize={50}
              onPageChange={(pageNumber) =>
                onPageChange(moduleName, pageNumber)
              }
              currentPageNumber={leadModuleData.currentPageNumber}
            />
          </div>
          <div className="max-h-[420px] overflow-scroll pr-1 mt-4">
            <GenericList
              data={leadModuleData.data}
              tableHeaders={tableHeaders}
              selectedItems={selectedItems}
              onItemSelect={(record) =>
                convertRecordItemSelect(moduleName, record)
              }
              onDetail={false}
              showIcons={false}
              rowUrlGenerator={(item) => {
                return appsUrlGenerator(
                  appName,
                  moduleName,
                  AllowedViews.detail,
                  item.id as string
                );
              }}
              target="_blank"
              listSelector={true}
              selectMode="radio"
              radioName={moduleName}
              oldGenericListUI={true}
            />
          </div>
        </div>
      )}

      {leadModuleData.checked && leadModuleData.createNew ? (
        moduleName === "organization" ? (
          convertLeadData.company &&
          convertLeadData.company.length > 1 && (
            <>
              {!leadModuleData.available &&
                ContactModuleRadioComponentFoNotAvailable()}
              {moduleFieldList.length ? (
                <div className="">
                  <LeadConversionConvertForm
                    fieldsList={moduleFieldList}
                    id={id}
                    moduleName={moduleName}
                    handleSelectedModule={handleSelectedModule}
                    countryCodeInUserPreference={countryCodeInUserPreference}
                  />
                </div>
              ) : (
                <></>
              )}
            </>
          )
        ) : (
          convertLeadData.fullName &&
          convertLeadData.fullName.length && (
            <>
              {!leadModuleData.available &&
                ContactModuleRadioComponentFoNotAvailable()}
              {moduleFieldList?.length ? (
                <LeadConversionConvertForm
                  fieldsList={moduleFieldList}
                  id={id}
                  moduleName={moduleName}
                  handleSelectedModule={handleSelectedModule}
                  countryCodeInUserPreference={countryCodeInUserPreference}
                />
              ) : (
                <></>
              )}
            </>
          )
        )
      ) : (
        <></>
      )}
    </>
  ) : (
    <></>
  );
};
