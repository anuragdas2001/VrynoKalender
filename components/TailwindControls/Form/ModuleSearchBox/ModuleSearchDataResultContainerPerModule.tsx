import React, { useContext } from "react";
import { INavigation } from "../../../../models/INavigation";
import Link from "next/link";
import { getSearchedValueKeyOtherThanSearchByOptions } from "./moduleSearchDataHandler";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../models/ICustomField";
import { getSortedFieldList } from "../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../graphql/queries/fetchQuery";
import { ILayout } from "../../../../models/ILayout";
import { Loading } from "../../Loading/Loading";
import { GetAllMandatoryKeyValuesOtherThanSearchByOptions } from "./GetAllFieldMandatoryKeyValuesOtherThanSearchByOptions";
import { AccountModels } from "../../../../models/Accounts";
import { GetSearchedResultHighlighted } from "./GetSearchedResultHighlighted";
import { IModuleMetadata } from "../../../../models/IModuleMetadata";
import { GeneralStoreContext } from "../../../../stores/RootStore/GeneralStore/GeneralStore";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../../../screens/modules/crm/shared/utils/getFieldsFromDisplayExpression";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";
import { paramCase } from "change-case";

const customFieldDefaults = {
  recordLookupAttributes: [],
  systemDefined: true,
  recordLookupAdditionalFilter: { type: "" },
  instanceId: "",
  moduleName: "",
  uniqueName: "",
  label: { en: "", fr: "" },
  name: "",
  dataType: SupportedDataTypes.singleline,
  mandatory: true,
  visible: true,
  validations: {},
  lookupValues: {},
  recordLookupModules: [],
  system: "",
  recordStatus: "",
  order: 0,
  readOnly: false,
  addInForm: true,
  expression: "",
};

export const userFieldsList = [
  {
    ...customFieldDefaults,
    id: "1",
    order: 1,
    name: "first_name",
    label: { en: "First Name", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "2",
    order: 2,
    name: "last_name",
    label: { en: "Last Name", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "3",
    order: 3,
    name: "email",
    label: { en: "Email", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "4",
    order: 4,
    name: "created_at",
    label: { en: "Created At", fr: "" },
    dataType: SupportedDataTypes.datetime,
    systemDefined: true,
    visible: true,
  },
];

export type ModuleSearchDataResultContainerPerModuleProps = {
  appName: string;
  modelNameIndex: number;
  showModelNameInSearch: boolean;
  modelName: string;
  updatedNavigations: INavigation[];
  searchResults: ISearchQuestData[];
  searchBy: Array<string>;
  searchByUniqueName?: boolean;
  searchedValue: string;
  highlightedResultInFlexCol?: boolean;
  smallResolution?: boolean;
  showMoreData?: boolean;
  currentSelectedSearch?: any;
  useModuleExpression?: boolean;
  handleItemsFieldsList?: (modelName: string, fields: ICustomField[]) => void;
  handleSelectedItem: (value: ISearchQuestData) => void;
  setPanelBelowVisible: (value: boolean) => void;
};

export const ModuleSearchDataResultContainerPerModule = ({
  appName,
  modelNameIndex,
  showModelNameInSearch,
  modelName,
  updatedNavigations,
  searchResults,
  searchBy,
  searchedValue,
  smallResolution,
  showMoreData = true,
  currentSelectedSearch,
  searchByUniqueName = true,
  highlightedResultInFlexCol = false,
  useModuleExpression = false,
  handleItemsFieldsList = () => {},
  handleSelectedItem = () => {},
  setPanelBelowVisible,
}: ModuleSearchDataResultContainerPerModuleProps) => {
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    importModuleInfo,
    allLayoutFetched,
    allModulesFetched,
  } = generalModelStore;
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [fieldsListFetchLoading, setFieldsListFetchLoading] =
    React.useState<boolean>(true);
  const [updatedSearchBy, setUpdatedSearchBy] = React.useState<string[]>([]);
  const [moduleFetched, setModuleFetched] = React.useState<
    IModuleMetadata | undefined
  >(genericModels[modelName]?.moduleInfo);

  const [getModule] = useLazyQuery<FetchData<IModuleMetadata>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data?.length) {
          importModuleInfo(responseOnCompletion.fetch.data[0], modelName);
          setModuleFetched(
            responseOnCompletion.fetch.data.length > 0
              ? responseOnCompletion.fetch.data[0]
              : undefined
          );
        }
      },
    }
  );

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setFieldsList(
          getSortedFieldList(responseOnCompletion.fetch.data[0].config.fields)
        );
        handleItemsFieldsList(
          responseOnCompletion.fetch.data[0].moduleName,
          getSortedFieldList(responseOnCompletion.fetch.data[0].config.fields)
        );
      }
      setFieldsListFetchLoading(false);
    },
  });

  React.useEffect(() => {
    if (modelName && modelName === AccountModels.User) {
      setFieldsList(userFieldsList);
      handleItemsFieldsList("user", userFieldsList);
      setFieldsListFetchLoading(false);
    }
    if (
      modelName &&
      modelName !== AccountModels.User &&
      allLayoutFetched &&
      appName
    ) {
      let fieldsListFromStore = genericModels[modelName]?.fieldsList ?? [];
      if (fieldsListFromStore?.length > 0) {
        setFieldsList(getSortedFieldList(fieldsListFromStore));
        handleItemsFieldsList(
          modelName,
          getSortedFieldList(fieldsListFromStore)
        );
        setFieldsListFetchLoading(false);
      } else {
        getLayout({
          variables: {
            modelName: "Layout",
            fields: ["id", "name", "moduleName", "layout", "config", "type"],
            filters: [
              {
                name: "moduleName",
                operator: "eq",
                value: [modelName],
              },
            ],
          },
        }).then();
      }
    }
  }, [modelName, allLayoutFetched, appName]);

  React.useEffect(() => {
    if (
      modelName &&
      modelName !== AccountModels.User &&
      useModuleExpression &&
      allModulesFetched &&
      appName
    ) {
      let moduleInfoFromStore = genericModels[modelName]?.moduleInfo;
      if (moduleInfoFromStore) {
        setModuleFetched(moduleInfoFromStore);
      } else {
        getModule({
          variables: {
            modelName: "Module",
            fields: ["id", "name", "customizationAllowed"],
            filters: [
              {
                name: "name",
                operator: "eq",
                value: [modelName],
              },
            ],
          },
        }).then();
      }
    }
  }, [useModuleExpression, modelName, allModulesFetched, appName]);

  React.useEffect(() => {
    if (
      fieldsList?.length > 0 &&
      moduleFetched &&
      Object.keys(moduleFetched)?.length > 0 &&
      useModuleExpression
    ) {
      const moduleLevelExpression =
        moduleFetched?.displayExpression ?? "${name}";
      const searchByListModuleLevel = evaluateDisplayExpression(
        getFieldsFromDisplayExpression(moduleLevelExpression),
        fieldsList
      );
      if (fieldsList.length > 0 && searchByListModuleLevel.length > 0) {
        let updatedSearchBy = [];
        for (let index = 0; index < searchByListModuleLevel.length; index++) {
          const field = fieldsList?.filter(
            (field) => field.name === searchByListModuleLevel[index]
          );
          if (field.length > 0 && !field[0].systemDefined) {
            updatedSearchBy.push(field[0].uniqueName);
          } else if (
            field.length > 0 &&
            field[0].uniqueName.split(".").length >= 3
          ) {
            updatedSearchBy.push(field[0].uniqueName.split(".")[2]);
          }
        }
        setUpdatedSearchBy(updatedSearchBy.filter((item) => item !== ""));
      }
    }
  }, [fieldsList, moduleFetched, useModuleExpression, modelName]);

  return (
    <div key={modelNameIndex}>
      {showModelNameInSearch && (
        <div
          className={`w-full h-full py-2 px-2 text-xs ${
            smallResolution
              ? "bg-vryno-theme-highlighter-blue bg-opacity-50"
              : "bg-vryno-dropdown-hover"
          } truncate`}
        >
          <span className="text-vryno-theme-blue text-xs font-medium">
            {modelName === AccountModels.User
              ? "User"
              : modelName &&
                updatedNavigations?.filter(
                  (navigation) =>
                    navigation?.navTypeMetadata?.moduleName &&
                    navigation?.navTypeMetadata?.moduleName === modelName
                )[0]?.label?.en}
          </span>
        </div>
      )}
      {!fieldsListFetchLoading ||
      (useModuleExpression &&
        moduleFetched &&
        Object.keys(moduleFetched).length < 0) ? (
        searchResults
          ?.filter((searchResult) => searchResult.modelName === modelName)
          ?.map((searchResult, searchResultIndex) => (
            <Link href={""} key={searchResultIndex} legacyBehavior>
              <a
                id={`search-${searchResult.modelName}-${searchResult.rowId}`}
                className={`w-full h-full flex flex-col ${
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
                    {searchedValue === "" && modelName === AccountModels.User
                      ? ["first_name", "last_name"].map((item, index) => (
                          <span key={index} className="font-medium">
                            <GetSearchedResultHighlighted
                              searchResult={searchResult}
                              item={item}
                              searchedValue={searchedValue}
                            />
                          </span>
                        ))
                      : searchedValue === ""
                      ? (useModuleExpression ? updatedSearchBy : searchBy).map(
                          (item, index) => (
                            <span key={index} className="font-medium">
                              {/* bbbbbbbbbb{" "} */}
                              <GetSearchedResultHighlighted
                                searchResult={searchResult}
                                item={item}
                                searchedValue={searchedValue}
                              />
                            </span>
                          )
                        )
                      : !smallResolution && modelName === AccountModels.User
                      ? ["first_name", "last_name"].map((item, index) => (
                          <span key={index} className="font-medium">
                            {/* cccccccc{" "} */}
                            <GetSearchedResultHighlighted
                              searchResult={searchResult}
                              item={item}
                              searchedValue={searchedValue}
                            />
                          </span>
                        ))
                      : !smallResolution &&
                        (useModuleExpression ? updatedSearchBy : searchBy).map(
                          (item, index) => (
                            <span key={index} className="font-medium">
                              {/* ddddddddddd{" "} */}
                              <GetSearchedResultHighlighted
                                searchResult={searchResult}
                                item={item}
                                searchedValue={searchedValue}
                              />
                            </span>
                          )
                        )}
                  </div>
                  {searchedValue && (
                    <span className="flex text-moreInfoHeading text-vryno-slate-color items-center">
                      <span
                        className={`text-moreInfoHeading ${
                          smallResolution ? "hidden" : ""
                        }`}
                      >
                        {/* eeeeeeee{" "} */}
                        {getSearchedValueKeyOtherThanSearchByOptions(
                          searchResult,
                          searchedValue,
                          useModuleExpression ? updatedSearchBy : searchBy,
                          modelName === AccountModels.User
                            ? fieldsList
                            : fieldsList.map((field: ICustomField) => {
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
                        {/* ffffffffff{" "} */}
                        <GetSearchedResultHighlighted
                          searchResult={searchResult}
                          item={""}
                          searchedValue={searchedValue}
                          fieldsList={
                            modelName === AccountModels.User
                              ? fieldsList
                              : fieldsList.map((field: ICustomField) => {
                                  return {
                                    ...field,
                                    name: field.systemDefined
                                      ? field.uniqueName.split(".")[2]
                                      : field.uniqueName,
                                  };
                                })
                          }
                          searchBy={
                            useModuleExpression ? updatedSearchBy : searchBy
                          }
                        />
                      </span>
                      <pre>{`, `}</pre>
                    </span>
                  )}
                </div>
                <span className="flex text-moreInfoHeading text-vryno-slate-color items-center ">
                  {/* ggggg{" "} */}
                  <GetAllMandatoryKeyValuesOtherThanSearchByOptions
                    searchResult={searchResult}
                    fieldsList={
                      modelName === AccountModels.User
                        ? fieldsList
                        : fieldsList.map((field: ICustomField) => {
                            return {
                              ...field,
                              name: field.systemDefined
                                ? field.uniqueName.split(".")[2]
                                : field.uniqueName,
                            };
                          })
                    }
                    modelName={modelName}
                    showMoreData={showMoreData}
                    smallResolution={smallResolution}
                    displayType={"inline-block"}
                  />
                </span>
              </a>
            </Link>
          ))
      ) : (
        <div className={`w-full flex items-center justify-center py-2`}>
          <PageLoader scale={0.5} />
        </div>
      )}
    </div>
  );
};
