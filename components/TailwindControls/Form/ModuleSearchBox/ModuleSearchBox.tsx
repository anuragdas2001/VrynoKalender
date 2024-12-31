import { useFormikContext } from "formik";
import React from "react";
import { IconInsideInputBox, IconLocation } from "../../IconInsideInputBox";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { BasicLookupType, ModuleSearchBoxProps } from "./ModuleSearchBoxProps";
import { ModuleSearchShowResultsBox } from "./ModuleSearchShowResultsBox";
import { handleDebounceSearch } from "../SearchBox/debounceHandler";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import ListUnorderedIcon from "remixicon-react/ListUnorderedIcon";
import { useRouter } from "next/router";
import { SupportedApps } from "../../../../models/shared";
import { AccountModels } from "../../../../models/Accounts";
import Button from "../Button/Button";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_MODULE_QUERY } from "../../../../graphql/queries/searchQuery";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import { capitalCase } from "change-case";

export const ModuleSearchBox = <T extends BasicLookupType>(
  {
    appName,
    modelName,
    searchBy,
    name,
    label,
    placeholder,
    required = false,
    disabled,
    allowMargin,
    labelLocation,
    autoFocus = true,
    modulesOption,
    editMode = false,
    hiddenDropdownLookup,
    hiddenSearchLookup,
    lookupRef,
    searchRef,
    inputHeight,
    inputWidth,
    searchResults,
    demoSearchResults,
    searchProcessing,
    isPanelBelowVisible,
    showModelNameInSearch,
    disableModuleSelector = false,
    disableSearchSelector = false,
    formResetted,
    setFormResetted = () => {},
    showViewAllScreen = true,
    formClosed,
    addUserModel,
    searchedValue,
    useModuleExpression = false,
    setFormClosed,
    setPanelBelowVisible,
    onBlur,
    onDropdownChange = () => {},
    onSearchChange = () => {},
    handleSearchChange,
    setSearchProcessing,
    setSearchResults,
    setDemoSearchResults,
    handleSelectedItem,
    setSelectedModule,
    setSearchedValue,
    closeSearchModal,
    setFilterSearchResults,
    filterSearchResults,
    setAppliedFilterModelName,
    appliedFilterModelName,
    searchFieldDataForFilter,
    setSearchFilterProcessing,
    searchFilterProcessing,
    allowFilters,
    generateLink,
    organizationName,
  }: ModuleSearchBoxProps<T>,
  ref: React.Ref<any>
) => {
  const { values, setFieldValue, setFieldTouched, handleChange, setTouched } =
    useFormikContext<Record<string, string>>();
  const router = useRouter();
  const paddingLeftClass = "pl-2";
  const paddingRightClass = "pr-12";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";
  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";

  const [showSearchFilter, setShowSearchFilter] = React.useState(false);
  const [viewAllFields, setViewAllFields] = React.useState(false);

  const showFilterElements =
    values?.["globalHiddenDropdownLookup"] !== "all" &&
    values?.["localHiddenDropdownLookup"] !== "all" &&
    demoSearchResults?.length;

  const [getModuleFilterSearchResults] = useLazyQuery(SEARCH_MODULE_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
  });

  React.useEffect(() => {
    if (searchFieldDataForFilter) {
      setShowSearchFilter(true);
      setSelectedModule("organization-filter");
    }
  }, [searchFieldDataForFilter]);

  React.useEffect(() => {
    if (showSearchFilter && searchFieldDataForFilter) {
      setSearchFilterProcessing(true);
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
    }
  }, [showSearchFilter]);

  const orgFilterDropdownOption = [
    {
      value: "organization-filter",
      label: `Contacts related to ${
        organizationName === null ? ".." : organizationName || "organization"
      }`,
      visible: true,
    },
    {
      value: modelName,
      label: `All ${capitalCase(modelName)}s`,
      visible: true,
    },
  ];

  return (
    <>
      <div
        ref={lookupRef}
        className={`flex flex-col ${allowMargin && "my-2"} w-full z-[1100]`}
        data-control-type="input-box"
      >
        {label && (
          <label
            htmlFor={hiddenSearchLookup}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses}`}
          >
            {label}
            <RequiredIndicator required={required} />
          </label>
        )}
        {/* Module selector and search input box (header) - start */}
        <div
          ref={searchRef}
          className={`w-full grid grid-cols-12 bg-white ${textBoxClasses}`}
        >
          <div className={`w-full relative focus:shadow-md text-sm col-span-4`}>
            {searchFieldDataForFilter ? (
              <select
                id={"search-reverse-lookup-selected-filter"}
                name={"search-reverse-lookup-selected-filter"}
                onChange={(selectedOption) => {
                  setFieldValue(
                    "search-reverse-lookup-selected-filter",
                    selectedOption?.currentTarget?.value
                  );
                  setSelectedModule(selectedOption?.currentTarget?.value);
                  setSearchResults([]);
                  setDemoSearchResults([]);
                  onDropdownChange(selectedOption, values[hiddenSearchLookup]);
                  setShowSearchFilter(false);
                  setFilterSearchResults(null);
                  setAppliedFilterModelName(null);
                  document.getElementById(hiddenSearchLookup)?.focus();
                }}
                onBlur={() =>
                  setFieldTouched("search-reverse-lookup-selected-filter")
                }
                // @ts-ignore
                placeholder={
                  values["search-reverse-lookup-selected-filter"] &&
                  orgFilterDropdownOption.length > 0
                    ? orgFilterDropdownOption?.filter(
                        (option) =>
                          option?.value ===
                          values["search-reverse-lookup-selected-filter"]
                      )[0]?.label
                    : placeholder
                }
                value={values["search-reverse-lookup-selected-filter"]}
                disabled={disabled}
                className={`form-select appearance-none bg-clip-padding bg-no-repeat relative pr-8 rounded-tl-md w-full text-sm placeholder-vryno-placeholder pb-2 pt-1.5 border focus:border-blue-300 ${paddingLeftClass} ${
                  searchFieldDataForFilter ? "text-xsm" : ""
                }`}
              >
                {!placeholder && (
                  <option value="" disabled hidden>
                    Please select
                  </option>
                )}
                {placeholder && (
                  <option value="" disabled hidden>
                    {placeholder}
                  </option>
                )}
                {orgFilterDropdownOption.map((opt, index) => (
                  <option
                    className={`w-full text-xsm ${
                      !editMode &&
                      typeof opt?.visible === "boolean" &&
                      !opt.visible
                        ? "hidden"
                        : editMode &&
                          typeof opt?.visible === "boolean" &&
                          !opt.visible &&
                          values[name] === opt.value
                        ? ""
                        : editMode &&
                          typeof opt?.visible === "boolean" &&
                          !opt.visible &&
                          values[name] !== opt.value
                        ? "hidden"
                        : ""
                    }`}
                    id={opt?.label}
                    key={index}
                    value={opt?.value ? opt?.value : undefined}
                    label={opt?.label}
                    disabled={typeof opt?.visible === "boolean" && !opt.visible}
                  >
                    {opt?.value}
                  </option>
                ))}
              </select>
            ) : (
              <select
                id={hiddenDropdownLookup}
                name={hiddenDropdownLookup}
                onChange={(selectedOption) => {
                  setFieldValue(
                    hiddenDropdownLookup,
                    selectedOption?.currentTarget?.value
                  );
                  setSelectedModule(selectedOption?.currentTarget?.value);
                  setSearchResults([]);
                  setDemoSearchResults([]);
                  onDropdownChange(selectedOption, values[hiddenSearchLookup]);
                  setShowSearchFilter(false);
                  setFilterSearchResults(null);
                  setAppliedFilterModelName(null);
                  document.getElementById(hiddenSearchLookup)?.focus();
                }}
                onBlur={() => setFieldTouched(hiddenDropdownLookup)}
                // @ts-ignore
                placeholder={
                  values[hiddenDropdownLookup] && modulesOption?.length > 0
                    ? modulesOption?.filter(
                        (option) =>
                          option?.value === values[hiddenDropdownLookup]
                      )[0]?.label
                    : placeholder
                }
                value={values[hiddenDropdownLookup]}
                disabled={disabled || disableModuleSelector}
                className={`form-select appearance-none bg-clip-padding bg-no-repeat relative pr-8 rounded-tl-md w-full text-sm placeholder-vryno-placeholder pb-2 pt-1.5 border focus:border-blue-300 ${paddingLeftClass}`}
              >
                {!placeholder && (
                  <option value="" disabled hidden>
                    Please select
                  </option>
                )}
                {placeholder && (
                  <option value="" disabled hidden>
                    {placeholder}
                  </option>
                )}
                {modulesOption.length > 0 &&
                  modulesOption.map((opt, index) => (
                    <option
                      className={`w-full text-xsm ${
                        !editMode &&
                        typeof opt?.visible === "boolean" &&
                        !opt.visible
                          ? "hidden"
                          : editMode &&
                            typeof opt?.visible === "boolean" &&
                            !opt.visible &&
                            values[name] === opt.value
                          ? ""
                          : editMode &&
                            typeof opt?.visible === "boolean" &&
                            !opt.visible &&
                            values[name] !== opt.value
                          ? "hidden"
                          : ""
                      }`}
                      id={opt?.label}
                      key={index}
                      value={opt?.value ? opt?.value : undefined}
                      label={opt?.label}
                      disabled={
                        typeof opt?.visible === "boolean" && !opt.visible
                      }
                    >
                      {opt?.value}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div
            className={`w-full relative focus:shadow-md text-sm bg-white col-span-8`}
          >
            <input
              id={hiddenSearchLookup}
              name={hiddenSearchLookup}
              onChange={(e) => {
                setFieldValue(hiddenSearchLookup, e.currentTarget.value);
                setSearchedValue(e.currentTarget.value);
                setSearchProcessing(true);
                setPanelBelowVisible(true);
                setDemoSearchResults([]);
                setSearchResults([]);
                handleDebounceSearch({
                  fieldName: hiddenSearchLookup,
                  handleOnDebounce: (value) =>
                    handleSearchChange(
                      value,
                      values[hiddenDropdownLookup] === "all"
                        ? ""
                        : values[hiddenDropdownLookup] ?? ""
                    ),
                });

                showSearchFilter && setShowSearchFilter(false);
                filterSearchResults && setFilterSearchResults(null);
                appliedFilterModelName && setAppliedFilterModelName(null);
              }}
              onBlur={() => {
                setFieldTouched(hiddenSearchLookup);
              }}
              value={searchedValue ?? ""}
              onFocus={() => setPanelBelowVisible(true)}
              autoFocus={
                !formClosed || values[hiddenSearchLookup] || searchedValue
                  ? true
                  : false
              }
              placeholder={placeholder ?? "Search anything"}
              disabled={disabled || disableSearchSelector}
              autoComplete="off"
              className={`relative w-full placeholder-vryno-placeholder focus:outline-none border focus:border-blue-300 text-gray-700 rounded-tr-md pb-2 pt-1.5 ${paddingRightClass} ${paddingLeftClass}`}
            />
            {values[hiddenSearchLookup] &&
              IconInsideInputBox(
                <Button
                  id="module-search-close"
                  onClick={(e) => {
                    setFieldValue(hiddenSearchLookup, null);
                    setSearchedValue("");
                    setSearchProcessing(true);
                    setPanelBelowVisible(true);
                    setDemoSearchResults([]);
                    setSearchResults([]);
                    setFormClosed(true);
                    handleSearchChange(
                      "",
                      values[hiddenDropdownLookup] === "all"
                        ? ""
                        : values[hiddenDropdownLookup] ?? ""
                    );
                  }}
                  customStyle=""
                  userEventName="search-close:action-click"
                >
                  <CloseLineIcon size={20} className="text-vryno-icon-gray" />
                </Button>,
                IconLocation.Right
              )}
          </div>
        </div>
        {/* Module selector and search input box (header) - end */}
        {/* Display search content - start */}
        <ModuleSearchShowResultsBox
          appName={appName}
          modelName={modelName}
          searchedValue={values[hiddenSearchLookup]}
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
          searchProcessing={searchProcessing}
          isPanelBelowVisible={isPanelBelowVisible}
          searchResults={searchResults}
          demoSearchResults={demoSearchResults}
          searchBy={searchBy}
          showModelNameInSearch={showModelNameInSearch}
          addUserModel={addUserModel}
          useModuleExpression={useModuleExpression}
          setPanelBelowVisible={(value) => {
            setPanelBelowVisible(value);
          }}
          handleSelectedItem={(item) => handleSelectedItem(item)}
          viewAllFields={viewAllFields}
          showSearchFilter={showSearchFilter}
          setFilterSearchResults={setFilterSearchResults}
          setAppliedFilterModelName={setAppliedFilterModelName}
          filterSearchResults={filterSearchResults}
          appliedFilterModelName={appliedFilterModelName}
          searchFieldDataForFilter={searchFieldDataForFilter}
          setSearchFilterProcessing={setSearchFilterProcessing}
          searchFilterProcessing={searchFilterProcessing}
          allowFilters={allowFilters}
          closeSearchModal={closeSearchModal}
          generateLink={generateLink}
        />
        {/* Display search content - end */}
      </div>
      <div
        className={`w-full h-full pt-4 flex items-center ${
          allowFilters && showFilterElements
            ? "justify-between"
            : "justify-center"
        } ${searchProcessing || modelName == "user" ? "hidden" : ""}`}
      >
        {allowFilters && showFilterElements ? (
          <div className="flex gap-x-4 text-xsm text-vryno-theme-light-blue">
            <Button
              id="search-view-show-filter"
              customStyle="cursor-pointer flex whitespace-nowrap items-center"
              onClick={(e) => {
                const updatedShowFilterValue = !showSearchFilter;
                setShowSearchFilter(updatedShowFilterValue);
                if (!updatedShowFilterValue) {
                  setFilterSearchResults(null);
                  setAppliedFilterModelName(null);
                }
              }}
              userEventName="dashboard-select-all-records:action-click"
              renderChildrenOnly={true}
            >
              <>
                <input
                  type="checkbox"
                  name="list_checkbox"
                  checked={showSearchFilter}
                  className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer mb-0.5"
                  style={{ width: "16px", height: "16px" }}
                />
                <span className="pl-2">Show Filter</span>
              </>
            </Button>
            <Button
              id="search-view-all-fields"
              customStyle="cursor-pointer flex whitespace-nowrap items-center"
              onClick={(e) => {
                setViewAllFields(!viewAllFields);
              }}
              userEventName="dashboard-select-all-records:action-click"
              renderChildrenOnly={true}
            >
              <>
                <input
                  type="checkbox"
                  name="view-all-fields"
                  checked={viewAllFields}
                  className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer mb-0.5"
                  style={{ width: "16px", height: "16px" }}
                />
                <span className="pl-2">View All Fields</span>
              </>
            </Button>
          </div>
        ) : (
          <></>
        )}
        <div
          className={`${
            searchResults.length > 0 || demoSearchResults.length > 0
              ? ""
              : "hidden"
          } ${showViewAllScreen ? "" : "hidden"} `}
        >
          <Button
            id="search-view-all-results"
            onClick={
              values[hiddenDropdownLookup] === "all"
                ? () => {
                    closeSearchModal(true);
                    router.push(
                      `/search/${appName ?? SupportedApps.crm}?text=${
                        values[hiddenSearchLookup] ?? ""
                      }`
                    );
                  }
                : values[hiddenDropdownLookup] === AccountModels.User
                ? () => {
                    closeSearchModal(true);
                    router.push(
                      `/settings/${appName ?? SupportedApps.crm}/users`
                    );
                  }
                : () => {
                    closeSearchModal(true);
                    router.push(
                      `/search/${appName ?? SupportedApps.crm}/${
                        values[hiddenDropdownLookup]
                      }?text=${values[hiddenSearchLookup] ?? ""}`
                    );
                  }
            }
            customStyle="cursor-pointer h-full flex items-center justify-center text-xsm gap-x-2 text-vryno-theme-light-blue"
            userEventName="search-viewAll-result-click"
            renderChildrenOnly={true}
          >
            <>
              <ListUnorderedIcon size={20} />
              View All Results
            </>
          </Button>
        </div>
      </div>
    </>
  );
};
