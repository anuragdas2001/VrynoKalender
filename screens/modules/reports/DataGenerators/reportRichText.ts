import {
  LazyQueryResult,
  OperationVariables,
  QueryLazyOptions,
} from "@apollo/client";
import { User } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";
import { IUserPreference } from "../../../../models/shared";
import { IModulesFetched } from "../ReportViewerContainer";
import { parseContent } from "../reportViewerHelper";
import { Editor } from "@tiptap/react";

export const reportRichText = (
  updatedReportData: any[],
  field: ICustomField,
  user: User | null,
  userData: IUserPreference[],
  modulesFetched: IModulesFetched[],
  getCrmListData: (
    options?: QueryLazyOptions<OperationVariables> | undefined
  ) => Promise<LazyQueryResult<any, OperationVariables>>,
  editor: null | Editor
) => {
  updatedReportData = updatedReportData.flatMap((data) => {
    let result: any = [];
    const fieldName = field.systemDefined ? field.name : `fields.${field.name}`;
    if (data[fieldName]) {
      result.push({
        ...data,
        [fieldName]: parseContent(data[fieldName], editor),
      });
    }
    if (result.length) {
      return result;
    }
    return data;
  });
  return updatedReportData;
};
