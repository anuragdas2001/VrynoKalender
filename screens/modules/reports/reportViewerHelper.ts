import { Rdl } from "@mescius/activereportsjs/lib/ar-js-core";
import { ICustomField } from "../../../models/ICustomField";
import { ICriteriaFilterRow, IUserPreference } from "../../../models/shared";
import { IModulesFetched } from "./ReportViewerContainer";
import { Editor } from "@tiptap/react";
import {
  systemDefinedFieldExtractor,
  valueToConditionListMapper,
} from "../crm/generic/GenericAddCustomView/customViewHelpers/customViewSave";
import { customViewFilterGenerator } from "../crm/generic/GenericAddCustomView/customViewHelpers/customViewFilterGenerator";
import { toast } from "react-toastify";
import { getDataObjectArray } from "../crm/shared/utils/getDataObject";

export interface IReportViewerContent {
  id: string | string[] | undefined;
  reportFile: Rdl.Report | null;
  saveBypass: boolean;
  fieldsList: ICustomField[] | undefined;
  reportFields: ICustomField[] | undefined;
  noDataPostParamFilter: boolean | undefined;
  filteredParameterData: any[];
  userData: IUserPreference[];
  modulesFetched: IModulesFetched[];
  // setReportData: (value: Record<string, any[]>) => void;
  setReportData: (value: any[]) => void;
  setFilteredParameterData: (value: any[]) => void;
  setReportFile: (value: Rdl.Report | null) => void;
  allDataFetch: (
    variables: any,
    pageNo: number,
    collectedData: any[]
  ) => Promise<any[]>;
  editor: null | Editor;
}

export function parseContent(data: any, editor: null | Editor) {
  let parsedData: any = {};
  if (data) {
    try {
      var obj = JSON.parse(data);
      if (obj && typeof obj === "object") {
        parsedData = obj;
      }
    } catch (e) {
      parsedData = data;
    }
    if (editor?.commands) {
      editor?.commands?.setContent(parsedData);
      return editor?.getText();
    } else {
      let output = "";
      parsedData?.["content"].forEach((val: any, index: number) => {
        //To-Do: add recursion to iterate over nodes
        if (val.content[0].type === "text")
          output += `${index !== 0 ? "\n" : ""}` + val.content[0].text;
      });
      return output;
    }
  }
  return "";
  // if (data !== null && typeof data === "string") data = JSON.parse(data);
}

export function renderRelatedTo(
  data: any,
  result: any[],
  modulesFetched: {
    value: string;
    label: string;
    additionalValues: Array<string>;
  }[]
) {
  let output = "";
  data.forEach((relatedRecord: any) => {
    getDataObjectArray(result).forEach((val: any) => {
      if (relatedRecord.recordId === val.id) {
        output +=
          modulesFetched
            .filter((module) => relatedRecord.moduleName === module.value)[0]
            .additionalValues.map((field: string) => {
              // if (field.includes("custom")) {
              //   return val[`fields.${field}`];
              // }
              return val[field];
            })
            .join(" ")
            .trim() + ", ";
      }
    });
  });
  return output.slice(0, -2);
}

export function variableGenerator(
  modelName: string,
  fields: string[],
  name: string,
  operator: string,
  value: string[],
  pageNumber?: number
) {
  if (fields.length === 1 && fields[0] === "all-fields") {
    return {
      modelName: modelName || "",
      pageNumber: pageNumber,
      customViewId: "all-fields",
      fields: [],
      filters: [
        {
          name: name || "id",
          operator: operator,
          value: value,
        },
        {
          name: "recordStatus",
          operator: "in",
          value: ["a", "d"],
        },
      ],
    };
  } else {
    return {
      modelName: modelName || "",
      pageNumber: pageNumber,
      fields: fields.length ? [...fields] : [],
      filters: [
        {
          name: name || "id",
          operator: operator,
          value: value,
        },
        {
          name: "recordStatus",
          operator: "in",
          value: ["a", "d"],
        },
      ],
    };
  }
}

export function hasParameter(repoFile: Rdl.Report) {
  return repoFile.ReportParameters && repoFile.ReportParameters.length > 0;
}

export const reportFilterGenerator = (
  paramValues: Record<string, string>,
  fieldsList: ICustomField[] | undefined,
  conditionList: ICriteriaFilterRow[]
) => {
  if (!paramValues) {
    toast.error("No parameter values found");
    return false;
  }
  if (!fieldsList) {
    toast.error("No layout fields found");
    return false;
  }

  let updatedConditionList = [...conditionList];
  updatedConditionList = valueToConditionListMapper(
    conditionList,
    updatedConditionList,
    paramValues,
    ""
  );
  const processedFieldList = fieldsList
    .filter((field) => field.visible)
    .map((field: ICustomField) => {
      return {
        value: field.name,
        label: field.label["en"],
        dataType: field.dataType,
        systemDefined: field.systemDefined,
      };
    });

  let { filterData, filterCorrect } = customViewFilterGenerator(
    updatedConditionList,
    processedFieldList,
    ""
  );
  if (!filterCorrect) {
    toast.error("Filter values cannot be blank");
    return false;
  }
  let updatedFilterData: any = [];
  filterData.forEach((val) => {
    if (val?.name !== null) {
      let value = {};
      if (val?.logicalOperator === null) {
        value = {
          name: val?.name,
          operator: val?.operator,
          value: val?.value,
        };
      } else {
        value = val;
      }
      if (val?.metadata) {
        value = { ...value, metadata: val.metadata };
      }
      updatedFilterData.push(value);
    }
  });
  updatedFilterData = updatedFilterData.map((val: any) =>
    systemDefinedFieldExtractor(val, processedFieldList)
  );
  return updatedFilterData;
};
