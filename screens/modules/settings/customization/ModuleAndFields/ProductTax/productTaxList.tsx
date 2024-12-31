import React from "react";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../../components/TailwindControls/Lists/GenericList";

export type ProductTaxListProps = {
  data: any[];
  tableHeaders: Array<GenericListHeaderType>;
  modelName: string;
};

export const ProductTaxList = ({
  data,
  tableHeaders,
  modelName,
}: ProductTaxListProps) => {
  return (
    <GenericList
      data={data}
      tableHeaders={tableHeaders}
      listSelector={false}
    ></GenericList>
  );
};
