import { Rdl } from "@mescius/activereportsjs/lib/ar-js-core";
import { PageLoader } from "../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { ICustomField } from "../../../models/ICustomField";
import { IReportsParameters } from "./ReportViewerContainer";
import { ReportViewTabContainer } from "./ViewTabs/ReportViewTabContainer";
import { ReportViewer as ActiveReportViewer } from "./Viewer/ReportViewer";
import { getExportsSettings } from "./reportHelperFunctions";
import { hasParameter } from "./reportViewerHelper";
import { ICriteriaFilterRow } from "../../../models/shared";

export const ReportViewerContentScreen = ({
  id,
  errorMsg,
  doneLoading,
  reportFile,
  saveBypass,
  fieldsList,
  reportFields,
  handleReportSubmit,
  noDataPostParamFilter,
  filteredParameterData,
  conditionList,
  setConditionList,
  reportCreatedById,
}: {
  id: string | string[] | undefined;
  errorMsg: string;
  doneLoading: boolean;
  reportFile: Rdl.Report | null;
  saveBypass: boolean;
  fieldsList: ICustomField[] | undefined;
  reportFields: ICustomField[] | undefined;
  handleReportSubmit: (
    values: Record<string, string> | string,
    type: "filterValues" | "viewId"
  ) => void;
  noDataPostParamFilter: boolean | undefined;
  filteredParameterData: any[];
  conditionList: ICriteriaFilterRow[];
  setConditionList: (value: any[]) => void;
  reportCreatedById: string | null;
}) => {
  if (errorMsg) {
    return (
      <div className={"flex items-center justify-center h-screen text-xl"}>
        {errorMsg}
      </div>
    );
  }

  if (!doneLoading) {
    return (
      <div className={"flex items-center justify-center h-screen text-xl"}>
        <PageLoader />
      </div>
    );
  }

  if (!reportFile) {
    return (
      <div className="flex items-center justify-center h-screen">
        No report file
      </div>
    );
  }

  if (!reportFile.DataSets) {
    return (
      <div className="h-screen">
        <ActiveReportViewer
          reportFile={reportFile}
          reportParams={[]}
          exportsSettings={getExportsSettings(reportFile)}
          availableExports={["pdf", "tabular-data"]}
          sidebarVisible={true}
        />
      </div>
    );
  }

  if (!saveBypass && fieldsList) {
    return (
      <ReportViewTabContainer
        parameters={
          reportFields
            ? (reportFile.ReportParameters?.map((reportParam) => {
                let data = {};
                reportFields.map((field) => {
                  if (
                    field.name === reportParam.Name &&
                    !["richText", "relatedTo"].includes(field.dataType)
                  ) {
                    data = { ...reportParam, Label: field.label.en };
                  }
                });
                return data;
              }) as IReportsParameters[])
            : null
        }
        // parameters={reportFile.ReportParameters}
        moduleName={reportFile.DataSets ? reportFile.DataSets[0].Name : ""}
        handleReportSubmit={handleReportSubmit}
        reportFields={reportFields?.filter(
          (field) => !["richText", "relatedTo"].includes(field.dataType)
        )}
        hasParameter={hasParameter(reportFile ? reportFile : {}) ? true : false}
        id={id as string}
        conditionList={conditionList}
        setConditionList={setConditionList}
        reportCreatedById={reportCreatedById}
      />
    );
  }
  if (noDataPostParamFilter) {
    return (
      <div className="flex items-center justify-center h-screen">
        No Data Found
      </div>
    );
  }

  if (noDataPostParamFilter === undefined) {
    return (
      <div className={"flex items-center justify-center h-screen text-xl"}>
        <PageLoader />
      </div>
    );
  }
  return (
    <div className="h-screen">
      <ActiveReportViewer
        reportFile={reportFile}
        reportParams={filteredParameterData}
        exportsSettings={getExportsSettings(reportFile)}
        availableExports={["pdf", "tabular-data"]}
        sidebarVisible={true}
      />
    </div>
  );
};
