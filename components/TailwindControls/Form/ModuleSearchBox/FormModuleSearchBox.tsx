import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  SEARCH_MODULE_QUERY,
  SEARCH_QUERY,
} from "../../../../graphql/queries/searchQuery";
import { ModuleSearchBox } from "./ModuleSearchBox";
import { useFormikContext } from "formik";
import { useContainerDimensions } from "./useContainerDimension";
import { AccountModels } from "../../../../models/Accounts";
import { get } from "lodash";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";

const getSetSearchResultsFromResponse = (data: any[]) => {
  const updatedData: any[] = [];
  data?.forEach((resp: any) => {
    updatedData.push({
      ...resp,
      values: getDataObject({
        ...resp.values,
        id: resp.values?.id || resp.rowId,
      }),
    });
  });
  return updatedData;
};

export type FormModuleSearchBoxProps = {
  name: string;
  appName: string;
  modelName: string;
  searchBy: string[];
  disabled?: boolean;
  disableModuleSelector?: boolean;
  disableSearchSelector?: boolean;
  hiddenSearchLookup: string;
  hiddenDropdownLookup: string;
  modulesOption: { value: string; label: string; visible?: boolean }[];
  formClosed: boolean;
  formResetted?: boolean;
  showViewAllScreen?: boolean;
  addUserModel?: boolean;
  searchedValue?: string;
  useModuleExpression?: boolean;
  preSelectedValues?: string[];
  setFormClosed: (value: boolean) => void;
  setDisableSearchButton: (value: boolean) => void;
  setSearchedValue: (value: string) => void;
  setSelectedModule: (value: string) => void;
  setFormResetted?: (value: boolean) => void;
  handleItemSelect: (item: ISearchQuestData) => void;
  closeSearchModal: (value: boolean) => void;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  allowFilters: boolean;
  generateLink?: boolean;
  organizationName: string | null;
};

export const FormMultiSearchBox = ({
  name,
  appName,
  modelName,
  searchBy,
  modulesOption,
  disabled = false,
  disableModuleSelector = false,
  disableSearchSelector = false,
  hiddenSearchLookup,
  hiddenDropdownLookup,
  formClosed,
  formResetted,
  showViewAllScreen,
  addUserModel,
  searchedValue,
  useModuleExpression = false,
  preSelectedValues = [],
  setFormClosed,
  setDisableSearchButton,
  setSelectedModule,
  setSearchedValue,
  setFormResetted = () => {},
  handleItemSelect,
  closeSearchModal,
  searchFieldDataForFilter,
  allowFilters,
  generateLink,
  organizationName,
}: FormModuleSearchBoxProps) => {
  const { setFieldValue, values } = useFormikContext<Record<string, string>>();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const lookupRef = React.useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [filterSearchResults, setFilterSearchResults] =
    useState<Array<any> | null>(null);
  const [appliedFilterModelName, setAppliedFilterModelName] = useState<
    string | null
  >(null);
  const [demoSearchResults, setDemoSearchResults] = useState<Array<any>>([]);
  const [isPanelBelowVisible, setPanelBelowVisible] = useState(true);
  const [searchProcessing, setSearchProcessing] = useState<boolean>(true);
  const [lastSearchedValue, setLastSearchedValue] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<Array<any>>([]);
  const { width: inputWidth, height: inputHeight } = useContainerDimensions(
    searchRef,
    lookupRef
  );
  const [searchFilterProcessing, setSearchFilterProcessing] =
    React.useState(false);

  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onCompleted: (response) => {
      if (response?.quest?.data) {
        setSearchResults(getSetSearchResultsFromResponse(response.quest.data));
        setPanelBelowVisible(true);
      }
      setSearchProcessing(false);
    },
    onError: (error) => {
      setSearchProcessing(false);
    },
  });

  const [getDemoResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
  });

  const handleSearchChange = (
    searchedValue: string,
    moduleSelected: string
  ) => {
    setPanelBelowVisible(true);
    if (lastSearchedValue === searchedValue) {
      getSearchResults({
        variables: {
          serviceName:
            moduleSelected === AccountModels.User ? "accounts" : appName,
          modelName:
            moduleSelected === "all"
              ? ""
              : moduleSelected === "organization-filter"
              ? modelName
              : moduleSelected,
          text: searchedValue ?? "",
        },
      }).then((response) => {
        setSearchProcessing(false);
        setPanelBelowVisible(true);
        if (response?.data?.quest?.data) {
          setSearchResults(
            getSetSearchResultsFromResponse(response.data.quest.data)
          );
        }
      });
      return;
    }
    setSearchedValue(searchedValue);
    setLastSearchedValue(searchedValue);
    getSearchResults({
      variables: {
        serviceName:
          moduleSelected === AccountModels.User ? "accounts" : appName,
        modelName:
          moduleSelected === "all"
            ? ""
            : moduleSelected === "organization-filter"
            ? modelName
            : moduleSelected,
        text: searchedValue ?? "",
      },
    }).then((response) => {
      setSearchProcessing(false);
      setPanelBelowVisible(true);
      if (response?.data?.quest?.data) {
        const updatedData = getSetSearchResultsFromResponse(
          response.data.quest.data
        );
        setSearchResults(updatedData);
        setDemoSearchResults(updatedData);
      }
    });
    return;
  };

  const handleSelectedItem = (item: ISearchQuestData) => {
    setFieldValue(hiddenSearchLookup, "");
    setFieldValue(hiddenSearchLookup, undefined);
    setSelectedValues([item]);
    handleItemSelect(item);
    setFieldValue(name, item.rowId);
  };

  const [getModuleFilterSearchResults] = useLazyQuery(SEARCH_MODULE_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
  });

  const handleDropdownChange = (
    e: React.ChangeEvent<any>,
    searchedValue: string
  ) => {
    if (
      e.currentTarget.value === "organization-filter" &&
      searchFieldDataForFilter
    ) {
      setPanelBelowVisible(true);
      setSearchProcessing(true);
      getModuleFilterSearchResults({
        variables: {
          serviceName: modelName === AccountModels.User ? "accounts" : appName,
          modelName: modelName,
          text: "",
          filters: [
            {
              fieldName: searchFieldDataForFilter.fieldName,
              value: searchFieldDataForFilter.fieldId,
              exact: true,
            },
          ],
        },
      }).then((response) => {
        if (response?.data) {
          const updatedData = getSetSearchResultsFromResponse(
            response?.data?.quest?.data
          );

          setFilterSearchResults(updatedData);
          setSearchResults(updatedData);
          setDemoSearchResults(updatedData);
          setAppliedFilterModelName(modelName);
        }
        setSearchProcessing(false);
        return;
      });
    } else {
      setPanelBelowVisible(true);
      setSearchProcessing(true);
      getSearchResults({
        variables: {
          serviceName:
            e.currentTarget.value === AccountModels.User ? "accounts" : appName,
          modelName:
            e.currentTarget.value === "all" ? "" : e.currentTarget.value,
          text: searchedValue ?? "",
        },
      }).then((response) => {
        if (response?.data?.quest?.data) {
          const updatedData: any[] = getSetSearchResultsFromResponse(
            response.data.quest.data
          );

          setSearchResults(updatedData);
          setDemoSearchResults(updatedData);
          setSearchProcessing(false);
          return;
        }
        setSearchProcessing(false);
        return;
      });
    }
  };

  React.useEffect(() => {
    if (!formClosed || searchedValue) {
      setSearchProcessing(true);
      setPanelBelowVisible(true);
      setDisableSearchButton(true);
      if (searchedValue || values[name]) {
        handleSearchChange(searchedValue || values[name], modelName);
        setDisableSearchButton(false);
        return;
      }
      getDemoResults({
        variables: {
          serviceName: modelName === AccountModels.User ? "accounts" : appName,
          modelName: modelName,
          text: values[name] ?? searchedValue ?? "",
        },
      })
        .then((response) => {
          if (response?.data?.quest?.data) {
            const updatedData: any[] = [];
            response.data.quest.data?.forEach((resp: any) => {
              updatedData.push({
                ...resp,
                values: getDataObject(resp.values),
              });
            });
            setDemoSearchResults(updatedData);
            setSearchProcessing(false);
            setDisableSearchButton(false);
            return;
          }
          setSearchProcessing(false);
          setDisableSearchButton(false);
          return;
        })
        .catch((error) => setDisableSearchButton(false));
    }
  }, [formClosed, modelName, values[hiddenSearchLookup], searchedValue]);

  React.useEffect(() => {
    if (formClosed) {
      setDemoSearchResults([]);
      setSearchResults([]);
    }
  }, [formClosed]);

  return (
    <ModuleSearchBox
      name={name}
      appName={appName}
      modelName={modelName}
      searchBy={searchBy}
      searchedValue={searchedValue}
      modulesOption={modulesOption}
      disabled={disabled}
      formClosed={formClosed}
      disableModuleSelector={disableModuleSelector}
      disableSearchSelector={disableSearchSelector}
      hiddenDropdownLookup={hiddenDropdownLookup}
      hiddenSearchLookup={hiddenSearchLookup}
      lookupRef={lookupRef}
      searchRef={searchRef}
      searchProcessing={searchProcessing}
      searchResults={searchResults
        ?.filter(
          (result) =>
            ![...preSelectedValues].includes(
              get(result, "id", get(result, "rowId", ""))
            )
        )
        ?.filter((result) => {
          const findModuleIndex = modulesOption?.findIndex(
            (option) => option.value === result?.modelName
          );
          if (findModuleIndex !== -1) return result;
        })}
      demoSearchResults={demoSearchResults
        ?.filter(
          (result) =>
            ![...preSelectedValues].includes(
              get(result, "id", get(result, "rowId", ""))
            )
        )
        ?.filter((result) => {
          const findModuleIndex = modulesOption?.findIndex(
            (option) => option.value === result?.modelName
          );
          if (findModuleIndex !== -1) return result;
        })}
      filterSearchResults={
        filterSearchResults
          ?.filter(
            (result) =>
              ![...preSelectedValues].includes(
                get(result, "id", get(result, "rowId", ""))
              )
          )
          ?.filter((result) => {
            const findModuleIndex = modulesOption?.findIndex(
              (option) => option.value === result?.modelName
            );
            if (findModuleIndex !== -1) return result;
          }) || null
      }
      inputHeight={inputHeight}
      inputWidth={inputWidth}
      showModelNameInSearch={true}
      isPanelBelowVisible={isPanelBelowVisible}
      formResetted={formResetted}
      showViewAllScreen={showViewAllScreen}
      addUserModel={addUserModel}
      useModuleExpression={useModuleExpression}
      setFormClosed={setFormClosed}
      setSelectedModule={setSelectedModule}
      setSearchedValue={setSearchedValue}
      setFormResetted={(value) => setFormResetted(value)}
      setSearchResults={(value) => setSearchResults(value)}
      setDemoSearchResults={(value) => setDemoSearchResults(value)}
      setPanelBelowVisible={(value) => {
        setPanelBelowVisible(value);
      }}
      onDropdownChange={handleDropdownChange}
      handleSearchChange={handleSearchChange}
      setSearchProcessing={setSearchProcessing}
      handleSelectedItem={(item) => handleSelectedItem(item)}
      closeSearchModal={(value) => {
        closeSearchModal(value);
      }}
      setFilterSearchResults={setFilterSearchResults}
      setAppliedFilterModelName={setAppliedFilterModelName}
      appliedFilterModelName={appliedFilterModelName}
      searchFieldDataForFilter={searchFieldDataForFilter}
      setSearchFilterProcessing={setSearchFilterProcessing}
      searchFilterProcessing={searchFilterProcessing}
      allowFilters={allowFilters}
      generateLink={generateLink}
      organizationName={organizationName}
    />
  );
};
