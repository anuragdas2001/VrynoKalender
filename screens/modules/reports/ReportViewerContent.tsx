import React from "react";
import { toast } from "react-toastify";
import { camelCase } from "change-case";
import { useLazyQuery } from "@apollo/client";
import { IReport } from "../../../models/IReport";
import { Config } from "../../../shared/constants";
import { ICriteriaFilterRow } from "../../../models/shared";
import { UserStoreContext } from "../../../stores/UserStore";
import { Rdl } from "@mescius/activereportsjs/lib/ar-js-core";
import { FETCH_QUERY } from "../../../graphql/queries/fetchQuery";
import { useCrmFetchLazyQuery } from "../crm/shared/utils/operations";
import { ReportViewerContentScreen } from "./ReportViewerContentScreen";
import { reportViewerDataGenerator } from "./DataGenerators/reportViewerDataGenerator";
import { fetchGatewayFile } from "../../../components/TailwindControls/Extras/fetchGatewayFile";
import { PageLoader } from "../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  IReportViewerContent,
  reportFilterGenerator,
} from "./reportViewerHelper";
import { GeneralStoreContext } from "../../../stores/RootStore/GeneralStore/GeneralStore";

export const ReportViewerContent = ({
  id,
  reportFile,
  saveBypass,
  fieldsList,
  reportFields,
  noDataPostParamFilter,
  filteredParameterData,
  userData,
  modulesFetched,
  setReportData,
  setFilteredParameterData,
  setReportFile,
  allDataFetch,
  editor,
}: IReportViewerContent) => {
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels } = generalModelStore;
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const [getReportById] = useCrmFetchLazyQuery<IReport>({
    fetchPolicy: "no-cache",
  });
  const [requestedFields, setRequestedFields] = React.useState([]);
  const [paramValues, setParamValues] = React.useState<Record<
    string,
    string
  > | null>(null);
  const [customViewId, setCustomViewId] = React.useState<string | null>(null);
  const [doneLoading, setDoneLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [reportDataLoading, setReportDataLoading] = React.useState(false);
  const [submitType, setSubmitType] = React.useState<"filterValues" | "viewId">(
    "filterValues"
  );
  const [reportCreatedById, setReportCreatedById] = React.useState<
    string | null
  >(null);

  const [conditionList, setConditionList] = React.useState<
    ICriteriaFilterRow[]
  >([{ fieldName: "", value: "" }]);

  const handleReportSubmit = (
    values: Record<string, string> | string,
    type: "filterValues" | "viewId"
  ) => {
    setReportDataLoading(true);
    if (type === "filterValues" && typeof values === "object") {
      setSubmitType("filterValues");
      setParamValues(values);
      setCustomViewId(null);
    }
    if (type === "viewId" && typeof values === "string") {
      setSubmitType("viewId");
      setCustomViewId(values);
      setParamValues(null);
    }
  };

  const fetchReportFile = async (
    report: IReport
  ): Promise<Rdl.Report | null> => {
    return await fetchGatewayFile(
      `${Config.metaPrivateUploadUrl()}crm/report/${report?.fileKey}`
    );
  };

  const getReport = async () => {
    const report = await getReportById({
      variables: {
        modelName: "report",
        fields: ["id", "name", "fileKey", "createdBy"],
        filters: [
          { name: "id", operator: "eq", value: [id as string] },
          { name: "recordStatus", operator: "in", value: ["a", "i"] },
        ],
      },
    });
    setReportCreatedById(report?.data?.fetch?.data[0]?.createdBy ?? null);
    if (!report?.data?.fetch?.data?.length) {
      setDoneLoading(true);
      setErrorMsg("Report not found");
      return;
    }
    const reportFile: any = await fetchReportFile(
      report?.data?.fetch?.data[0] as IReport
    );
    let requestedFieldsName = [];
    if (reportFile?.DataSets) {
      requestedFieldsName = reportFile?.DataSets[0].Fields.map((val: any) =>
        val.DataField.includes("fields.")
          ? val.DataField.split(".")[1]
          : val.DataField
      );
    }
    setReportFile(reportFile);
    setRequestedFields(requestedFieldsName);
    setDoneLoading(true);
  };

  const getServiceData = async (value: any) => {
    if (!value?.DataSets) {
      return { data: [], error: "No dataset found" };
    }
    let filterValues: any[] = [];
    if (paramValues) {
      if (paramValues?.expression.split(" ").includes("undefined")) {
        return { data: [], error: "Please select logical operator" };
      }
      const filterData = reportFilterGenerator(
        paramValues,
        fieldsList,
        conditionList
      );
      if (!filterData) {
        return { data: [], error: "" };
      }
      filterValues = filterData;
    }

    const variables: any[] = await Promise.all(
      value?.DataSets?.map(async (obj: any) => {
        return {
          customViewId: customViewId || null,
          modelName: camelCase(obj.Name),
          pageNumber: 1,
          fields: customViewId
            ? []
            : obj.Fields.map((field: any) => {
                return field.DataField;
              }),
          filters:
            value.ReportParameters && paramValues
              ? [
                  ...filterValues,
                  { name: "recordStatus", operator: "in", value: ["a", "i"] },
                ]
              : [{ name: "recordStatus", operator: "in", value: ["a", "i"] }],
          expression: paramValues?.expression || null,
        };
      })
    );
    const data = await allDataFetch(variables[0], 1, []);
    const resetFetchDependencies = () => {
      setSubmitType("filterValues");
      setCustomViewId(null);
      setParamValues(null);
    };
    if (data.length) {
      resetFetchDependencies();
      return { data: data, error: "" };
    }
    resetFetchDependencies();
    return { data: [], error: "Data doesn't exist. Please check values." };
  };

  const [getCrmListData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  async function populateReportWithData(
    repoFile: Rdl.Report | null,
    bypass: boolean | undefined,
    requestedFieldsName?: string[]
  ) {
    if (!repoFile || bypass) {
      setReportDataLoading(false);
      return;
    }
    const { data: reportData, error } =
      (await getServiceData(repoFile)) || null;
    if (!reportData?.length) {
      error.length && toast.error(error);
      setReportDataLoading(false);
      return;
    }
    const report = repoFile;
    if (
      report.DataSources &&
      report.DataSources.length > 0 &&
      fieldsList &&
      requestedFieldsName
    ) {
      const dataSource = report?.DataSources[0];
      if (!dataSource) {
        setReportDataLoading(false);
        return;
      }
      let updatedReportData = [...reportData];
      for (let i = 0; i < fieldsList?.length; i++) {
        const field = fieldsList[i];
        for (let j = 0; j < requestedFieldsName?.length; j++) {
          const rqField = requestedFieldsName[j];
          if (
            (field.name === rqField &&
              field.dataTypeMetadata &&
              [
                "lookup",
                "recordLookup",
                "multiSelectLookup",
                "multiSelectRecordLookup",
              ].includes(field.dataType)) ||
            (field.name === rqField &&
              ["relatedTo", "richText"].includes(field.dataType))
          ) {
            updatedReportData = await reportViewerDataGenerator[field.dataType](
              updatedReportData,
              field,
              user,
              userData,
              modulesFetched,
              getCrmListData,
              editor,
              fieldsList,
              genericModels
            );
          }
        }
      }
      let parameterDataDict: any = {};
      repoFile?.ReportParameters?.forEach((parameter) => {
        const key = parameter.Name;
        const value = paramValues ? paramValues[parameter.Name] : "";
        if (paramValues && !parameterDataDict[value]) {
          let allowMutation = false;
          for (let i = 0; i < fieldsList?.length; i++) {
            const field = fieldsList[i];
            if (
              field.name === key &&
              ["lookup", "recordLookup"].includes(field.dataType)
            ) {
              allowMutation = true;
              break;
            }
          }
          if (allowMutation) {
            let dataId = "";
            for (let i = 0; i < reportData.length; i++) {
              if (reportData[i][key] && reportData[i][key] === value) {
                dataId = reportData[i].id;
                break;
              }
            }
            if (dataId?.length) {
              let data = "";
              for (let i = 0; i < updatedReportData.length; i++) {
                if (updatedReportData[i].id === dataId) {
                  data = updatedReportData[i][key];
                  break;
                }
              }
              parameterDataDict = { ...parameterDataDict, [value]: data };
            }
          }
        }
      });
      if (paramValues) {
        let filterParameterData: any = [];
        filterParameterData = reportFile?.ReportParameters?.map((k) => ({
          Name: k.Name,
          Value:
            Object.keys(parameterDataDict).length &&
            parameterDataDict[paramValues[k.Name]]
              ? [parameterDataDict[paramValues[k.Name]]]
              : "value",
        }));
        setFilteredParameterData(filterParameterData);
      }
      if (submitType === "viewId")
        setReportFile({ ...reportFile, ReportParameters: undefined });
      // console.log("updatedReportData", updatedReportData);
      setReportData(updatedReportData);
      setReportDataLoading(false);
    }
  }

  React.useEffect(() => {
    if (id && !reportFile) {
      getReport();
    }
    if (!paramValues && !customViewId) return;
    if (
      reportFile &&
      // hasParameter(reportFile) &&
      fieldsList?.length &&
      requestedFields.length
    ) {
      populateReportWithData(reportFile, false, requestedFields);
    }
  }, [id, paramValues, customViewId]);

  return reportDataLoading ? (
    <div className="flex items-center justify-center h-screen text-xl">
      <PageLoader />
    </div>
  ) : (
    <ReportViewerContentScreen
      id={id}
      errorMsg={errorMsg}
      doneLoading={doneLoading}
      reportFile={reportFile}
      saveBypass={saveBypass}
      fieldsList={fieldsList}
      reportFields={reportFields}
      handleReportSubmit={handleReportSubmit}
      noDataPostParamFilter={noDataPostParamFilter}
      filteredParameterData={filteredParameterData}
      conditionList={conditionList}
      setConditionList={(value: any[]) => setConditionList(value)}
      reportCreatedById={reportCreatedById}
    />
  );
};
