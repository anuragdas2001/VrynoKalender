import React from "react";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FormikState, FormikValues, useFormikContext } from "formik";
import { datatypeOperatorDictUpdated } from "../../../../../../shared/datatypeOperatorDict";
import { CustomViewConditionsFilterContainer } from "../../../../crm/generic/GenericAddCustomView/CustomViewConditionsFilterContainer";
import {
  ICriteriaFilterRow,
  IUserPreference,
} from "../../../../../../models/shared";

export type ExecuteWhenFieldListProps = {
  fieldsList: ICustomField[];
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  conditionList: ICriteriaFilterRow[];
  resetForm: (
    nextState?: Partial<FormikState<FormikValues>> | undefined
  ) => void;
  userPreferences: IUserPreference[];
};

export const ExecuteWhenFieldList = ({
  fieldsList,
  setConditionList,
  conditionList,
  resetForm,
  userPreferences,
}: ExecuteWhenFieldListProps) => {
  const { values } = useFormikContext<FormikValues>();
  return fieldsList?.length > 0 ? (
    <CustomViewConditionsFilterContainer
      resetForm={resetForm}
      conditionList={conditionList}
      setConditionList={setConditionList}
      fieldsList={fieldsList.filter(
        (field) =>
          field.visible === true &&
          field.dataType in datatypeOperatorDictUpdated
      )}
      modelName={values["moduleName"]}
      editMode={true}
      convertToBoolean={true}
      uniqueCustomName={"WFExecute"}
      datatypeOperatorDict={datatypeOperatorDictUpdated}
      excludedName={["specifiedFieldCondition"]}
      userPreferences={userPreferences}
    />
  ) : (
    <></>
  );
};
