import { ParameterVariant } from "@mescius/activereportsjs-react";
import React from "react";
import { useFormikContext } from "formik";
import { ICustomField } from "../../../../models/ICustomField";
import { datatypeOperatorDict } from "../../../../shared/datatypeOperatorDict";
import GenericHeaderCardContainer from "../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { IReportsParameters } from "../ReportViewerContainer";
import { CustomViewConditionsFilterContainer } from "../../crm/generic/GenericAddCustomView/CustomViewConditionsFilterContainer";
import { ICriteriaFilterRow, IUserPreference } from "../../../../models/shared";
import { updateFieldsListDataTypeForFilters } from "../../../layouts/GenericViewComponentMap";

export type ReportParameterValue = { Name: string; Value: ParameterVariant[] };

export function ReportParametersForm({
  parameters,
  moduleName,
  reportFields,
  conditionList,
  userPreferences,
  setConditionList,
}: {
  parameters: IReportsParameters[];
  moduleName: string;
  reportFields: ICustomField[];
  conditionList: ICriteriaFilterRow[];
  userPreferences: IUserPreference[];
  setConditionList: (value: any[]) => void;
}) {
  const { resetForm } = useFormikContext<Record<string, string>>();

  React.useEffect(() => {
    const newConditionList = [];
    for (const value of parameters) {
      newConditionList.push({ fieldName: value.Name, value: "" });
    }
    setConditionList(newConditionList);
  }, []);

  return (
    <div className="px-6 pt-5">
      <GenericHeaderCardContainer
        cardHeading={"Please select filters"}
        extended={true}
        allowOverflow={true}
      >
        <div className="sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-7/12 m-auto">
          <CustomViewConditionsFilterContainer
            resetForm={resetForm}
            conditionList={conditionList}
            setConditionList={setConditionList}
            fieldsList={updateFieldsListDataTypeForFilters(
              reportFields.filter(
                (field) =>
                  field.visible === true &&
                  field.dataType in datatypeOperatorDict
              )
            )}
            modelName={moduleName}
            editMode={true}
            convertToBoolean={true}
            uniqueCustomName={""}
            datatypeOperatorDict={datatypeOperatorDict}
            disableFieldSelect={true}
            disableFieldAdd={true}
            userPreferences={userPreferences}
          />
        </div>
      </GenericHeaderCardContainer>
    </div>
  );
}
