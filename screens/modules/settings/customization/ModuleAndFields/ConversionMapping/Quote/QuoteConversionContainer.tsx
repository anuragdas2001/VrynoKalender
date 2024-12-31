import React from "react";
import { toast } from "react-toastify";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { IConversionDropdownListType } from "../conversionTypes";
import { setHeight } from "../../../../../crm/shared/utils/setHeight";
import { QuoteConversionMappingList } from "./QuoteConversionMappingList";
import { BaseGenericObjectType } from "../../../../../../../models/shared";
import GenericBackHeader from "../../../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import { Loading } from "../../../../../../../components/TailwindControls/Loading/Loading";
import ItemsLoader from "../../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import {
  IQuoteMappingLabels,
  QuoteConversionDataType,
} from "./QuoteConversionMappingScreen";

export const QuoteConversionContainer = ({
  quoteMappingExcludedFieldNames,
  quoteListItems,
  salesOrderList,
  invoiceList,
  quoteConversionData,
  dropdownChangeHandler,
  layoutLoading,
  handleFormSave,
  changedValuesList,
  setChangedValuesList,
  originalListValues,
  errorMessage,
  quoteMappingSaving,
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
  layoutLoading: boolean;
  handleFormSave: (values: FormikValues) => Promise<void>;
  changedValuesList: string[];
  setChangedValuesList: (value: string[]) => void;
  originalListValues: BaseGenericObjectType;
  errorMessage: string;
  quoteMappingSaving: boolean;
  labelData: IQuoteMappingLabels;
  salesOrderViewPermission: boolean;
  invoiceViewPermission: boolean;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  });
  return (
    <Formik
      initialValues={{}}
      onSubmit={(values) => {
        handleFormSave(values);
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <>
          <GenericBackHeader
            heading={`${labelData.quote} Conversion Mapping`}
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
                  disabled={quoteMappingSaving}
                  userEventName="quoteConversion-mapping-clear-click"
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
                  disabled={quoteMappingSaving}
                  userEventName="quoteConversion-mapping-save:submit-click"
                >
                  {quoteMappingSaving ? (
                    <Loading color="White" />
                  ) : (
                    t("common:save")
                  )}
                </Button>
              </div>
            </div>
          </GenericBackHeader>
          <div ref={heightRef} className="px-6 sm:pt-6 overflow-y-auto">
            <div className="px-6">
              <div className="mb-4">
                <p className="text-md mb-2 text-vryno-label-gray-secondary font-medium">
                  Field Mapping
                </p>
                <p className="text-xsm text-vryno-card-value">
                  Map the fields in the {labelData.quote} module to the fields
                  in {salesOrderViewPermission && labelData.salesOrder}{" "}
                  {salesOrderViewPermission && invoiceViewPermission && "and"}{" "}
                  {invoiceViewPermission && labelData.invoice} module. With the
                  mapped fields, converting a {labelData.quote} will
                  automatically transfer the information you have gathered to an{" "}
                  {salesOrderViewPermission && labelData.salesOrder}{" "}
                  {salesOrderViewPermission && invoiceViewPermission && "and"}{" "}
                  {invoiceViewPermission && labelData.invoice}.
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
              {!layoutLoading && quoteListItems.length ? (
                <div className="bg-white p-6 w-full rounded-xl shadow-sm flex flex-row">
                  <QuoteConversionMappingList
                    quoteMappingExcludedFieldNames={
                      quoteMappingExcludedFieldNames
                    }
                    quoteListItems={quoteListItems}
                    salesOrderList={salesOrderList}
                    invoiceList={invoiceList}
                    quoteConversionData={quoteConversionData}
                    dropdownChangeHandler={dropdownChangeHandler}
                    labelData={labelData}
                    salesOrderViewPermission={salesOrderViewPermission}
                    invoiceViewPermission={invoiceViewPermission}
                  />
                </div>
              ) : (
                <ItemsLoader currentView="List" loadingItemCount={2} />
              )}
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};
