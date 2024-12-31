import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { AccountModels } from "../../../../../../models/Accounts";
import { ICustomField } from "../../../../../../models/ICustomField";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../../shared/utils/getFieldsFromDisplayExpression";
import { checkIfValidUUID } from "../../../shared/utils/getSettingsPathParts";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { getDataObject } from "../../../shared/utils/getDataObject";
import { recordLookupSearchResultDataExtractor } from "../../../shared/components/ReadOnly/recordLookupHelper";
import { usePrevious } from "../../../../../../components/Hooks/usePreviousState";

export function useGetProcessedData(
  moduleData: any[],
  fieldsList: ICustomField[],
  currentPageNumber: number,
  deleteModalVisible: boolean,
  backgroundProcessRunning: boolean,
  genericModels: IGenericModel,
  foundNewData: boolean,
  setFoundNewData: (value: boolean) => void
) {
  let [searchResultLoading, setSearchResultLoading] = useState<boolean>(true);
  let [updatedModuleData, setUpdatedModuleData] = useState<any[]>([]);
  let [pageNumber, setPageNumber] = useState<number>(1);
  let [deleteModal, setDeleteModal] = useState<boolean>(false);
  let [backgroundProcess, setBackgroundProcess] = useState<boolean>(false);
  const prevModuleData = usePrevious({ moduleData });
  const prevFieldsList = usePrevious({ fieldsList });

  let recordLookupNonUserFields: ICustomField[] = fieldsList
    ?.filter((field) => {
      let modelName =
        field?.dataTypeMetadata?.allLookups &&
        field?.dataTypeMetadata?.allLookups?.length > 0
          ? field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
          : "";
      if (modelName !== "user" && field.dataType === "recordLookup")
        return field;
    })
    ?.filter((field) => field);

  let recordLookupUserFields: ICustomField[] = fieldsList
    ?.filter((field) => {
      let modelName =
        field?.dataTypeMetadata?.allLookups &&
        field?.dataTypeMetadata?.allLookups?.length > 0
          ? field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
          : "";
      if (modelName === "user" && field.dataType === "recordLookup")
        return field;
    })
    ?.filter((field) => field);

  let [getUserSearchResults] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
  });

  let [getSearchedResults] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  useEffect(() => {
    if (
      (moduleData?.length > 0 &&
        fieldsList?.length > 0 &&
        (searchResultLoading || foundNewData)) ||
      (moduleData?.length !== updatedModuleData?.length && !searchResultLoading)
    ) {
      if (
        prevModuleData?.moduleData &&
        moduleData &&
        JSON.stringify(prevModuleData?.moduleData) ===
          JSON.stringify(moduleData) &&
        JSON.stringify(prevFieldsList?.fieldsList) ===
          JSON.stringify(fieldsList)
      )
        return;

      let handleModulesFetch = async () => {
        let fetchPromise = recordLookupNonUserFields?.map(
          async (field: ICustomField) => {
            if (moduleData?.length > 0) {
              const moduleName =
                field?.dataTypeMetadata?.allLookups &&
                field?.dataTypeMetadata?.allLookups?.length > 0
                  ? field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(
                      "."
                    )[1]
                  : "";
              if (
                moduleData
                  ?.map((data) => {
                    if (checkIfValidUUID(data[field.name]))
                      return data[field.name];
                  })
                  ?.filter(
                    (data) => data && data !== null && data !== undefined
                  )?.length <= 0
              ) {
                return {
                  [field.name]: {
                    messageKey: "-success",
                    data: [],
                  },
                };
              } else {
                let response = await getSearchedResults({
                  variables: {
                    modelName: moduleName,
                    fields: [
                      ...evaluateDisplayExpression(
                        getFieldsFromDisplayExpression(
                          field?.dataTypeMetadata?.allLookups &&
                            field?.dataTypeMetadata?.allLookups?.length > 0
                            ? field?.dataTypeMetadata?.allLookups[0]
                                ?.displayExpression
                            : "${name}"
                        ),
                        genericModels[moduleName]?.layouts?.length > 0
                          ? genericModels[moduleName]?.layouts[0]?.config
                              ?.fields
                          : []
                      ),
                      "id",
                    ],
                    filters: [
                      {
                        name: "id",
                        operator: "in",
                        value: moduleData?.map((data) => {
                          if (checkIfValidUUID(data[field.name]))
                            return data[field.name];
                        }),
                      },
                    ],
                  },
                });
                if (
                  response.data?.fetch?.data &&
                  response.data?.fetch?.data?.length > 0
                ) {
                  return {
                    [field.name]: {
                      ...response.data?.fetch,
                      data: response.data?.fetch?.data?.map(
                        (data: Record<string, any>) => getDataObject(data)
                      ),
                    },
                  };
                } else {
                  return {
                    [field.name]: {
                      ...response.data?.fetch,
                      data: [],
                    },
                  };
                }
              }
            }
          }
        );

        let userFetchPromise = recordLookupUserFields?.map(
          async (field: ICustomField) => {
            if (
              moduleData
                ?.map((data) => {
                  if (checkIfValidUUID(data[field.name]))
                    return data[field.name];
                })
                ?.filter((data) => data && data !== null && data !== undefined)
                ?.length <= 0
            ) {
              return {
                [field.name]: {
                  messageKey: "-success",
                  data: [],
                },
              };
            } else {
              let response = await getUserSearchResults({
                variables: {
                  modelName: AccountModels.User,
                  fields: ["firstName", "lastName", "middleName", "id"],
                  filters: [
                    {
                      name: "id",
                      operator: "in",
                      value: moduleData?.map((data) => {
                        if (checkIfValidUUID(data[field.name]))
                          return data[field.name];
                      }),
                    },
                  ],
                },
              });
              return { [field.name]: response.data?.fetch };
            }
          }
        );

        let searchResults: any = {};
        await Promise.all(fetchPromise).then((response) => {
          for (let resp of response) {
            if (resp && Object.keys(resp)?.length > 0) {
              for (let key of Object.keys(resp)) {
                if (resp[key]?.messageKey?.includes("-success")) {
                  if (resp[key]?.data && resp[key]?.data?.length > 0) {
                    searchResults = {
                      ...searchResults,
                      [key]: resp[key]?.data,
                    };
                  } else {
                    searchResults = { ...searchResults, [key]: [] };
                  }
                } else if (resp[key]?.messageKey?.includes("requires-view")) {
                  searchResults = {
                    ...searchResults,
                    [key]: ["__no_permission__"],
                  };
                } else {
                  searchResults = { ...searchResults, [key]: [] };
                }
              }
            }
          }
        });

        await Promise.all(userFetchPromise).then((response) => {
          for (let resp of response) {
            if (resp && Object.keys(resp)?.length > 0) {
              for (let key of Object.keys(resp)) {
                if (resp[key]?.messageKey?.includes("-success")) {
                  if (resp[key]?.data && resp[key]?.data?.length > 0) {
                    searchResults = {
                      ...searchResults,
                      [key]: resp[key]?.data,
                    };
                  } else {
                    searchResults = { ...searchResults, [key]: [] };
                  }
                } else if (resp[key]?.messageKey?.includes("requires-view")) {
                  searchResults = {
                    ...searchResults,
                    [key]: ["__no_permission__"],
                  };
                } else {
                  searchResults = { ...searchResults, [key]: [] };
                }
              }
            }
          }
        });

        let recordLookupNonUserFieldList = recordLookupNonUserFields.map(
          (field) => field.name
        );
        let recordLookupUserFieldList = recordLookupUserFields.map(
          (field) => field.name
        );

        let newModuleData: any[] = moduleData?.map((data) => {
          if (data && Object.keys(data)?.length > 0) {
            let updatedData = {};
            for (let key of Object.keys(data)) {
              let findNonUserIndex = recordLookupNonUserFieldList?.findIndex(
                (item) => item === key
              );
              let findUserIndex = recordLookupUserFieldList?.findIndex(
                (item) => item === key
              );

              if (findNonUserIndex === -1 && findUserIndex === -1) {
                updatedData = { ...updatedData, [key]: data[key] };
              } else if (findNonUserIndex !== -1) {
                let searchResult =
                  searchResults[key]?.[0] === "__no_permission__"
                    ? "__no_permission__"
                    : searchResults[key]?.filter(
                        (result: any) => result?.id === data[key]
                      )?.length > 0
                    ? searchResults[key]?.filter(
                        (result: any) => result?.id === data[key]
                      )[0]
                    : {};
                let value: string = "";
                let field = recordLookupNonUserFields?.filter(
                  (field) => field.name === key
                )[0];

                const fieldDisplayExpression = getFieldsFromDisplayExpression(
                  field?.dataTypeMetadata?.allLookups &&
                    field?.dataTypeMetadata?.allLookups?.length > 0
                    ? field?.dataTypeMetadata?.allLookups[0]?.displayExpression
                    : "${name}"
                );
                const moduleName =
                  field?.dataTypeMetadata?.allLookups &&
                  field?.dataTypeMetadata?.allLookups?.length > 0
                    ? field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(
                        "."
                      )[1]
                    : "";
                const searchBy = evaluateDisplayExpression(
                  getFieldsFromDisplayExpression(
                    field?.dataTypeMetadata?.allLookups &&
                      field?.dataTypeMetadata?.allLookups?.length > 0
                      ? field?.dataTypeMetadata?.allLookups[0]
                          ?.displayExpression
                      : "${name}"
                  ),
                  genericModels[moduleName]?.layouts?.length > 0
                    ? genericModels[moduleName]?.layouts[0]?.config?.fields
                    : []
                );
                if (searchResult !== "__no_permission__") {
                  for (
                    let index = 0;
                    index < fieldDisplayExpression.length;
                    index++
                  ) {
                    value = searchResult[fieldDisplayExpression[index]]
                      ? value +
                        searchResult[fieldDisplayExpression[index]] +
                        " "
                      : value;
                  }
                  if (!value.length) {
                    value = searchResult["name"] || "";
                  }
                }

                if (searchResult === "__no_permission__") {
                  updatedData = { ...updatedData, [key]: "__no_permission__" };
                }
                if (data[key]) {
                  if (value.trim()) {
                    updatedData = {
                      ...updatedData,

                      [key]: {
                        id: searchResult?.id,
                        value: value,
                        ...recordLookupSearchResultDataExtractor(
                          fieldDisplayExpression,
                          searchBy,
                          searchResult
                        ),
                      },
                    };
                  } else {
                    updatedData = { ...updatedData, [key]: "__no_data__" };
                  }
                } else {
                  updatedData = { ...updatedData, [key]: data[key] };
                }
              } else if (findUserIndex !== -1) {
                let searchResult =
                  searchResults[key]?.[0] === "__no_permission__"
                    ? "__no_permission__"
                    : searchResults[key]?.filter(
                        (result: any) => result?.id === data[key]
                      )?.length > 0
                    ? searchResults[key]?.filter(
                        (result: any) => result?.id === data[key]
                      )[0]
                    : {};
                let value: string = "";
                if (searchResult !== "__no_permission__")
                  value = `${searchResult["firstName"] || ""} ${
                    searchResult["middleName"] || ""
                  } ${searchResult["lastName"] || ""}`;

                updatedData = {
                  ...updatedData,
                  [key]:
                    searchResult === "__no_permission__"
                      ? "__no_permission__"
                      : data[key]
                      ? data[key]?.[0] === "__no_permission__"
                        ? "__no_permission__"
                        : value.trim()
                        ? { id: searchResult?.id, value: value }
                        : "__no_data__"
                      : data[key],
                };
              }
            }
            return updatedData;
          } else {
            return data;
          }
        });
        setUpdatedModuleData(newModuleData);
      };
      handleModulesFetch();
      setSearchResultLoading(false);
      setFoundNewData(false);
    }
  }, [moduleData, fieldsList, foundNewData]);

  useEffect(() => {
    if (currentPageNumber && currentPageNumber !== pageNumber) {
      setSearchResultLoading(true);
      setPageNumber(currentPageNumber);
    }
  }, [currentPageNumber]);

  useEffect(() => {
    if (deleteModalVisible !== deleteModal) {
      setSearchResultLoading(true);
      setDeleteModal(deleteModalVisible);
    }
  }, [deleteModalVisible]);

  useEffect(() => {
    if (backgroundProcessRunning !== backgroundProcess) {
      setSearchResultLoading(true);
      setBackgroundProcess(backgroundProcessRunning);
    }
  }, [backgroundProcessRunning]);
  return updatedModuleData;
}
