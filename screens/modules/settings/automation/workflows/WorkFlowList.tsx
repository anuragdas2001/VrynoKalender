import React from "react";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../components/TailwindControls/Lists/GenericList";
import { IWorkflowRule } from "../../../../../models/shared";

export type WorkFlowListProps = {
  data: IWorkflowRule[];
  tableHeaders: Array<GenericListHeaderType>;
  modelName: string;
  filterValue: string;
};

export const WorkFlowList = ({
  data,
  tableHeaders,
  filterValue,
}: WorkFlowListProps) => {
  return (
    <GenericList
      data={data}
      tableHeaders={tableHeaders}
      listSelector={false}
      filterValue={filterValue}
    />
  );
};
