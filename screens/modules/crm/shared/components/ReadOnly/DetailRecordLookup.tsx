import Link from "next/link";
import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
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
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { SupportedApps } from "../../../../../../models/shared";
import { FieldEditInput } from "./Shared/FieldEditInput";
import { getBreakWordCSS } from "./getBreakWordCSS";

export type DetailRecordLookupProps = {
  appName: SupportedApps;
  searchBy: Array<string>;
  fieldDisplayExpression: string[];
  value:
    | string
    | {
        id: string;
        value: string;
        __expression_data_not_found__: boolean;
        __expression_data_not_found_message__: string;
      }
    | {
        id: string;
        value: string;
        __field_expression_not_found__: boolean;
        __field_expression_not_found_message__: string;
      };
  modelName: string;
  fontSize: string;
  truncatedData: boolean;
  fieldDetail?: ICustomField;
  fontColor?: string;
  data?: Record<string, any>;
  includeBaseUrl?: boolean;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  displayType?: string;
  viewType?: "Card" | "List";
  showFieldEditInput?: boolean;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  fixedWidth?: string;
};

export const DetailRecordLookup = ({
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
  dataProcessed,
  dataProcessing,
  displayType,
  viewType,
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
}: DetailRecordLookupProps) => {
  const { id, modelName: urlModelName } = getAppPathParts();
  const userModel = AccountModels.User;
  const [searchResults, setSearchResults] = useState<Record<string, string>>(
    {}
  );
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  const [searchDataFound, setSearchDataFound] = React.useState<
    "permission" | "noData" | null
  >(null);
  const [searchResultsLoading, setSearchResultsLoading] =
    useState<boolean>(false);
  const [editInputDetails, setEditInputDetails] =
    React.useState<IEditInputDetails>({
      visible: false,
      fieldData: null,
      id: undefined,
    });

  const [getSearchedResults] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (data) => {
      if (data?.fetch?.data && data?.fetch?.data?.length > 0) {
        const responseData = data.fetch.data[0];
        setSearchResults(
          recordLookupSearchResultDataExtractor(
            fieldDisplayExpression,
            searchBy,
            responseData
          )
        );
        setSearchResultsLoading(false);
        return;
      }
      if (
        data?.fetch?.messageKey.includes("success") &&
        !data?.fetch?.data?.length
      ) {
        setSearchDataFound("noData");
      }
      if (data?.fetch?.messageKey.includes("requires-view")) {
        setSearchDataFound("permission");
      }
      setSearchResults({});
      setSearchResultsLoading(false);
    },
  });

  React.useEffect(() => {
    if (!appName) return;
    if (
      modelName &&
      searchBy &&
      value &&
      checkIfValidUUID(value) &&
      Object.keys(searchResults)?.length <= 0
    ) {
      if (!dataProcessed) {
        setSearchResultsLoading(true);
        if (modelName === userModel) {
          getSearchedResults({
            variables: {
              modelName: userModel,
              fields: ["firstName", "lastName", "middleName", "id"],
              filters: [
                { operator: "eq", name: "id", value: [value] },
                {
                  operator: "in",
                  name: "recordStatus",
                  value: ["a", "i"],
                },
              ],
            },
          }).then();
          return;
        }
        getSearchedResults({
          variables: {
            modelName: modelName,
            fields: [...searchBy, "id"],
            filters: [
              { operator: "eq", name: "id", value: [value] },
              {
                operator: "in",
                name: "recordStatus",
                value: ["a", "i"],
              },
            ],
          },
        }).then();
      }
    }

    if (
      (modelName && searchBy && value && value === "__no_permission__") ||
      value === "__no_data__"
    ) {
      value === "__no_permission__"
        ? setSearchDataFound("permission")
        : value === "__no_data__"
        ? setSearchDataFound("noData")
        : setSearchDataFound(null);
    }
  }, [modelName, searchBy, value, appName]);

  const renderFieldData = () => {
    if (modelName === userModel && value && typeof value === "string") {
      if (
        !searchResults["firstName"] &&
        !searchResults["middleName"] &&
        !searchResults["lastName"]
      ) {
        return "-";
      }
      return `${searchResults["firstName"] || ""} ${
        searchResults["middleName"] || ""
      } ${searchResults["lastName"] || ""}`;
    } else if (
      value &&
      (typeof value === "string" || typeof value === "object")
    ) {
      const updatedSearchBy = getNamesOnlyFromField(searchBy);
      let result = "";
      for (let index = 0; index < updatedSearchBy.length; index++) {
        result = searchResults[updatedSearchBy[index]]
          ? result + searchResults[updatedSearchBy[index]] + " "
          : result;
      }
      return result.trim() ? result : "-";
    } else return "-";
  };

  const emptyControl = () => {
    return (
      <p
        className={`${displayType} ${fontSize} ${fontColor} ${
          truncatedData ? "truncate" : "break-words"
        } ${fixedWidth || ""}`}
        data-testid={`${fieldDetail?.label.en}-${renderFieldData()}`}
      >
        {renderFieldData()}
      </p>
    );
  };

  const [showFieldDataPermissionModal, setShowFieldDataPermissionModal] =
    React.useState<{
      visible: boolean;
      data: { type: "data" | "field"; message: any } | null;
    }>({ visible: false, data: null });

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
        updateSearchResults={(value: any) => setSearchResults(value)}
      />
    );
  }

  return (
    <>
      {dataProcessing ? (
        <div className="mt-1 flex flex-row bg-gray-200 opacity-30 h-[14px] animate-pulse" />
      ) : !searchResultsLoading && searchDataFound ? (
        <NoPermissionComponent
          setShowPermissionModal={(value) => setShowPermissionModal(value)}
          fontSize={fontSize}
        />
      ) : !searchResultsLoading &&
        searchResults &&
        searchBy &&
        searchBy.length > 0 ? (
        fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.includes(
          ".Lookup"
        ) ||
        fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.includes(
          "accounts"
        ) ? (
          typeof value === "object" ? (
            value?.value ? (
              <p
                className={`${displayType} ${fontSize} ${fontColor} ${getBreakWordCSS(
                  viewType,
                  truncatedData,
                  value?.value
                )} ${
                  showFieldEditInput ? "flex items-center gap-x-1 group" : ""
                }`}
                data-testid={`${fieldDetail?.label.en}-${value?.value || "-"}`}
              >
                <RecordLookupNoFieldDataComponent
                  fontSize={fontSize}
                  value={value}
                  setShowFieldDataPermissionModal={
                    setShowFieldDataPermissionModal
                  }
                />{" "}
                {value?.value}
                <ShowFieldEdit
                  setEditInputDetails={(value: IEditInputDetails) =>
                    setEditInputDetails(value)
                  }
                  dataToDisplay={
                    data
                      ? data[fieldDetail?.name || ""]?.id ??
                        data[fieldDetail?.name || ""] ??
                        ""
                      : ""
                  }
                  field={fieldDetail}
                  showFieldEditInput={showFieldEditInput}
                  id={data?.["id"]}
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
          ) : (
            <div
              className={
                showFieldEditInput
                  ? "flex items-center gap-x-1 group"
                  : "inline-block"
              }
            >
              {emptyControl()}
              <ShowFieldEdit
                setEditInputDetails={(value: IEditInputDetails) =>
                  setEditInputDetails(value)
                }
                dataToDisplay={
                  data
                    ? data[fieldDetail?.name || ""]?.id ??
                      data[fieldDetail?.name || ""] ??
                      ""
                    : ""
                }
                field={fieldDetail}
                showFieldEditInput={showFieldEditInput}
                id={data?.["id"]}
              />
            </div>
          )
        ) : searchResults?.id ? (
          fieldDetail?.name === "dealPipelineId" ||
          fieldDetail?.name === "dealStageId" ? (
            <p
              className={`${displayType} ${fontSize} ${getBreakWordCSS(
                viewType,
                truncatedData,
                renderFieldData()
              )}`}
              title={renderFieldData() || ""}
              data-testid={`${fieldDetail?.label.en}-${renderFieldData()}`}
            >
              <RecordLookupNoFieldDataComponent
                fontSize={fontSize}
                value={searchResults}
                setShowFieldDataPermissionModal={
                  setShowFieldDataPermissionModal
                }
              />{" "}
              {renderFieldData()}
            </p>
          ) : (
            <Link
              href={`${appsUrlGenerator(
                appName,
                modelName,
                AllowedViews.detail,
                searchResults?.id,
                includeBaseUrl && fieldDetail?.name.includes("deal")
                  ? [id, urlModelName]
                  : [""]
              )}`}
              legacyBehavior
            >
              <a
                className={`text-vryno-theme-light-blue ${fontSize} ${getBreakWordCSS(
                  viewType,
                  truncatedData,
                  renderFieldData()
                )} ${
                  showFieldEditInput ? "flex items-center gap-x-1 group" : ""
                } ${fixedWidth ? `${fixedWidth} inline-block` : ""}`}
                title={renderFieldData() || ""}
                data-testid={`${fieldDetail?.label.en}-${renderFieldData()}`}
              >
                <>
                  <RecordLookupNoFieldDataComponent
                    fontSize={fontSize}
                    value={searchResults}
                    setShowFieldDataPermissionModal={
                      setShowFieldDataPermissionModal
                    }
                  />{" "}
                  {renderFieldData()}
                </>
                <ShowFieldEdit
                  setEditInputDetails={(value: IEditInputDetails) =>
                    setEditInputDetails(value)
                  }
                  dataToDisplay={
                    data
                      ? data[fieldDetail?.name || ""]?.id ??
                        data[fieldDetail?.name || ""] ??
                        ""
                      : ""
                  }
                  field={fieldDetail}
                  showFieldEditInput={showFieldEditInput}
                  id={data?.["id"]}
                />
              </a>
            </Link>
          )
        ) : typeof value === "object" ? (
          value?.value ? (
            <Link
              href={`${appsUrlGenerator(
                appName,
                modelName,
                AllowedViews.detail,
                value?.id,
                includeBaseUrl && fieldDetail?.name.includes("deal")
                  ? [id, urlModelName]
                  : [""]
              )}`}
              passHref
              legacyBehavior
            >
              <a
                className={`text-vryno-theme-light-blue ${fontSize} ${getBreakWordCSS(
                  viewType,
                  truncatedData,
                  value?.value
                )} ${
                  showFieldEditInput ? "flex items-center gap-x-1 group" : ""
                } ${fixedWidth ? `${fixedWidth} inline-block` : ""}`}
                onClick={(e) => e.stopPropagation()}
                title={value?.value || ""}
                data-testid={`${fieldDetail?.label.en}-${value?.value || "-"}`}
              >
                <RecordLookupNoFieldDataComponent
                  fontSize={fontSize}
                  value={value}
                  setShowFieldDataPermissionModal={
                    setShowFieldDataPermissionModal
                  }
                />{" "}
                {value?.value}
                <ShowFieldEdit
                  setEditInputDetails={(value: IEditInputDetails) =>
                    setEditInputDetails(value)
                  }
                  dataToDisplay={
                    data
                      ? data[fieldDetail?.name || ""]?.id ??
                        data[fieldDetail?.name || ""] ??
                        ""
                      : ""
                  }
                  field={fieldDetail}
                  showFieldEditInput={showFieldEditInput}
                  id={data?.["id"]}
                />
              </a>
            </Link>
          ) : (
            <div
              className={
                showFieldEditInput
                  ? "flex items-center gap-x-1 group"
                  : "inline-block"
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
        ) : value ? (
          value === "__no_permission__" || value === "__no_data__" ? (
            <NoPermissionComponent
              setShowPermissionModal={(value) => setShowPermissionModal(value)}
              fontSize={fontSize}
            />
          ) : (
            <p
              className={`${displayType} ${fontSize} ${
                truncatedData ? "truncate" : "break-words"
              } ${fixedWidth || ""}`}
              title={checkIfValidUUID(value) ? "" : value}
              data-testid={`${fieldDetail?.label.en}-${
                checkIfValidUUID(value) ? renderFieldData() : value || "-"
              }`}
            >
              {checkIfValidUUID(value) ? emptyControl() : value}
            </p>
          )
        ) : (
          emptyControl()
        )
      ) : (
        <div className="mt-1 flex flex-row bg-gray-200 opacity-30 h-[14px] animate-pulse" />
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
            onCancel={() => setShowPermissionModal(false)}
            type={searchDataFound}
            recordIds={value as string}
            shortMessage={
              value === "__no_permission__" || value === "__no_data__"
                ? true
                : false
            }
          />
          <Backdrop onClick={() => setShowPermissionModal(false)} />
        </>
      )}
      {showFieldDataPermissionModal.visible &&
        showFieldDataPermissionModal.data && (
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
};
