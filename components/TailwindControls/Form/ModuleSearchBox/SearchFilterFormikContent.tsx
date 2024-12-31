import { get } from "lodash";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../../models/ICustomField";
import { snakeCase } from "change-case";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { FormFieldPerDataType } from "../../../../screens/modules/crm/shared/components/Form/FormFieldPerDataType";
import { FormikValues, useFormikContext } from "formik";
import GenericList, { GenericListHeaderType } from "../../Lists/GenericList";
import Button from "../Button/Button";
import { appsUrlGenerator } from "../../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { SupportedApps } from "../../../../models/shared";
import { AllowedViews } from "../../../../models/allowedViews";
import { Loading } from "../../Loading/Loading";
import React from "react";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";

export const SearchFilterFormikContent = ({
  searchResults,
  filteredFieldsList,
  dataTableHeaders,
  modelName,
  viewAllFields,
  showSearchFilter,
  searchFilterProcessing,
  closeSearchModal,
  dataTestIdDict,
  handleSelectedItem,
  setPanelBelowVisible,
  generateLink,
  disableOrganizationId,
  setFilterSearchResults,
  dataFieldsList,
}: {
  searchResults: ISearchQuestData[];
  filteredFieldsList: ICustomField[];
  dataTableHeaders: GenericListHeaderType[] | undefined;
  modelName: string;
  viewAllFields: boolean;
  showSearchFilter: boolean;
  searchFilterProcessing: boolean;
  closeSearchModal?: (value: boolean) => void;
  dataTestIdDict: Record<string, string>;
  handleSelectedItem: (value: ISearchQuestData) => void;
  setPanelBelowVisible: (value: boolean) => void;
  generateLink?: boolean;
  disableOrganizationId: boolean;
  setFilterSearchResults: React.Dispatch<React.SetStateAction<any[] | null>>;
  dataFieldsList: ICustomField[] | undefined;
}) => {
  const filterRef = React.useRef<HTMLDivElement>(null);
  const { values, setFieldValue, handleSubmit, resetForm } =
    useFormikContext<FormikValues>();

  const filterTableHeaders = filteredFieldsList?.map((field) => {
    return {
      columnName: `filter-${snakeCase(field?.name || "")}`,
      label: get(field?.label, "en"),
      dataType: field.dataType as FieldSupportedDataType,
      field: field,
      systemDefined: field.systemDefined,
      render: (record: any, index: number) => {
        return (
          <div className="text-gray-400">
            <FormFieldPerDataType
              field={field}
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={modelName}
              editMode={true}
              values={values}
              countryCodeInUserPreference={""}
              disabled={
                field.name === "organization_id" && disableOrganizationId
                  ? true
                  : false
              }
              showLabel={false}
              allowMargin={false}
              disableGlobalSearchIcon={true}
              dataTestId={dataTestIdDict[field.name]}
              hideValidationMessages={true}
              disableAutoSelectOfSystemDefinedValues={true}
            />
          </div>
        );
      },
    };
  });

  const data = searchResults
    ?.map((searchResult) => {
      if (Object.keys(searchResult?.values || {})?.length) {
        return searchResult?.values;
      }
      return null;
    })
    .filter((val) => val != null);

  const [topShift, setTopShift] = React.useState(100);
  const [containerWidthStyle, setContainerWidthStyle] =
    React.useState("w-auto");

  React.useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setTopShift(entry.contentRect.height + 9);
      });
    });
    if (filterRef.current) {
      observer.observe(filterRef.current);
      if (filterRef?.current?.clientWidth < 900) {
        setContainerWidthStyle("w-full");
      }
    }
    return () => {
      if (filterRef.current) {
        observer.unobserve(filterRef.current);
      }
    };
  }, [filterRef]);

  const handleClear = () => {
    resetForm();
    setFilterSearchResults([]);
  };

  return (
    <div className={`w-full h-full relative`}>
      <div
        className={`top-11 h-auto absolute border-b w-auto ${
          viewAllFields ? "w-auto" : containerWidthStyle
        } ${showSearchFilter ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        ref={filterRef}
      >
        <GenericList
          tableHeaders={filterTableHeaders ?? []}
          fieldsList={filteredFieldsList}
          data={[{}]}
          onDetail={false}
          showIcons={false}
          listSelector={false}
          oldGenericListUI={true}
          hideHeader={true}
          columnFixedWidth={"w-[298px]"}
          showBGColor={true}
          applyBottomBorderBetweenRows={false}
          includeFlagInPhoneNumber={true}
        />
        <div className="flex flex-row gap-x-4 justify-start items-start px-7 pb-1 w-full">
          <Button
            id={`apply-search-filter`}
            onClick={() => handleSubmit()}
            customStyle=""
            userEventName="action-edit:action-click"
            disabled={searchFilterProcessing}
          >
            <span
              className={`text-xsm text-vryno-theme-light-blue ${
                searchFilterProcessing ? "opacity-50" : ""
              }`}
            >
              Apply
            </span>
          </Button>
          <Button
            id={`clear-search-filter`}
            onClick={() => handleClear()}
            customStyle=""
            userEventName="action-delete:action-click"
            disabled={searchFilterProcessing}
          >
            <span
              className={`text-xsm text-vryno-theme-light-blue ${
                searchFilterProcessing ? "opacity-50" : ""
              }`}
            >
              Clear
            </span>
          </Button>
        </div>
      </div>
      <div className="w-full h-full">
        {generateLink ? (
          <GenericList
            tableHeaders={dataTableHeaders ?? []}
            fieldsList={searchFilterProcessing ? [] : dataFieldsList}
            data={searchFilterProcessing ? [] : data?.length ? data : []}
            onDetail={false}
            showIcons={false}
            listSelector={false}
            oldGenericListUI={true}
            columnFixedWidth={
              modelName === "user"
                ? "w-auto"
                : data?.length
                ? "w-[250px]"
                : "w-[252px]"
            }
            shiftTableBodyBy={showSearchFilter ? `${topShift}` : ""}
            rowUrlGenerator={(record) => {
              return appsUrlGenerator(
                SupportedApps.crm,
                modelName,
                AllowedViews.detail,
                record.id
              );
            }}
            handleRowClick={(record) => {
              const searchedRecord = searchResults.find(
                (searchRecord) => searchRecord.rowId === record.id
              );
              handleSelectedItem(searchedRecord ?? record);
              setPanelBelowVisible(false);
            }}
            renderHeaderIfNoData={true}
            showNoDataMessage={true}
          />
        ) : (
          <GenericList
            tableHeaders={dataTableHeaders ?? []}
            fieldsList={searchFilterProcessing ? [] : dataFieldsList}
            data={searchFilterProcessing ? [] : data?.length ? data : []}
            onDetail={false}
            showIcons={false}
            listSelector={false}
            oldGenericListUI={true}
            columnFixedWidth={
              modelName === "user"
                ? "w-auto"
                : data?.length
                ? "w-[250px]"
                : "w-[252px]"
            }
            shiftTableBodyBy={showSearchFilter ? `${topShift}` : ""}
            handleRowClick={(record) => {
              const searchedRecord = searchResults.find(
                (searchRecord) => searchRecord.rowId === record.id
              );
              handleSelectedItem(searchedRecord ?? record);
              setPanelBelowVisible(false);
            }}
            renderHeaderIfNoData={true}
            showNoDataMessage={true}
          />
        )}
        {searchFilterProcessing ? (
          <div
            className={`w-full h-full py-2 flex items-center justify-center bg-white ${
              showSearchFilter ? "pt-40" : "pt-32"
            }`}
          >
            <PageLoader scale={1} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
