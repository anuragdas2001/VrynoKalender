import React from "react";
import { GenericListHeaderType } from "../Lists/GenericList";
import { SupportedLabelLocations } from "../SupportedLabelLocations";
import { DetailFieldPerDataType } from "../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldPerDataType";

type DataTypeComponentProps = {
  header: GenericListHeaderType;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  data: any;
  modelName: string;
  showDetails: boolean;
  headerLink?: string;
  dataDisplayType?: "gridView" | "flexView";
  includeFlagInPhoneNumber?: boolean;
};

export const DataTypeComponent = ({
  header,
  dataProcessed,
  dataProcessing,
  data,
  modelName,
  showDetails,
  headerLink,
  dataDisplayType = "gridView",
  includeFlagInPhoneNumber = true,
}: DataTypeComponentProps) => {
  return (
    <DetailFieldPerDataType
      field={{
        label: header.label,
        value: header.columnName,
        dataType: header.dataType,
        field: header.field,
      }}
      dataProcessed={dataProcessed}
      dataProcessing={dataProcessing}
      data={data}
      headerVisible={true}
      marginBottom={"mb-2"}
      fontSize={{ header: "text-xsm", value: "text-xsm" }}
      fontColor={
        header.columnName === "name"
          ? headerLink
            ? "text-vryno-theme-light-blue"
            : ""
          : ""
      }
      truncateData={showDetails ? false : true}
      isSample={data.isSample}
      modelName={modelName}
      supportedLabelLocation={
        dataDisplayType === "gridView"
          ? SupportedLabelLocations.OnTop
          : SupportedLabelLocations.OnLeftSide
      }
      includeFlagInPhoneNumber={includeFlagInPhoneNumber}
    />
  );
};
