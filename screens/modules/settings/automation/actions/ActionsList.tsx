import React from "react";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../components/TailwindControls/Lists/GenericList";
import { IWorkflowAction } from "../../../../../models/shared";

export type ActionsListProps = {
  data: IWorkflowAction[];
  tableHeaders: Array<GenericListHeaderType>;
  modelName: string;
  filterValue: string;
};

export const ActionsList = ({
  data,
  tableHeaders,
  filterValue,
}: ActionsListProps) => {
  return (
    <GenericList
      data={data}
      tableHeaders={tableHeaders}
      listSelector={false}
      filterValue={filterValue}
    />
  );
};
