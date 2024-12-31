import { Toast } from "../components/TailwindControls/Toast";
import { Config } from "./constants";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { GenericMutationResponse } from "../models/shared";

const internalErrorHandler = (message: string) => {
  Toast.error(message);
  console.error(message);
};

export const mutationResponseHandler = <TData, TFinalResult>(
  errors: ReadonlyArray<GraphQLFormattedError> | undefined,
  data: TData,
  t: (key: string, defaultValue?: string) => string,
  readResponseAttr: (
    input: TData
  ) => GenericMutationResponse<TFinalResult> | undefined
): TFinalResult | undefined => {
  if (errors || !(data && readResponseAttr(data))) {
    let message = `${t("common:unknown-message")}, ${
      Config.isClientDevMode()
        ? errors
          ? errors.reduce((total, next) => next.message, "")
          : ""
        : ""
    }`;
    internalErrorHandler(message);
    return;
  }

  const serverResponse = readResponseAttr(data);

  if (!serverResponse) return undefined;

  if (serverResponse.status) return serverResponse.data;

  if (
    !serverResponse.status &&
    (serverResponse.messageKey || serverResponse.message)
  ) {
    let message = t(
      serverResponse.messageKey,
      serverResponse.message || serverResponse.messageKey
    );
    internalErrorHandler(message);
    return;
  }

  let message = t("common:unknown-message");
  internalErrorHandler(message);
};

// export const fetchResponseHandler = <TData, TFinalResult>
