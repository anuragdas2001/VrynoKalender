import React from "react";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import { FieldSupportedDataType } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { itemUrlGenerator } from "../../../../crm/shared/utils/itemUrlGenerator";

export type CustomizationModulesTableProps = {
  modulesFetched: Array<IModuleMetadata>;
  modulesTableHeaders: {
    columnName: string;
    label: string;
    dataType: FieldSupportedDataType;
  }[];
  filterValue?: string;
};

const CustomizationModulesTable = ({
  modulesFetched,
  modulesTableHeaders,
  filterValue,
}: CustomizationModulesTableProps) => {
  if (!modulesFetched) {
    return null;
  }
  return (
    <GenericList
      data={modulesFetched}
      tableHeaders={modulesTableHeaders}
      rowUrlGenerator={itemUrlGenerator}
      listSelector={false}
      showIcons={true}
      filterValue={filterValue}
    />
  );
};

export default CustomizationModulesTable;
