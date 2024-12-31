import { ApolloLink } from "@apollo/client/core";
import formatMessage from "./formatMessage";
import logging from "./logging";

const loggerLink = new ApolloLink((operation, forward) => {
  const startTime = new Date().getTime();

  return forward(operation).map((result) => {
    //@ts-ignore
    const operationType = operation.query.definitions[0].operation;
    const elapsed = new Date().getTime() - startTime;

    let operationName = operation.operationName;
    const BASIC_OPERATION = ["fetch", "save", "quest"];
    if (BASIC_OPERATION.includes(operationName)) {
      operationName += ` ${operation?.variables?.modelName}`;
    }
    const group = formatMessage(operationType, operationName, elapsed);

    logging.groupCollapsed(...group);

    console.trace("Request Origination Path");
    logging.log("INIT", operation);
    logging.log("RESULT", result);

    logging.groupEnd(...group);
    return result;
  });
});

export default loggerLink;
