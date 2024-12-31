import {
  LazyQueryResult,
  OperationVariables,
  QueryLazyOptions,
} from "@apollo/client";
import { User } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";
import { IUserPreference } from "../../../../models/shared";
import { IModulesFetched } from "../ReportViewerContainer";
import { renderRelatedTo, variableGenerator } from "../reportViewerHelper";
import { checkIfValidUUID } from "../../crm/shared/utils/getSettingsPathParts";

export const reportRelatedTo = async (
  updatedReportData: any[],
  field: ICustomField,
  user: User | null,
  userData: IUserPreference[],
  modulesFetched: IModulesFetched[],
  getCrmListData: (
    options?: QueryLazyOptions<OperationVariables> | undefined
  ) => Promise<LazyQueryResult<any, OperationVariables>>
) => {
  try {
    let fetchRelatedPromise: any[] = [];
    let relatedToDict: Record<string, string> = {};
    for (const data of updatedReportData) {
      for (const record of data.relatedTo)
        if (!relatedToDict[record.recordId]) {
          relatedToDict = {
            ...relatedToDict,
            [record.recordId]: record.moduleName,
          };
        }
    }
    for (const relatedKey in relatedToDict) {
      if (relatedKey?.length && checkIfValidUUID(relatedKey)) {
        const response = await getCrmListData({
          variables: variableGenerator(
            relatedToDict[relatedKey],
            ["all-fields"],
            "id",
            "eq",
            [relatedKey]
          ),
        });
        if (response.data?.fetch?.data) {
          fetchRelatedPromise.push(response.data?.fetch?.data[0]);
        }
      }
    }
    await Promise.all(fetchRelatedPromise).then((result: any) => {
      updatedReportData = updatedReportData?.map((data) => {
        if (data?.relatedTo?.length) {
          return {
            ...data,
            relatedTo: renderRelatedTo(data.relatedTo, result, modulesFetched),
          };
        }
        return { ...data, relatedTo: "-" };
      });
    });
    return updatedReportData;
  } catch (error) {
    console.error(error);
    return updatedReportData;
  }
};
