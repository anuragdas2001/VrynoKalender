import { useFormikContext } from "formik";
import { getField } from "../../../../crm/shared/utils/getField";
import { ICustomField } from "../../../../../../models/ICustomField";
import { ICriteriaFilterRow } from "../../../../../../models/shared";
import { DetailFieldValuePerDatatype } from "../../../../crm/shared/components/ReadOnly/DetailFieldValuePerDatatype";
import {
  datatypeExpressionsList,
  datatypeOperatorSymbolDict,
} from "../../../../../../shared/datatypeOperatorDict";

export const RenderWorkflowCondition = ({
  conditionList,
  fieldsList,
  uniqueCustomName,
  conditionListName,
}: {
  conditionList: ICriteriaFilterRow[];
  fieldsList: ICustomField[];
  uniqueCustomName: string;
  conditionListName: "specifiedFieldCondition" | "conditionList";
}) => {
  const { values } = useFormikContext<Record<string, any>>();

  return conditionList?.map((conditionField, index) => {
    const field = getField(
      fieldsList,
      conditionField[`fieldName${uniqueCustomName}`] as string
    );
    return (
      <span key={index} className="flex">
        {conditionField[`logicalOperatorNot${uniqueCustomName}`] === "NOT" && (
          <span className="text-sm text-vryno-theme-light-blue pr-4">NOT</span>
        )}
        <span className="text-sm">
          {
            fieldsList.filter((field) => {
              return (
                field.name === conditionField[`fieldName${uniqueCustomName}`]
              );
            })[0]?.label?.en
          }
        </span>
        <span className="px-2 text-vryno-theme-light-blue">
          {
            datatypeOperatorSymbolDict[
              conditionField[`operator${uniqueCustomName}${index}`] as string
            ]
          }
        </span>
        <span className="">
          {!conditionField[`fieldName${uniqueCustomName}`] ? (
            <></>
          ) : values[`operator${uniqueCustomName}${index}`]?.includes("pt_") ||
            values[`operator${uniqueCustomName}${index}`]?.includes("ft_") ? (
            <span className={`text-sm break-all`}>
              {values[`value${uniqueCustomName}${index}`]
                ? values[`value${uniqueCustomName}${index}`]
                : "-"}
            </span>
          ) : (
            <DetailFieldValuePerDatatype
              field={{
                label: field?.label?.en,
                value: field?.name,
                dataType: field?.dataType,
                field: field,
              }}
              data={
                datatypeExpressionsList.includes(
                  conditionField[
                    `operator${uniqueCustomName}${index}`
                  ] as string
                )
                  ? {
                      [conditionField[
                        `fieldName${uniqueCustomName}`
                      ] as string]: null,
                    }
                  : {
                      [conditionField[
                        `fieldName${uniqueCustomName}`
                      ] as string]:
                        conditionField[
                          `operator${uniqueCustomName}${index}`
                        ] === "ilike" && values[conditionListName][index]?.value
                          ? values[conditionListName][index]?.value.map(
                              (val: string) => val.slice(1, -1)
                            )
                          : conditionField[
                              `operator${uniqueCustomName}${index}`
                            ] === "stwth" &&
                            values[conditionListName][index]?.value
                          ? values[conditionListName][index]?.value.map(
                              (val: string) => val.slice(0, -1)
                            )
                          : conditionField[
                              `operator${uniqueCustomName}${index}`
                            ] === "endwth" &&
                            values[conditionListName][index]?.value
                          ? values[conditionListName][index]?.value.map(
                              (val: string) => val.slice(1)
                            )
                          : values[conditionListName][index]?.value &&
                            ![
                              "multiSelectLookup",
                              "multiSelectRecordLookup",
                            ].includes(field?.dataType)
                          ? values[conditionListName][index]?.value.toString()
                          : values[conditionListName][index]?.value,
                    }
              }
              headerVisible={false}
              onDetail={false}
              modelName={values["moduleName"]}
              isSample={false}
              fontSize={{
                header: "text-sm",
                value: "text-sm",
              }}
              fieldsList={fieldsList}
            />
          )}
        </span>
        {conditionField[`logicalOperator${uniqueCustomName}${index}`] ? (
          <span className="text-sm text-vryno-theme-light-blue px-4">
            {conditionField[`logicalOperator${uniqueCustomName}${index}`] || ""}
          </span>
        ) : (
          <></>
        )}
      </span>
    );
  });
};
