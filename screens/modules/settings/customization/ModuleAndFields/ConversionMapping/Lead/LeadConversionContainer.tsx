import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import { setHeight } from "../../../../../crm/shared/utils/setHeight";
import { FormikFormProps } from "../../../../../../../shared/constants";
import { LeadConversionMappingList } from "./LeadConversionMappingList";
import GenericBackHeader from "../../../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import { Loading } from "../../../../../../../components/TailwindControls/Loading/Loading";
import ItemsLoader from "../../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import {
  IMappingLabels,
  LeadConversionDataType,
} from "./LeadConversionMappingScreen";
import { BaseGenericObjectType } from "../../../../../../../models/shared";
import { IConversionDropdownListType } from "../conversionTypes";

export const LeadConversionContainer = ({
  leadMappingExcludedFieldNames,
  leadListItems,
  organizationList,
  contactList,
  dealList,
  leadConversionData,
  dropdownChangeHandler,
  layoutLoading,
  handleFormSave,
  changedValuesList,
  setChangedValuesList,
  originalListValues,
  errorMessage,
  leadSaving,
  labelData,
}: {
  leadMappingExcludedFieldNames: Set<string>;
  leadListItems: IConversionDropdownListType[];
  organizationList: IConversionDropdownListType[];
  contactList: IConversionDropdownListType[];
  dealList: IConversionDropdownListType[];
  leadConversionData: LeadConversionDataType;
  dropdownChangeHandler: (changedValue: string, values: FormikValues) => void;
  layoutLoading: boolean;
  handleFormSave: (values: FormikValues) => Promise<void>;
  changedValuesList: string[];
  setChangedValuesList: (value: string[]) => void;
  originalListValues: BaseGenericObjectType;
  errorMessage: string;
  leadSaving: boolean;
  labelData: IMappingLabels;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  });
  return (
    <Formik
      initialValues={{}}
      {...FormikFormProps}
      onSubmit={(values) => {
        handleFormSave(values);
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <>
          <GenericBackHeader
            heading={`${labelData.lead} Conversion Mapping`}
            addButtonInFlexCol={true}
          >
            <div className="grid grid-cols-6 sm:grid-cols-4 gap-x-4 mt-5 sm:mt-0 w-full sm:w-1/2 sm:max-w-xs">
              <div className="col-span-3 sm:col-span-2">
                <Button
                  id="clear-form"
                  onClick={() => {
                    changedValuesList.forEach((val) => {
                      setFieldValue(val, originalListValues[val]);
                    });
                    setChangedValuesList([]);
                    toast.success("Values reset");
                  }}
                  buttonType="thin"
                  kind="icon"
                  disabled={leadSaving}
                  userEventName="leadConversion-mapping-clear-click"
                >
                  {t("common:Clear")}
                </Button>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <Button
                  id="save-form"
                  onClick={() => {
                    handleSubmit();
                  }}
                  buttonType="thin"
                  kind="primary"
                  disabled={leadSaving}
                  userEventName="leadConversion-mapping-save:submit-click"
                >
                  {leadSaving ? <Loading color="White" /> : t("common:save")}
                </Button>
              </div>
            </div>
          </GenericBackHeader>
          <div ref={heightRef} className={`px-6 sm:pt-6 overflow-y-auto`}>
            <div className="px-6">
              <div className="mb-4">
                <p className="text-md mb-2 text-vryno-label-gray-secondary font-medium">
                  Field Mapping
                </p>
                <p className="text-xsm text-vryno-card-value">
                  Map the fields in the {labelData.lead} module to the fields in{" "}
                  {labelData.contact}, {labelData.deal} and{" "}
                  {labelData.organization} module. With the mapped fields,
                  converting a {labelData.lead} will automatically transfer the
                  information you have gathered to an {labelData.organization},{" "}
                  {labelData.contact} and {labelData.deal}.
                </p>
              </div>
              {errorMessage.length ? (
                <div className="mb-6">
                  <p className="text-sm text-vryno-danger">
                    Please select mandatory fields{" "}
                    <span className="font-semibold">{errorMessage}</span>
                  </p>
                </div>
              ) : (
                <></>
              )}
              {!layoutLoading && leadListItems.length ? (
                <div className="bg-white p-6 w-full rounded-xl shadow-sm flex flex-row">
                  <LeadConversionMappingList
                    leadMappingExcludedFieldNames={
                      leadMappingExcludedFieldNames
                    }
                    leadListItems={leadListItems}
                    organizationList={organizationList}
                    contactList={contactList}
                    dealList={dealList}
                    leadConversionData={leadConversionData}
                    dropdownChangeHandler={dropdownChangeHandler}
                    labelData={labelData}
                  />
                </div>
              ) : (
                <ItemsLoader currentView={"List"} loadingItemCount={2} />
              )}
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};
