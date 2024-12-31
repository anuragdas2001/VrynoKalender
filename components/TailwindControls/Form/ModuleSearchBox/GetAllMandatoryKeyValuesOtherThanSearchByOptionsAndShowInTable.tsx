import {
  FieldSupportedDataType,
  ICustomField,
  SupportedDataTypes,
} from "../../../../models/ICustomField";
import { Formik, FormikValues, useFormikContext } from "formik";
import { useLazyQuery } from "@apollo/client";
import {
  ISearchFilter,
  SEARCH_MODULE_QUERY,
} from "../../../../graphql/queries/searchQuery";
import { SearchFilterFormikContent } from "./SearchFilterFormikContent";
import { AccountModels } from "../../../../models/Accounts";
import { camelCase, paramCase, snakeCase } from "change-case";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import React from "react";
import { GenericListHeaderType } from "../../Lists/GenericList";
import { get } from "lodash";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";

export const GetAllMandatoryKeyValuesOtherThanSearchByOptionsAndShowInTable = ({
  searchResults,
  fieldsList,
  unmodifiedFieldsList,
  modelName,
  viewAllFields,
  showSearchFilter,
  appName,
  setFilterSearchResults,
  setAppliedFilterModelName,
  searchFieldDataForFilter,
  setSearchFilterProcessing,
  searchFilterProcessing,
  closeSearchModal,
  handleSelectedItem,
  setPanelBelowVisible,
  generateLink,
}: {
  searchResults: ISearchQuestData[];
  fieldsList?: ICustomField[];
  unmodifiedFieldsList?: ICustomField[];
  modelName: string;
  viewAllFields: boolean;
  showSearchFilter: boolean;
  appName: string;
  setFilterSearchResults: React.Dispatch<React.SetStateAction<any[] | null>>;
  setAppliedFilterModelName: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  setSearchFilterProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  searchFilterProcessing: boolean;
  closeSearchModal?: (value: boolean) => void;
  handleSelectedItem: (value: ISearchQuestData) => void;
  setPanelBelowVisible: (value: boolean) => void;
  generateLink?: boolean;
}) => {
  const { values } = useFormikContext<FormikValues>();
  const [dataTestIdDict, setDataTestIdDict] = React.useState<
    Record<string, string>
  >({});

  const [filteredFieldsList, setFilteredFieldsList] = React.useState<
    ICustomField[] | undefined
  >();
  const [dataFieldsList, setDataFieldsList] = React.useState<
    ICustomField[] | undefined
  >();
  const [dataTableHeaders, setTableHeaders] = React.useState<
    GenericListHeaderType[] | undefined
  >([]);

  const [getModuleFilterSearchResults] = useLazyQuery(SEARCH_MODULE_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
  });

  const handleFilterOnSubmit = (values: ISearchFilter[]) => {
    setSearchFilterProcessing(true);
    getModuleFilterSearchResults({
      variables: {
        serviceName: modelName === AccountModels.User ? "accounts" : appName,
        modelName: modelName,
        text: "",
        filters: values,
      },
    }).then((response) => {
      if (response?.data) {
        const data = response?.data?.quest?.data;
        const updatedData: any[] = [];
        data?.forEach((resp: any) => {
          updatedData.push({
            ...resp,
            values: getDataObject(resp.values),
          });
        });
        setFilterSearchResults(updatedData);
        setAppliedFilterModelName(modelName);
      }
      setSearchFilterProcessing(false);
    });
  };

  React.useEffect(() => {
    if (unmodifiedFieldsList?.length) {
      const dict: Record<string, string> = {};
      unmodifiedFieldsList?.forEach((field) => {
        dict[
          field.systemDefined
            ? field.uniqueName.split(".")[2]
            : field.uniqueName
        ] = field.name;
      });
      setDataTestIdDict(dict);
    }
  }, []);

  React.useEffect(() => {
    const filteredFields = viewAllFields
      ? fieldsList?.filter(
          (field) =>
            !["recordImage", "image", "relatedTo", "richText", "json"].includes(
              field.dataType
            ) && !["record_status", "layout_id"].includes(field.name)
        )
      : fieldsList?.filter(
          (field) =>
            field.visible &&
            field.mandatory &&
            !["recordImage", "image", "relatedTo", "richText", "json"].includes(
              field.dataType
            ) &&
            !["record_status", "layout_id"].includes(field.name)
        );
    const dataFields = filteredFields?.map((field) => {
      if (field.dataType === "datetime") {
        return { ...field, dataType: "date" };
      }
      return field;
    });
    setDataFieldsList(filteredFields);
    setFilteredFieldsList(dataFields as ICustomField[]);
    if (modelName === "user") {
      setTableHeaders([
        {
          columnName: "first_name",
          label: "First Name",
          dataType: SupportedDataTypes.singleline,
          systemDefined: true,
        },
        {
          columnName: "last_name",
          label: "Last Name",
          dataType: SupportedDataTypes.singleline,
          systemDefined: true,
        },
        {
          columnName: "email",
          label: "Email",
          dataType: SupportedDataTypes.email,
          systemDefined: true,
        },
        {
          columnName: "phone_number",
          label: "Phone Number",
          dataType: SupportedDataTypes.phoneNumber,
          systemDefined: true,
        },
      ]);
      return;
    }
    setTableHeaders(
      filteredFields?.map((field) => {
        return {
          columnName: snakeCase(field["name"]),
          label: get(field["label"], "en"),
          dataType: field.dataType as FieldSupportedDataType,
          field: field,
          systemDefined: field.systemDefined,
        };
      })
    );
  }, [viewAllFields, fieldsList]);

  const [disableOrganizationId, setDisableOrganizationId] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (values["search-reverse-lookup-selected-filter"]) {
      setDisableOrganizationId(
        values["search-reverse-lookup-selected-filter"] ===
          "organization-filter" && searchFieldDataForFilter
          ? true
          : false
      );
    }
  }, [values["search-reverse-lookup-selected-filter"]]);

  return filteredFieldsList?.length && dataTableHeaders?.length ? (
    <Formik
      initialValues={
        values["search-reverse-lookup-selected-filter"] ===
          "organization-filter" && searchFieldDataForFilter
          ? {
              [snakeCase(searchFieldDataForFilter.fieldName)]:
                searchFieldDataForFilter.fieldId,
            }
          : {}
      }
      onSubmit={(values: FormikValues) => {
        const requestValueArray: ISearchFilter[] = [];
        fieldsList?.forEach((field) => {
          if (
            values[field.name] ||
            (field.dataType === "number" && values[field.name] >= 0)
          ) {
            const fieldName = field.systemDefined
              ? camelCase(field.name)
              : `fields.${field.name}`;
            requestValueArray.push({
              fieldName: fieldName,
              value:
                field.dataType === "number"
                  ? [values[field.name]]
                  : field.dataType === "phoneNumber"
                  ? values[field.name]?.replace(/[\s\-]+/g, "")
                  : values[field.name],
              exact: false,
            });
          }
        });
        console.log("requestValueArray", requestValueArray);
        if (Object.keys(requestValueArray)?.length > 0)
          handleFilterOnSubmit(requestValueArray);
      }}
    >
      {() => (
        <SearchFilterFormikContent
          searchResults={searchResults}
          filteredFieldsList={filteredFieldsList}
          dataTableHeaders={dataTableHeaders}
          modelName={modelName}
          viewAllFields={viewAllFields}
          showSearchFilter={showSearchFilter}
          searchFilterProcessing={searchFilterProcessing}
          closeSearchModal={closeSearchModal}
          dataTestIdDict={dataTestIdDict}
          handleSelectedItem={handleSelectedItem}
          setPanelBelowVisible={setPanelBelowVisible}
          generateLink={generateLink}
          disableOrganizationId={disableOrganizationId}
          setFilterSearchResults={setFilterSearchResults}
          dataFieldsList={dataFieldsList}
        />
      )}
    </Formik>
  ) : (
    <div className={`w-full h-full flex items-center justify-center py-2`}>
      <PageLoader scale={1} />
    </div>
  );
};
