import React, { ChangeEvent } from "react";
import { FormikValues, useFormikContext } from "formik";
import {
  ICriteriaFilterRow,
  ICustomView,
  ISharingRuleData,
  IUserPreference,
} from "../../../../../models/shared";
import { ICustomField } from "../../../../../models/ICustomField";
import { orderDropdown } from "./customViewHelpers/customViewShared";
import { CustomViewOrderByContainer } from "./CustomViewOrderByContainer";
import { datatypeOperatorDict } from "../../../../../shared/datatypeOperatorDict";
import { CustomViewConditionsFilterContainer } from "./CustomViewConditionsFilterContainer";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { RecordSharingCriteriaContainer } from "./RecordSharingCriteriaContainer";
import { User } from "../../../../../models/Accounts";

export type GenericAddCustomViewFiltersProps = {
  conditionList: ICriteriaFilterRow[];
  orderByList: Record<string, string>[];
  fieldsList: Array<ICustomField>;
  handleOrderByChange: (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void;
  handleOrderByAddClick: () => void;
  handleOrderByRemoveClick: (index: number) => void;
  resetOrderBy: () => void;
  modelName: string;
  editMode: boolean;
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  uniqueCustomName: string;
  moduleViewData: ICustomView | null;
  moduleViewSharingData: ISharingRuleData | null;
  id: string;
  userPreferences: IUserPreference[];
};

export const GenericAddCustomViewFilters = ({
  conditionList,
  orderByList,
  fieldsList,
  handleOrderByAddClick,
  handleOrderByChange,
  handleOrderByRemoveClick,
  resetOrderBy,
  modelName,
  editMode,
  setConditionList,
  uniqueCustomName,
  moduleViewData,
  moduleViewSharingData,
  id,
  userPreferences,
}: GenericAddCustomViewFiltersProps) => {
  const { resetForm } = useFormikContext<FormikValues>();
  return (
    <GenericHeaderCardContainer
      cardHeading="Specify Criteria"
      extended={true}
      marginBottom="mb-0"
    >
      <div className="h-full overflow-y-scroll">
        <CustomViewConditionsFilterContainer
          resetForm={resetForm}
          conditionList={conditionList}
          fieldsList={fieldsList.filter(
            (field) =>
              !["recordStatus", "layoutId"].includes(field.name) &&
              field.dataType in datatypeOperatorDict
          )}
          modelName={modelName}
          editMode={editMode}
          setConditionList={setConditionList}
          convertToBoolean={true}
          uniqueCustomName={uniqueCustomName}
          datatypeOperatorDict={datatypeOperatorDict}
          userPreferences={userPreferences}
        />
        <CustomViewOrderByContainer
          resetForm={resetForm}
          resetOrderBy={resetOrderBy}
          orderByList={orderByList}
          handleOrderByChange={handleOrderByChange}
          fieldsList={fieldsList}
          orderDropdown={orderDropdown}
          handleOrderByRemoveClick={handleOrderByRemoveClick}
          handleOrderByAddClick={handleOrderByAddClick}
        />
        <RecordSharingCriteriaContainer
          recordCreatedById={moduleViewData?.createdBy ?? null}
          editMode={id?.length ? true : false}
          moduleViewSharingData={moduleViewSharingData}
        />
      </div>
    </GenericHeaderCardContainer>
  );
};
export default GenericAddCustomViewFilters;
