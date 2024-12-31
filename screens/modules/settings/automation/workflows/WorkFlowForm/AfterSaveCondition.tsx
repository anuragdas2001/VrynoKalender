import React from "react";
import { FormikValues, useFormikContext } from "formik";
import { DetailFieldValuePerDatatype } from "../../../../crm/shared/components/ReadOnly/DetailFieldValuePerDatatype";
import EditBoxLineIcon from "remixicon-react/EditBoxLineIcon";
import { RenderWorkflowCondition } from "./RenderWorkflowCondition";
import { ICustomField } from "../../../../../../models/ICustomField";
import { ICriteriaFilterRow } from "../../../../../../models/shared";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";

export type AfterSaveConditionProps = {
  fieldsList: ICustomField[];
  setSavedConditionOn: (value: boolean) => void;
  executeOn: string;
  moduleLabel: string;
  conditionList: ICriteriaFilterRow[];
  uniqueCustomName: string;
};

export const AfterSaveCondition = ({
  fieldsList,
  setSavedConditionOn,
  executeOn,
  moduleLabel,
  conditionList,
  uniqueCustomName,
}: AfterSaveConditionProps) => {
  const { values } = useFormikContext<FormikValues>();

  return (
    <div className="bg-white rounded-lg w-full p-6">
      <div className="flex m-4 gap-x-4 items-center">
        <span className="text-vryno-icon">
          {executeOn === "all" ? (
            <span className="text-sm">All {moduleLabel}</span>
          ) : (
            <RenderWorkflowCondition
              conditionList={conditionList}
              fieldsList={fieldsList}
              uniqueCustomName={uniqueCustomName}
              conditionListName={"conditionList"}
            />
          )}
        </span>
        <Button
          id="condition-after-save-edit"
          customStyle="w-8 h-8 rounded-full bg-vryno-theme-blue flex items-center justify-center cursor-pointer"
          onClick={() => setSavedConditionOn(false)}
          userEventName="condition-after-save-edit:action-click"
        >
          <EditBoxLineIcon size={18} color="white" />
        </Button>
      </div>
    </div>
  );
};
