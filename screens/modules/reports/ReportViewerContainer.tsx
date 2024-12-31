import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEditor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import { observer } from "mobx-react-lite";
import { useLazyQuery } from "@apollo/client";
import { ICustomField } from "../../../models/ICustomField";
import { ReportViewerContent } from "./ReportViewerContent";
import { Rdl } from "@mescius/activereportsjs/lib/ar-js-core";
import { IModuleMetadata } from "../../../models/IModuleMetadata";
import { SEARCH_QUERY } from "../../../graphql/queries/searchQuery";
import { useCrmFetchLazyQuery } from "../crm/shared/utils/operations";
import { IUserPreference, SupportedApps } from "../../../models/shared";
import getNoteSuggestions from "../crm/generic/GenericModelDetails/Notes/NoteSuggestions";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../crm/shared/utils/getFieldsFromDisplayExpression";
import { relatedLookupMapper } from "../../../components/TailwindControls/Form/RelatedTo/FormRelatedTo";
import { getTiptapExtensions } from "../../../components/TailwindControls/Form/RichTextEditor/SupportedExtensions";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../graphql/queries/fetchQuery";
import { updateFieldsListDataTypeForFilters } from "../../layouts/GenericViewComponentMap";
import { getSortedFieldList } from "../crm/shared/utils/getOrderedFieldsList";
import { ILayout } from "../../../models/ILayout";

export type IReportsParameters = Rdl.ReportParameter & {
  Label: string;
};

export interface IModulesFetched {
  value: string;
  label: string;
  additionalValues: Array<string>;
}

function ReportViewerContainer() {
  const router = useRouter();
  const { id } = router.query;
  const [fieldsList, setFieldsList] = React.useState<
    ICustomField[] | undefined
  >(undefined);
  const [reportFields, setReportFields] = React.useState<
    ICustomField[] | undefined
  >(undefined);
  const [saveBypass, setSaveBypass] = React.useState(false);
  const [reportFile, setReportFile] = React.useState<Rdl.Report | null>(null);
  const [getCrmData] = useCrmFetchLazyQuery({
    fetchPolicy: "no-cache",
  });
  const [noDataPostParamFilter, setNoDataPostParamFilter] = React.useState<
    boolean | undefined
  >(undefined);
  const [userData, setUserData] = React.useState<IUserPreference[]>([]);
  const [reportData, setReportData] = React.useState<any[]>();
  const [filteredParameterData, setFilteredParameterData] = React.useState<
    any[]
  >([]);

  const [modulesFetched, setModulesFetched] = React.useState<IModulesFetched[]>(
    []
  );
  const [layoutFieldsFetched, setLayoutFieldsFetched] = React.useState<{
    [moduleName: string]: ICustomField[];
  }>();

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const [getModule] = useLazyQuery<FetchData<IModuleMetadata>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
    }
  );

  React.useEffect(() => {
    const handleModuleFetch = async () => {
      await getModule({
        variables: {
          modelName: "Module",
          fields: ["id", "name", "label", "customizationAllowed", "order"],
          filters: [],
        },
      })
        .then(async (responseOnCompletion) => {
          if (
            responseOnCompletion?.data?.fetch?.data &&
            responseOnCompletion?.data?.fetch?.data?.length > 0
          ) {
            let moduleInfo: IModuleMetadata[] = [
              ...responseOnCompletion?.data?.fetch?.data
                ?.map((model) => {
                  if (model.customizationAllowed === true) return model;
                })
                ?.filter((model) => model !== undefined),
            ];
            await getLayout({
              variables: {
                modelName: "Layout",
                fields: [
                  "id",
                  "name",
                  "moduleName",
                  "layout",
                  "config",
                  "type",
                ],
                filters: [
                  {
                    name: "moduleName",
                    operator: "in",
                    value: [
                      ...moduleInfo
                        ?.filter(
                          (module: IModuleMetadata) =>
                            module.customizationAllowed
                        )
                        ?.map((module: IModuleMetadata) => module.name),
                      "note",
                      "attachment",
                    ],
                  },
                ],
              },
            })
              .then((responseOnCompletion) => {
                if (
                  responseOnCompletion?.data?.fetch?.data &&
                  responseOnCompletion?.data?.fetch?.data?.length > 0
                ) {
                  let modulesFetched: {
                    value: string;
                    label: string;
                    additionalValues: string[];
                  }[] = [];
                  let layoutFieldsFetched: {
                    [moduleName: string]: ICustomField[];
                  } = {};
                  responseOnCompletion?.data?.fetch?.data?.forEach(
                    (layout: ILayout) => {
                      layoutFieldsFetched[layout.moduleName] =
                        layout.config?.fields ?? [];
                      modulesFetched = [
                        ...moduleInfo
                          .map((module) => {
                            return {
                              name: module.name,
                              label: module.label.en,
                              searchBy: module
                                ? evaluateDisplayExpression(
                                    getFieldsFromDisplayExpression(
                                      module?.displayExpression ?? "${name}"
                                    ),
                                    layout?.config?.fields || []
                                  )
                                : ["name"],
                            };
                          })
                          .map(relatedLookupMapper),
                      ];
                    }
                  );
                  setModulesFetched([...modulesFetched]);
                  setLayoutFieldsFetched({ ...layoutFieldsFetched });
                } else if (
                  responseOnCompletion?.data?.fetch?.messageKey?.includes(
                    "-success"
                  )
                ) {
                  setModulesFetched([
                    ...moduleInfo
                      .map((module) => {
                        return {
                          name: module.name,
                          label: module.label.en,
                          searchBy: ["name"],
                        };
                      })
                      .map(relatedLookupMapper),
                  ]);
                } else {
                }
              })
              .catch((error) => {});
          } else if (
            responseOnCompletion?.data?.fetch?.messageKey?.includes("-success")
          ) {
          } else if (
            responseOnCompletion?.data?.fetch?.messageKey?.includes(
              "requires-view"
            )
          ) {
          } else {
          }
        })
        .catch((error) => {});
    };
    handleModuleFetch();
  }, []);

  //------------------------------ richText start ------------------------------
  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const noteSuggestions = getNoteSuggestions(getSearchResults);
  const extensions = getTiptapExtensions(true, noteSuggestions);
  const editor = useEditor({
    extensions: [
      ...extensions,
      Link.configure({
        protocols: ["ftp", "mailto"],
        autolink: false,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "my-custom-class",
        },
      }),
    ],
    editable: false,
  });
  //------------------------------ richText end ------------------------------

  const allDataFetch = async (
    variables: any,
    pageNo: number,
    collectedData: any[]
  ): Promise<any[]> => {
    async function dataFetch(variables: any) {
      let data: any;
      data = await getCrmData(variables).then((result) => {
        if (result?.data?.fetch?.data) {
          return result?.data?.fetch?.data;
        } else {
          toast.error(result?.data?.fetch?.message);
        }
      });
      if (data) {
        collectedData = [...collectedData, ...data];
      }
      return data;
    }
    async function recursiveFetch(variables: any, pageNo: number) {
      const data = await dataFetch({
        variables: { ...variables, pageNumber: pageNo },
      });
      if (data?.length) {
        return true;
      }
      return false;
    }
    const callAgain = await recursiveFetch(variables, pageNo);
    if (!callAgain) {
      return collectedData;
    }
    return [...(await allDataFetch(variables, ++pageNo, collectedData))];
  };

  //user-fetch:start--------------------------------------------------------------
  const [pageNoActive, setPageNoActive] = React.useState(1);

  const [fetchUsers] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        const newPageNumber = pageNoActive + 1;
        setUserData([...userData, ...responseOnCompletion.fetch.data]);
        setPageNoActive(newPageNumber);
        recursionFetchActiveCall(newPageNumber);
        return;
      }
      // setFetchAllPermission(fetchedAllPermission + 1);
    },
  });

  const recursionFetchActiveCall = (pageNoActive: number) => {
    fetchUsers({
      variables: {
        modelName: "User",
        pageNumber: pageNoActive,
        fields: ["id", "firstName", "lastName"],
        filters: [
          {
            name: "recordStatus",
            operator: "in",
            value: ["a", "d", "i"],
          },
        ],
      },
    });
  };

  React.useEffect(() => {
    recursionFetchActiveCall(1);
  }, []);
  //user-fetch:end-----------------------------------------------------------------

  const settingReportData = (
    connection: Rdl.ConnectionProperties,
    updatedReportData: any[]
  ) => {
    if (updatedReportData && updatedReportData.length > 0) {
      connection.ConnectString =
        "jsondata=" + JSON.stringify(updatedReportData);
      setNoDataPostParamFilter(false);
      setSaveBypass(true);
    } else {
      connection.ConnectString = "jsondata=" + JSON.stringify({});
      setNoDataPostParamFilter(true);
      setSaveBypass(true);
    }
  };

  React.useEffect(() => {
    if (
      reportFile &&
      reportFile?.DataSets?.length &&
      layoutFieldsFetched &&
      Object.keys(layoutFieldsFetched)?.length > 0
    ) {
      let fieldsListFromStore =
        layoutFieldsFetched[reportFile.DataSets[0].Name];

      if (!fieldsListFromStore?.length) {
        toast.error("No layout data found");
        return;
      }
      if (fieldsListFromStore?.length && reportFile?.ReportParameters) {
        const fList: ICustomField[] = [];
        let fieldSet = getSortedFieldList(fieldsListFromStore);
        reportFile.ReportParameters.forEach((parameter) => {
          fieldSet.forEach((field: ICustomField) => {
            if (parameter.Name === field.name) {
              fList.push(field);
            }
          });
        });
        setReportFields(fList);
        setFieldsList(fieldSet);
      } else if (fieldsListFromStore?.length && reportFile) {
        let fieldSet = getSortedFieldList(fieldsListFromStore);
        setFieldsList(fieldSet);
      } else {
        updateFieldsListDataTypeForFilters(
          getSortedFieldList(fieldsListFromStore)
        );
        toast.error("Error fetching modules. Please contact admin.");
      }
    }
  }, [reportFile, layoutFieldsFetched]);

  React.useEffect(() => {
    if (reportFile?.DataSources && reportData?.length) {
      const connection = reportFile.DataSources[0].ConnectionProperties;
      if (!connection) {
        return;
      }
      settingReportData(connection, reportData);
    }
  }, [reportData]);

  return (
    <ReportViewerContent
      id={id}
      reportFile={reportFile}
      saveBypass={saveBypass}
      fieldsList={fieldsList}
      reportFields={reportFields}
      noDataPostParamFilter={noDataPostParamFilter}
      filteredParameterData={filteredParameterData}
      userData={userData}
      modulesFetched={modulesFetched}
      setReportData={(value: any[]) => setReportData(value)}
      setFilteredParameterData={(value: any[]) =>
        setFilteredParameterData(value)
      }
      setReportFile={(value: Rdl.Report | null) => setReportFile(value)}
      allDataFetch={allDataFetch}
      editor={editor}
    />
  );
}
export default observer(ReportViewerContainer);
