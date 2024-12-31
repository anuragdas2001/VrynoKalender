// import { createVrynoClient, VrynoClient } from "@vryno/vryno-client";
import {
  ApolloClient,
  Context,
  FetchPolicy,
  HttpLink,
  InMemoryCache,
  split,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import { cookieUserStore } from "./CookieUserStore";
import { Config, extractInstanceSubDomain } from "./constants";
import { getMainDefinition } from "@apollo/client/utilities";
import { atRootApp } from "./instanceUtils";
import { MutationFetchPolicy } from "@apollo/client/core/watchQueryOptions";
import { SupportedApps } from "../models/shared";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

function portableMsTimer() {
  if (process?.hrtime) {
    return Number(process.hrtime.bigint()) / 1e6;
  } else {
    return window.performance.now();
  }
}

// const serverFailure = (e: { errorMessage: string }) => ({
//   status: 500,
//   statusText: "Internal Server Error",
//   type: "error",
//   text: () =>
//     Promise.resolve(
//       JSON.stringify({
//         error: `Internal Server Error ${e.errorMessage}`,
//       })
//     ),
// });

// const failureResolve = (
//   resolve: (value: Response | PromiseLike<Response>) => void,
//   message: string
// ) => {
//   //@ts-ignore
//   resolve(serverFailure({ errorMessage: message }));
// };

const appContext = (appPath: string) => ({
  context: {
    headers: {
      vrynopath: appPath,
    },
  },
});

export const crmPath = "crm";

export const crmContext = appContext(crmPath);

export const accountsPath = "accounts";

export const accountsContext = appContext(accountsPath);

export const workflowPath = "workflow";

export const workflowContext = appContext(workflowPath);

export const notifyPath = "notify";

export const notifyContext = appContext(notifyPath);

type queryOptionsType = {
  fetchPolicy?: WatchQueryFetchPolicy | FetchPolicy;
  nextFetchPolicy?: WatchQueryFetchPolicy | FetchPolicy;
  context: Context;
};
type mutationFetchOptions<TData> = {
  fetchPolicy?: MutationFetchPolicy;
  context: Context;
  onCompleted?: (data: TData) => void;
};

// type defaultCacheOptionsType = {
//   context: Context;
// };

export const queryOptionsApp = (
  appPath: string,
  fetchPolicy?: WatchQueryFetchPolicy | FetchPolicy,
  nextFetchPolicy?: WatchQueryFetchPolicy | FetchPolicy
): queryOptionsType => ({
  fetchPolicy: fetchPolicy || "cache-first",
  nextFetchPolicy: nextFetchPolicy || "cache-first",
  ...appContext(appPath),
});

export const mutationsOptionsApp = <TData>(
  appPath: string,
  onCompleted?: (data: TData) => void
): mutationFetchOptions<TData> => ({
  fetchPolicy: "no-cache",
  ...appContext(appPath),
  onCompleted,
});

// export const queryOptionsCRM: queryOptionsType = {
//   fetchPolicy: "no-cache",
//   ...crmContext,
// };

export const queryOptionsAccounts: queryOptionsType = {
  fetchPolicy: "no-cache",
  ...accountsContext,
};

// export const queryOptionsCRMDefaultCachePolicy: defaultCacheOptionsType = {
//   ...crmContext,
// };

// const globalRequestTimeOut = 30;

// let vrynoClient: VrynoClient | undefined = undefined;

// export const getVrynoClient = () => {
//   const uri =
//     process.browser && !atRootApp()
//       ? Config.websocketUrl({
//           apiHostName: `${Config.apiSubDomain}.${Config.apiHostName}`,
//           apiSubDomain: extractInstanceSubDomain(),
//         })
//       : Config.websocketUrl();
//   vrynoClient = vrynoClient || createVrynoClient(uri);
//   return vrynoClient;
// };
//
// type FetchOptions = {
//   headers: { vrynopath?: string; client?: VrynoClient };
// };

// const UNAUTHENTICATED_OPERATIONS_LIST = [
//   "GenerateToken",
//   "VerifyEmail",
//   "ForgotPassword",
//   "ResetPassword",
//   "Login",
//   "Register",
//   "sendEmailVerificationLink",
// ];

// const BASIC_OPERATION = ["fetch", "save"];

// const fetch = (
//   _: RequestInfo,
//   options: RequestInit & FetchOptions
// ): Promise<Response> => {
//   return new Promise<Response>(async (resolve, reject) => {
//     try {
//       const localVrynoClient = getVrynoClient();
//       const { headers } = options;
//       const { vrynopath, client, ...rest } = headers;
//       options.headers = rest;
//       const requestBody = JSON.parse(options.body as string);
//       let operationName = requestBody.operationName;
//       // let isTokenGood = true;
//       // if (!UNAUTHENTICATED_OPERATIONS_LIST.includes(operationName)) {
//       //   // avoid infinite loop
//       //   isTokenGood = await userStore.refreshToken(getClient());
//       // }
//       // if (!isTokenGood) {
//       //   userStore.redirectToLogin();
//       //   reject(detail Error("Token expired"));
//       // }
//       // if (!vrynopath) {
//       //   failureResolve(resolve, "vryno path is undefined, and it is mandatory");
//       //   return;
//       // }
//       let Options = {};
//       if (!UNAUTHENTICATED_OPERATIONS_LIST.includes(operationName)) {
//         const accessToken = cookieUserStore.getAccessToken();
//         if (!accessToken) {
//           cookieUserStore.redirectToLogin();
//         }
//         Options = {
//           accessToken: accessToken,
//         };
//       }
//       if (BASIC_OPERATION.includes(operationName)) {
//         operationName += ` ${requestBody?.variables?.modelName}`;
//       }
//       const startTime = portableMsTimer();
//       console.groupCollapsed(`${operationName} Request`);
//       //uncomment following if you need to figure out from where the request originated
//       console.trace("Request Origination Path");
//       console.info(requestBody);
//       console.groupEnd();
//       const clientToUse = client || localVrynoClient;
//       const response = await clientToUse
//         .fetch(
//           vrynopath || SupportedApps.crm,
//           requestBody,
//           { ...Options },
//           globalRequestTimeOut
//         )
//         .catch((e: { errorMessage?: string }) => {
//           const endTime = portableMsTimer();
//           let timeString = "";
//           const time = endTime - startTime;
//           timeString = `${time.toFixed(2)} ms`;
//           console.groupCollapsed(
//             `${operationName} Response, it took ${timeString}`
//           );
//           console.error(e);
//           console.groupEnd();
//           failureResolve(resolve, e.errorMessage || '"Unknown error"');
//         });
//
//       if (!response) {
//         return;
//       }
//
//       const endTime = portableMsTimer();
//       let timeString = "";
//       const time = endTime - startTime;
//       timeString = `${time.toFixed(2)} ms`;
//       console.groupCollapsed(
//         `${operationName} Response, it took ${timeString}`
//       );
//       console.info(response);
//       console.groupEnd();
//       // @ts-ignore
//       resolve({
//         status: 200,
//         text: () =>
//           new Promise((resolve, reject) => {
//             resolve(JSON.stringify(response));
//           }),
//       });
//     } catch (e) {
//       console.error(e);
//       reject(e);
//     }
//   });
// };

// export const getClient = () => {
//   getVrynoClient();
//   return new ApolloClient({
//     link: new HttpLink({
//       uri: "",
//       fetch,
//     }),
//     cache: new InMemoryCache(),
//   });
// };

// export const getSubscriptionClient = () => {
//   getVrynoClient();
//   const url =
//     process.browser && !atRootApp()
//       ? Config.websocketUrl({
//           apiHostName: `${Config.apiSubDomain}.${Config.apiHostName}`,
//           apiSubDomain: extractInstanceSubDomain(),
//         })
//       : Config.websocketUrl();
//
//   const httpLink = new HttpLink({
//     uri: "",
//     fetch,
//   });
//
//   const wsLink = new GraphQLWsLink(createClient({ url: url }));
//
//   const splitLink = split(
//     ({ query }) => {
//       const definition = getMainDefinition(query);
//       return (
//         definition.kind === "OperationDefinition" &&
//         definition.operation === "subscription"
//       );
//     },
//     wsLink,
//     httpLink
//   );
//
//   return new ApolloClient({
//     link: splitLink,
//     cache: new InMemoryCache(),
//   });
// };
