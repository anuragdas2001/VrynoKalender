import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";

export const NoDataControl = ({
  fontSize,
  dataTestId,
}: Pick<DetailFieldPerDataTypeProps, "fontSize" | "dataTestId">) =>
  dataTestId ? (
    <span
      className={`${fontSize.value} text-gray-400`}
      data-testid={dataTestId}
    >
      -
    </span>
  ) : (
    <span className={`${fontSize.value} text-gray-400`}>-</span>
  );
