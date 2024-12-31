import React from "react";
import Link from "next/link";
import { get } from "lodash";
import { Loading } from "../../Loading/Loading";
import {
  IModuleSearchDataResultContainerPerFetchContent,
  userFieldsList,
} from "./ModuleSearchBoxProps";
import { AccountModels } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";
import { GetSearchedResultHighlighted } from "./GetSearchedResultHighlighted";
import Pagination from "../../../../screens/modules/crm/shared/components/Pagination";
import {
  getSearchedValue,
  getSearchedValueKeyOtherThanSearchByOptions,
} from "./moduleSearchDataHandler";
import { GetAllMandatoryKeyValuesOtherThanSearchByOptions } from "./GetAllFieldMandatoryKeyValuesOtherThanSearchByOptions";
import { SupportedApps, SupportedView } from "../../../../models/shared";
import { GetAllMandatoryKeyValuesOtherThanSearchByOptionsAndShowInTable } from "./GetAllMandatoryKeyValuesOtherThanSearchByOptionsAndShowInTable";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";
import { paramCase } from "change-case";

export const ModuleSearchDataResultContainerPerFetchContent = ({
  appName = "",
  fieldsListFetchLoading,
  modulesFetchLoading,
  smallResolution,
  searchResultCount,
  searchResults,
  currentPageNumber,
  onPageChange,
  showMoreData,
  searchedValue,
  currentSelectedSearch,
  handleSelectedItem,
  setPanelBelowVisible,
  highlightedResultInFlexCol,
  useModuleExpression,
  updatedSearchBy,
  searchBy,
  fieldsListPerModule,
  setFieldsList,
  viewAllFields,
  showSearchFilter,
  setFilterSearchResults,
  setAppliedFilterModelName,
  searchFieldDataForFilter,
  setSearchFilterProcessing,
  searchFilterProcessing,
  allowFilters,
  closeSearchModal,
  formikValues,
  generateLink,
}: IModuleSearchDataResultContainerPerFetchContent) => {
  React.useEffect(() => {
    if (
      currentSelectedSearch &&
      Object.keys(currentSelectedSearch)?.length > 0 &&
      fieldsListPerModule &&
      Object.keys(fieldsListPerModule)?.length > 0
    ) {
      setFieldsList(
        currentSelectedSearch?.modelName ?? "",
        get(fieldsListPerModule, currentSelectedSearch?.modelName, [])
      );
    }
  }, [currentSelectedSearch, fieldsListPerModule]);

  if (fieldsListFetchLoading && modulesFetchLoading) {
    return (
      <>
        <div
          className={`w-full py-[4px] px-2 text-xs bg-vryno-dropdown-hover flex`}
        >
          <span className="text-vryno-theme-blue text-xs font-medium flex items-center justify-center">
            Results
          </span>
        </div>
        <div className={`w-full h-full flex items-center justify-center py-2`}>
          <PageLoader scale={1} />
        </div>
      </>
    );
  } else if (
    allowFilters &&
    formikValues?.["globalHiddenDropdownLookup"] !== "all" &&
    formikValues?.["localHiddenDropdownLookup"] !== "all"
  ) {
    return (
      <GetAllMandatoryKeyValuesOtherThanSearchByOptionsAndShowInTable
        searchResults={searchResults}
        fieldsList={get(
          fieldsListPerModule,
          searchResults?.[0].modelName,
          []
        ).map((field: ICustomField) => {
          return {
            ...field,
            name: field.systemDefined
              ? field.uniqueName.split(".")[2]
              : field.uniqueName,
          };
        })}
        unmodifiedFieldsList={get(
          fieldsListPerModule,
          searchResults?.[0].modelName,
          []
        )}
        modelName={searchResults?.[0].modelName}
        viewAllFields={viewAllFields}
        showSearchFilter={showSearchFilter}
        appName={appName}
        setFilterSearchResults={setFilterSearchResults}
        setAppliedFilterModelName={setAppliedFilterModelName}
        searchFieldDataForFilter={searchFieldDataForFilter}
        setSearchFilterProcessing={setSearchFilterProcessing}
        searchFilterProcessing={searchFilterProcessing}
        closeSearchModal={closeSearchModal}
        handleSelectedItem={handleSelectedItem}
        setPanelBelowVisible={setPanelBelowVisible}
        generateLink={generateLink}
      />
    );
  } else
    return (
      <>
        <div
          className={`w-full py-[4px] px-2 text-xs bg-vryno-dropdown-hover flex`}
        >
          <span className="text-vryno-theme-blue text-xs font-medium flex items-center justify-center">
            Results
          </span>
          {smallResolution && (
            <Pagination
              itemsCount={searchResultCount ?? 0}
              currentPageItemCount={searchResults?.length}
              pageSize={50}
              onPageChange={(pageNumber) => {
                onPageChange(pageNumber);
              }}
              currentPageNumber={currentPageNumber ?? 1}
            />
          )}
        </div>
        {searchResults.map((searchResult, searchResultIndex) => (
          <Link
            href={
              searchResult.modelName === AccountModels.User
                ? `/settings/${appName ?? SupportedApps.crm}/users/edit/${
                    searchResult.rowId
                  }`
                : `${appName ?? SupportedApps.crm}/${searchResult.modelName}/${
                    SupportedView.Detail
                  }/${searchResult.rowId}`
            }
            key={searchResultIndex}
            legacyBehavior
          >
            <a
              id={`search-${searchResult.modelName}-${searchResult.rowId}`}
              className={`w-full flex flex-col ${
                smallResolution && showMoreData ? "py-3.5" : "py-2"
              } ${
                currentSelectedSearch === searchResult
                  ? "bg-vryno-theme-highlighter-blue hover:bg-white"
                  : "bg-white hover:bg-vryno-dropdown-hover"
              } px-2 text-xs bg-white hover:bg-vryno-dropdown-hover cursor-pointer border-b-0.5 focus:outline-blue-300`}
              style={{ borderColor: "#DEE5EE" }}
              onClick={(e) => {
                e.preventDefault();
                handleSelectedItem(searchResult);
                setPanelBelowVisible(false);
              }}
            >
              <div
                className={`flex text-xsm w-full pb-1 ${
                  highlightedResultInFlexCol ? "flex-col" : ""
                }`}
              >
                <div className={`flex gap-x-1`}>
                  {searchedValue === "" &&
                  searchResult.modelName === AccountModels.User
                    ? ["first_name", "last_name"].map((item, index) => (
                        <span
                          data-testId={getSearchedValue(searchResult, item)}
                          key={index}
                          className="font-medium"
                        >
                          <GetSearchedResultHighlighted
                            searchResult={searchResult}
                            item={item}
                            searchedValue={searchedValue}
                          />
                        </span>
                      ))
                    : searchedValue === ""
                    ? (useModuleExpression
                        ? get(updatedSearchBy, searchResult.modelName, [])
                        : searchBy
                      ).map((item, index) => (
                        <span
                          data-testId={getSearchedValue(searchResult, item)}
                          key={index}
                          className="font-medium"
                        >
                          <GetSearchedResultHighlighted
                            searchResult={searchResult}
                            item={item}
                            searchedValue={searchedValue}
                          />
                        </span>
                      ))
                    : !smallResolution &&
                      searchResult.modelName === AccountModels.User
                    ? ["first_name", "last_name"].map((item, index) => (
                        <span
                          data-testId={getSearchedValue(searchResult, item)}
                          key={index}
                          className="font-medium"
                        >
                          <GetSearchedResultHighlighted
                            searchResult={searchResult}
                            item={item}
                            searchedValue={searchedValue}
                          />
                        </span>
                      ))
                    : !smallResolution &&
                      (useModuleExpression
                        ? get(updatedSearchBy, searchResult.modelName, [])
                        : searchBy
                      ).map((item, index) => (
                        <span
                          data-testId={getSearchedValue(searchResult, item)}
                          key={index}
                          className="font-medium"
                        >
                          <GetSearchedResultHighlighted
                            searchResult={searchResult}
                            item={item}
                            searchedValue={searchedValue}
                          />
                        </span>
                      ))}
                </div>
                {searchedValue && (
                  <span className="flex text-moreInfoHeading text-vryno-slate-color items-center">
                    <span
                      className={`text-moreInfoHeading ${
                        smallResolution ? "hidden" : ""
                      }`}
                    >
                      {getSearchedValueKeyOtherThanSearchByOptions(
                        searchResult,
                        searchedValue,
                        useModuleExpression
                          ? get(updatedSearchBy, searchResult.modelName, [])
                          : searchBy,
                        searchResult.modelName === AccountModels.User
                          ? userFieldsList
                          : get(
                              fieldsListPerModule,
                              searchResult.modelName,
                              []
                            ).map((field: ICustomField) => {
                              return {
                                ...field,
                                name: field.systemDefined
                                  ? field.uniqueName.split(".")[2]
                                  : field.uniqueName,
                              };
                            })
                      )}
                    </span>
                    <span
                      className={`text-moreInfoHeading text-black ${
                        smallResolution ? "font-medium" : ""
                      }`}
                    >
                      <GetSearchedResultHighlighted
                        searchResult={searchResult}
                        item={""}
                        searchedValue={searchedValue}
                        fieldsList={
                          searchResult.modelName === AccountModels.User
                            ? userFieldsList
                            : get(
                                fieldsListPerModule,
                                searchResult.modelName,
                                []
                              ).map((field: ICustomField) => {
                                return {
                                  ...field,
                                  name: field.systemDefined
                                    ? field.uniqueName.split(".")[2]
                                    : field.uniqueName,
                                };
                              })
                        }
                        searchBy={
                          useModuleExpression
                            ? get(updatedSearchBy, searchResult.modelName, [])
                            : searchBy
                        }
                      />
                    </span>
                    <pre>{`, `}</pre>
                  </span>
                )}
              </div>
              <span className="flex text-moreInfoHeading text-vryno-slate-color items-center ">
                <GetAllMandatoryKeyValuesOtherThanSearchByOptions
                  searchResult={searchResult}
                  fieldsList={
                    searchResult.modelName === AccountModels.User
                      ? userFieldsList
                      : get(
                          fieldsListPerModule,
                          searchResult.modelName,
                          []
                        ).map((field: ICustomField) => {
                          return {
                            ...field,
                            name: field.systemDefined
                              ? field.uniqueName.split(".")[2]
                              : field.uniqueName,
                          };
                        })
                  }
                  modelName={searchResult.modelName}
                  showMoreData={showMoreData}
                  smallResolution={smallResolution}
                  displayType={"inline-block"}
                />
              </span>
            </a>
          </Link>
        ))}
      </>
    );
};
