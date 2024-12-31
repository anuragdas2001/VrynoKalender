import {
  fetchModelData,
  fetchModelDataWithinQueryGenerator,
} from "../../../../../../graphql/queries/modelFetch";
import { ICustomField } from "../../../../../../models/ICustomField";
import { getVisibleModuleFieldsArray } from "../../../shared/utils/getFieldsArray";

type FetchFormDataHelperProps = {
  fieldsList: ICustomField[];
  modelName: string;
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
};

export const getFormVariables = (id: string) => {
  return {
    filters: [
      { operator: "eq", name: "id", value: id?.toString() || "" },
      { name: "recordStatus", operator: "in", value: ["a", "i"] },
    ],
    orderBy: [{ name: "updatedAt", order: ["ASC"] }],
    options: {
      unmask: true,
    },
  };
};

export const fetchFormDataHelper = ({
  fieldsList,
  modelName,
  subFormFieldsListDict,
}: FetchFormDataHelperProps) => {
  const subFormAsActivityModule = fieldsList.filter(
    (field) =>
      field.dataType === "multiSelectRecordLookup" &&
      field.visible &&
      field.dataTypeMetadata?.isSubform
  );

  const withFieldsData =
    fieldsList
      .filter(
        (field) =>
          field.dataType === "multiSelectRecordLookup" &&
          field.visible &&
          field.dataTypeMetadata?.isSubform &&
          subFormFieldsListDict?.[field.name]?.fieldsList?.length
      )
      ?.map((field) => {
        return `${fetchModelDataWithinQueryGenerator(
          field.name,
          getVisibleModuleFieldsArray(
            subFormFieldsListDict?.[field.name]?.fieldsList,
            subFormFieldsListDict?.[field.name]?.modelName,
            true
          ),
          subFormAsActivityModule?.length ? {} : {}
        )}`;
      })
      .filter((f) => f) || [];

  const getDataByIdQuery = fetchModelData(
    modelName,
    withFieldsData?.length
      ? [
          ...getVisibleModuleFieldsArray(fieldsList, modelName, true),
          `with { ${withFieldsData.join(" ")} }`,
        ]
      : getVisibleModuleFieldsArray(fieldsList, modelName, true),
    subFormAsActivityModule?.length ? {} : {}
  );
  return getDataByIdQuery;
};
