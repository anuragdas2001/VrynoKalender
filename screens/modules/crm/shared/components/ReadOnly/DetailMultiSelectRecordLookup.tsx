import Link from "next/link";
import React, { useState } from "react";
import { OperationVariables, QueryResult, useLazyQuery } from "@apollo/client";
import { getAppPathParts } from "../../utils/getAppPathParts";
import { appsUrlGenerator } from "../../utils/appsUrlGenerator";
import { AccountModels } from "../../../../../../models/Accounts";
import { getNamesOnlyFromField } from "../../utils/getFieldsArray";
import { checkIfValidUUID } from "../../utils/getSettingsPathParts";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { recordLookupSearchResultDataExtractor } from "./recordLookupHelper";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { RecordLookupNoFieldDataComponent } from "./RecordLookupNoFieldDataComponent";
import PermissionModal, {
  NoDataForFieldPermissionModal,
  NoPermissionComponent,
} from "../../../../../../components/TailwindControls/Modals/PermissionModal";
import { range } from "lodash";
import { getBreakWordCSS } from "./getBreakWordCSS";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";
import { SupportedApps } from "../../../../../../models/shared";

export type DetailMultiSelectRecordLookupProps = {
  appName: SupportedApps;
  searchBy: Array<string>;
  fieldDisplayExpression: string[];
  value: string[];
  modelName: string;
  fontSize: string;
  truncatedData: boolean;
  fieldDetail?: ICustomField;
  fontColor?: string;
  data?: Record<string, string>;
  includeBaseUrl?: boolean;
  displayType?: string;
  viewType?: "Card" | "List";
  showFieldEditInput?: boolean;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  fixedWidth?: string;
};

export const DetailMultiSelectRecordLookup = ({
  appName,
  searchBy,
  fieldDisplayExpression,
  value,
  modelName,
  fontSize,
  truncatedData,
  fieldDetail,
  fontColor = "text-vryno-card-value",
  data,
  includeBaseUrl = false,
  displayType,
  viewType = "Card",
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
}: DetailMultiSelectRecordLookupProps) => {
  const userModel = AccountModels.User;
  const { modelName: urlModelName } = getAppPathParts();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsLoading, setSearchResultsLoading] =
    useState<boolean>(true);
  const [searchDataFound, setSearchDataFound] = React.useState<
    "permission" | "noData" | null
  >(null);
  const [editInputDetails, setEditInputDetails] =
    React.useState<IEditInputDetails>({
      visible: false,
      fieldData: null,
      id: undefined,
    });

  const [getSearchedResults] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "standby",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const handleSearchedResults = (responseData: Record<string, any>[]) => {
    const updatedData = [];
    for (const data of responseData) {
      updatedData.push(
        recordLookupSearchResultDataExtractor(
          fieldDisplayExpression,
          searchBy,
          data
        )
      );
    }
    setSearchResults(updatedData);
    setSearchResultsLoading(false);
  };

  const handlePromisedResult = (
    response: QueryResult<any, OperationVariables>[]
  ) => {
    let resultArray: any[] = [];
    if (response?.length) {
      response.forEach((result) => {
        if (result?.data?.fetch?.messageKey.includes("success")) {
          resultArray = [...resultArray, ...result?.data?.fetch?.data];
        } else {
          if (
            !result?.data?.fetch?.messageKey.includes("success") &&
            !result?.data?.fetch?.data?.length
          ) {
            setSearchDataFound("noData");
          }
          if (result?.data?.fetch?.messageKey.includes("requires-view")) {
            setSearchDataFound("permission");
          }
        }
      });
      if (resultArray.length) {
        handleSearchedResults(resultArray);
      } else {
        setSearchResults([]);
        setSearchResultsLoading(false);
      }
    } else {
      setSearchResults([]);
      setSearchResultsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!appName) return;
    if (modelName && searchBy && value) {
      const pageCount = value.length / 50;
      setSearchResultsLoading(true);
      if (modelName === userModel) {
        const fetchPromise = range(1, pageCount + 1)?.map(
          async (pageNumber: number) => {
            const response = await getSearchedResults({
              variables: {
                modelName: userModel,
                fields: ["firstName", "lastName", "middleName", "id"],
                filters: [
                  { operator: "in", name: "id", value: value },
                  {
                    operator: "in",
                    name: "recordStatus",
                    value: ["a", "i"],
                  },
                ],
                pageNumber: pageNumber,
              },
            });

            return response;
          }
        );
        Promise.all(fetchPromise).then((response) => {
          handlePromisedResult(response);
        });
        return;
      }
      const fetchPromise = range(1, pageCount + 1)?.map(
        async (pageNumber: number) => {
          const response = await getSearchedResults({
            variables: {
              modelName: modelName,
              fields: [...searchBy, "id"],
              filters: [
                { operator: "in", name: "id", value: value },
                {
                  operator: "in",
                  name: "recordStatus",
                  value: ["a", "i"],
                },
              ],
              pageNumber: pageNumber,
            },
          });

          return response;
        }
      );
      Promise.all(fetchPromise).then((response) => {
        handlePromisedResult(response);
      });
    } else {
      setSearchResults([]);
      setSearchResultsLoading(false);
    }
  }, [modelName, searchBy, value, appName]);

  const renderFieldData = (searchResult: Record<string, string>) => {
    const updatedSearchBy = getNamesOnlyFromField(searchBy);
    if (modelName === userModel && value) {
      if (
        !searchResult["firstName"] &&
        !searchResult["middleName"] &&
        !searchResult["lastName"]
      ) {
        return "-";
      }
      return `${searchResult["firstName"] || ""} ${
        searchResult["middleName"] || ""
      } ${searchResult["lastName"] || ""}`;
    } else if (value) {
      let result = "";
      for (let index = 0; index < updatedSearchBy.length; index++) {
        result = searchResult[updatedSearchBy[index]]
          ? result + searchResult[updatedSearchBy[index]] + " "
          : result;
      }
      return result.trim() ? result : "-";
    } else return "-";
  };

  const emptyControl = () => {
    return (
      <span
        className={`${fontSize} ${fontColor} ${
          truncatedData ? "truncate" : ""
        }`}
        data-testid={`${fieldDetail?.label.en}--`}
      >
        -
      </span>
    );
  };

  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  const [selectedNoDataId, setSelectedNoDataId] = React.useState<
    string[] | string | null
  >(null);
  const [showFieldDataPermissionModal, setShowFieldDataPermissionModal] =
    React.useState<{
      visible: boolean;
      data: { type: "data" | "field"; message: any } | null;
    }>({ visible: false, data: null });

  const [showNoDataPermissionIcon, setShowNoDataPermissionIcon] =
    React.useState<{
      recordIds: string[] | string;
      type: "noData" | "permission";
    } | null>(null);

  React.useEffect(() => {
    if (!searchResultsLoading) {
      if (searchResults?.length === 0 && value?.length) {
        const valuesArray = value.map((id) => id);
        setShowNoDataPermissionIcon({ recordIds: valuesArray, type: "noData" });
      }
      if (searchResults?.length && value?.length) {
        const valuesArray: string[] = [];
        value.forEach((id) => {
          let findIndex = searchResults.findIndex(
            (searchResult) => searchResult.id === id
          );
          if (findIndex === -1 && checkIfValidUUID(id)) {
            valuesArray.push(id);
          }
        });
        if (valuesArray.length) {
          setShowNoDataPermissionIcon({
            recordIds: valuesArray,
            type: "noData",
          });
        }
      }
    }
  }, [searchResultsLoading]);

  if (editInputDetails?.visible) {
    return (
      <FieldEditInput
        field={fieldDetail}
        appName={SupportedApps.crm}
        modelName={fieldDetail?.moduleName || ""}
        editInputDetails={editInputDetails}
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        updateModelFieldData={updateModelFieldData ?? null}
        // updateSearchResults={(value: any) => setSearchResults(value)}
      />
    );
  }

  if (
    !searchResultsLoading &&
    searchResults &&
    searchBy &&
    searchBy.length > 0
  ) {
    return (
      <>
        {searchDataFound === "permission" ? (
          <NoPermissionComponent
            setShowPermissionModal={(value) => setShowPermissionModal(value)}
            fontSize={fontSize}
          />
        ) : searchResults?.length === 0 ? (
          value?.length > 0 ? (
            <p className="flex items-center gap-x-1">
              <NoPermissionComponent
                setShowPermissionModal={(value) => {
                  setSearchDataFound("noData");
                  setShowPermissionModal(value);
                  setSelectedNoDataId(
                    showNoDataPermissionIcon?.recordIds || ""
                  );
                }}
                fontSize={fontSize}
              />
            </p>
          ) : (
            <div
              className={
                showFieldEditInput ? "flex items-center gap-x-1 group" : ""
              }
            >
              {emptyControl()}
              <ShowFieldEdit
                setEditInputDetails={(value: IEditInputDetails) =>
                  setEditInputDetails(value)
                }
                dataToDisplay={""}
                field={fieldDetail}
                showFieldEditInput={showFieldEditInput}
                id={data?.["id"]}
              />
            </div>
          )
        ) : fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.includes(
            ".Lookup"
          ) ? (
          emptyControl()
        ) : (
          <p
            className={`${displayType} ${
              truncatedData ? "truncate" : "whitespace-normal break-all"
            } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
              fixedWidth || ""
            }`}
            data-testid={`${fieldDetail?.label.en}-value`}
          >
            <div>
              {showNoDataPermissionIcon?.recordIds ? (
                <span className="inline-block mr-1 align-top">
                  <NoPermissionComponent
                    setShowPermissionModal={(value) => {
                      setSearchDataFound(
                        showNoDataPermissionIcon?.type || "noData"
                      );
                      setShowPermissionModal(value);
                      setSelectedNoDataId(
                        showNoDataPermissionIcon?.recordIds || ""
                      );
                    }}
                    fontSize={fontSize}
                  />
                </span>
              ) : (
                <></>
              )}
              {value?.map((id, index) => {
                let findIndex = searchResults.findIndex(
                  (searchResult) => searchResult.id === id
                );
                if (findIndex !== -1) {
                  if (
                    fieldDetail?.name === "dealPipelineId" ||
                    fieldDetail?.name === "dealStageId"
                  ) {
                    const dataToDisplay =
                      index !== value.length - 1
                        ? renderFieldData(searchResults[findIndex]) + ","
                        : renderFieldData(searchResults[findIndex]);
                    return (
                      <span
                        key={index}
                        className={`pr-1 ${fontSize} ${getBreakWordCSS(
                          viewType,
                          truncatedData,
                          renderFieldData(searchResults[findIndex])
                        )}`}
                        title={dataToDisplay}
                        data-testid={`${fieldDetail?.label.en}-${
                          dataToDisplay || "-"
                        }`}
                      >
                        {dataToDisplay}
                      </span>
                    );
                  } else {
                    if (
                      fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.includes(
                        "accounts"
                      )
                    ) {
                      const dataToDisplay =
                        index !== value.length - 1
                          ? renderFieldData(searchResults[findIndex]) + ","
                          : renderFieldData(searchResults[findIndex]);
                      const title = dataToDisplay?.endsWith(",")
                        ? dataToDisplay.slice(0, -1)
                        : dataToDisplay;
                      return (
                        <span
                          key={index}
                          className={`pr-1 ${fontSize} ${getBreakWordCSS(
                            viewType,
                            truncatedData,
                            renderFieldData(searchResults[findIndex])
                          )}`}
                          title={title}
                          data-testid={`${fieldDetail?.label.en}-${
                            title || "-"
                          }`}
                        >
                          {index !== value.length - 1
                            ? renderFieldData(searchResults[findIndex]) + ","
                            : renderFieldData(searchResults[findIndex])}
                        </span>
                      );
                    } else {
                      const dataToDisplay =
                        index !== value.length - 1
                          ? renderFieldData(searchResults[findIndex]) + ","
                          : renderFieldData(searchResults[findIndex]);
                      const title = dataToDisplay?.endsWith(",")
                        ? dataToDisplay.slice(0, -1)
                        : dataToDisplay;
                      return (
                        <Link
                          legacyBehavior
                          href={appsUrlGenerator(
                            appName,
                            modelName,
                            AllowedViews.detail,
                            id,
                            includeBaseUrl && fieldDetail?.name.includes("deal")
                              ? [id, urlModelName]
                              : [""]
                          )}
                          passHref
                          key={index}
                        >
                          <a
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            target="_blank"
                            className={`pr-1 text-vryno-theme-light-blue ${
                              viewType == "List"
                                ? "max-w-[160px] inline-block"
                                : ""
                            } ${fontSize} ${getBreakWordCSS(
                              viewType,
                              truncatedData,
                              renderFieldData(searchResults[findIndex])
                            )}`}
                            title={title}
                            data-testid={`${fieldDetail?.label.en}-${
                              title || "-"
                            }`}
                          >
                            <RecordLookupNoFieldDataComponent
                              fontSize={fontSize}
                              value={searchResults[findIndex]}
                              setShowFieldDataPermissionModal={
                                setShowFieldDataPermissionModal
                              }
                            />{" "}
                            {dataToDisplay}
                          </a>
                        </Link>
                      );
                    }
                  }
                } else {
                  return checkIfValidUUID(id) ? (
                    <></>
                  ) : (
                    <span
                      key={index}
                      className={`pr-1 ${fontSize} ${getBreakWordCSS(
                        viewType,
                        truncatedData,
                        id
                      )}`}
                      title={id}
                      data-testid={`${fieldDetail?.label.en}-${id || "-"}`}
                    >
                      {id}
                    </span>
                  );
                }
              })}
            </div>
            <ShowFieldEdit
              setEditInputDetails={(value: IEditInputDetails) =>
                setEditInputDetails(value)
              }
              dataToDisplay={data ? data[fieldDetail?.name || ""] : ""}
              field={fieldDetail}
              showFieldEditInput={showFieldEditInput}
              id={data?.["id"]}
            />
          </p>
        )}
        {showPermissionModal && (
          <>
            <PermissionModal
              formHeading={
                searchDataFound == "permission"
                  ? "No Permission"
                  : searchDataFound === "noData"
                  ? "No Data Found"
                  : "Error"
              }
              onCancel={() => {
                setShowPermissionModal(false);
                setSelectedNoDataId(null);
              }}
              type={searchDataFound}
              recordIds={selectedNoDataId || value.toString()}
              shortMessage={false}
            />
            <Backdrop
              onClick={() => {
                setShowPermissionModal(false);
                setSelectedNoDataId(null);
              }}
            />
          </>
        )}
        {showFieldDataPermissionModal && showFieldDataPermissionModal.data && (
          <>
            <NoDataForFieldPermissionModal
              onCancel={() =>
                setShowFieldDataPermissionModal({ visible: false, data: null })
              }
              type={showFieldDataPermissionModal.data.type}
              message={showFieldDataPermissionModal.data.message}
            />
            <Backdrop
              onClick={() =>
                setShowFieldDataPermissionModal({ visible: false, data: null })
              }
            />
          </>
        )}
      </>
    );
  } else
    return (
      <div className="mt-1 flex flex-row bg-gray-200 opacity-30 h-[14px] animate-pulse" />
    );
};
