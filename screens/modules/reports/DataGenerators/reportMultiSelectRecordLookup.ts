import {
  LazyQueryResult,
  OperationVariables,
  QueryLazyOptions,
} from "@apollo/client";
import { User } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";
import { IUserPreference } from "../../../../models/shared";
import { IModulesFetched } from "../ReportViewerContainer";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../crm/shared/utils/getFieldsFromDisplayExpression";
import { variableGenerator } from "../reportViewerHelper";
import { checkIfValidUUID } from "../../crm/shared/utils/getSettingsPathParts";
import { IGenericModel } from "../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { getDataObjectArray } from "../../crm/shared/utils/getDataObject";
import { Editor } from "@tiptap/react";

export const reportMultiSelectRecordLookup = async function (
  updatedReportData: any[],
  field: ICustomField,
  user: User | null,
  userData: IUserPreference[],
  modulesFetched: IModulesFetched[],
  getCrmListData: (
    options?: QueryLazyOptions<OperationVariables> | undefined
  ) => Promise<LazyQueryResult<any, OperationVariables>>,
  editor: Editor | null,
  fieldsList: ICustomField[],
  genericModels: IGenericModel
) {
  const fieldName = field.systemDefined ? field.name : `fields.${field.name}`;
  if (
    field?.dataTypeMetadata?.allLookups[0].moduleName.split(".")[0] ===
    "accounts"
  ) {
    updatedReportData = updatedReportData.flatMap((data) => {
      let result: any = [];
      let dataResult: string = "";
      if (data[fieldName] && data[fieldName].length > 0) {
        data[fieldName].map((value: string | any, index: number) => {
          let findIndex = userData.findIndex((user) => user.id === value);
          if (findIndex !== -1) {
            let name = `${
              userData[findIndex].firstName ? userData[findIndex].firstName : ""
            } ${
              userData[findIndex].lastName ? userData[findIndex].lastName : ""
            }`.trim();
            name = name.length ? name : value;
            dataResult = dataResult + name + ",";
          }
        });
      }
      if (dataResult?.length) {
        result.push({ ...data, [fieldName]: dataResult });
      }
      if (result.length) {
        return result;
      }
      return data;
    });
    return updatedReportData;
  } else if (
    field?.dataTypeMetadata?.allLookups[0].moduleName.split(".")[0] === "crm"
  ) {
    const requestedFields = evaluateDisplayExpression(
      getFieldsFromDisplayExpression(
        field.dataTypeMetadata?.allLookups[0]?.displayExpression
      ),
      genericModels[
        field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
      ]?.layouts?.[0]?.config?.fields || [],
      true
    );

    const filterIdSet: Set<string> = new Set();
    updatedReportData.forEach((value) => {
      if (value[fieldName] && value[fieldName]?.length > 0) {
        value[fieldName].forEach((recordId: any) => {
          if (checkIfValidUUID(recordId)) filterIdSet.add(recordId);
        });
      }
    });
    if (!filterIdSet?.size) return updatedReportData;
    let pageNumber = 1;
    const recursionRecordLookup = async (pageNumber: number) => {
      return new Promise(async (resolve) => {
        await getCrmListData({
          variables: field?.dataTypeMetadata?.allLookups[0].moduleName
            .split(".")[1]
            .includes("dealPipeline")
            ? variableGenerator(
                field.dataTypeMetadata?.allLookups[0].moduleName.split(".")[1],
                field.dataTypeMetadata?.allLookups[0].fieldName,
                "id",
                "in",
                Array.from(filterIdSet),
                pageNumber
              )
            : variableGenerator(
                field.dataTypeMetadata?.allLookups[0].moduleName.split(".")[1],
                ["all-fields"],
                "id",
                "in",
                Array.from(filterIdSet),
                pageNumber
              ),
        }).then((response) => {
          if (
            response.data.fetch.messageKey.includes("-success") &&
            response.data.fetch.data.length
          ) {
            // const responseData = getDataObjectArray(response.data.fetch.data);
            const responseData = response.data.fetch.data;
            updatedReportData = updatedReportData.flatMap((data) => {
              let result: any = [];
              let dataResult: string = "";
              if (
                data[fieldName] &&
                Array.isArray(data[fieldName]) &&
                data[fieldName].length > 0
              ) {
                data[fieldName].map((value: string | any, index: number) => {
                  let findIndex = responseData.findIndex(
                    (resp: any) => resp.id === value
                  );
                  if (findIndex !== -1) {
                    const mappedData = `${requestedFields
                      .map((field) => responseData[findIndex][field])
                      .join(" ")
                      .trim()}`;
                    const value = mappedData?.length
                      ? mappedData
                      : responseData[findIndex]["name"];
                    dataResult = dataResult + value + ",";
                  }
                });
              }
              if (dataResult?.length) {
                result.push({ ...data, [fieldName]: dataResult });
              }
              if (result.length) {
                return result;
              }
              return data;
            });
            if (response.data.fetch.data.length === 50) {
              return resolve(recursionRecordLookup(++pageNumber));
            } else {
              return resolve("Request completed");
            }
          } else {
            return resolve("Request completed");
          }
        });
      });
    };
    await recursionRecordLookup(pageNumber);
    return updatedReportData;
  }
  return updatedReportData;
};
