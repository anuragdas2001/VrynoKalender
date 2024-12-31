import React from "react";
import { useRouter } from "next/router";
import NoDataFoundContainer from "../../shared/components/NoDataFoundContainer";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { SupportedApps } from "../../../../../models/shared";
import { AllowedViews } from "../../../../../models/allowedViews";

export type GenericNoDataContainerProps = {
  modelName: string;
  appName: SupportedApps;
  moduleLabel?: string;
  messageType?: "data" | "view";
  additionalParts?: string[];
};

const GenericNoDataContainer = ({
  modelName,
  appName,
  moduleLabel,
  messageType,
  additionalParts,
}: GenericNoDataContainerProps) => {
  const router = useRouter();

  return (
    <NoDataFoundContainer
      modelName={modelName}
      moduleLabel={moduleLabel}
      onClick={() => {
        router
          .push(
            appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.add,
              undefined,
              additionalParts
            )
          )
          .then();
      }}
      messageType={messageType}
    />
  );
};
export default GenericNoDataContainer;
