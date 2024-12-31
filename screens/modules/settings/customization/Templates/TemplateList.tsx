import React from "react";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../components/TailwindControls/Lists/GenericList";
import { IEmailTemplate } from "../../../../../models/shared";

export type TemplateListProps = {
  data: IEmailTemplate[];
  tableHeaders: Array<GenericListHeaderType>;
  modelName: string;
  filterValue: string;
};

export const TemplateList = ({
  data,
  tableHeaders,
  modelName,
  filterValue,
}: TemplateListProps) => {
  return (
    <GenericList
      data={data}
      tableHeaders={tableHeaders}
      listSelector={false}
      filterValue={filterValue}
    ></GenericList>
  );
};
