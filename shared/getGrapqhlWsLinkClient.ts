"use client";
import { cookieUserStore } from "./CookieUserStore";
import { v4 as uuidv4 } from "uuid";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { atRootApp } from "./instanceUtils";
import { Config, extractInstanceSubDomain } from "./constants";
import { createClient } from "graphql-ws";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Operation,
  split,
} from "@apollo/client";
import loggerLink from "./link-logger";

export const crmPath = "crm";
export const accountsPath = "accounts";
export const workflowPath = "workflow";
export const notifyPath = "notify";
const getConnectionParams = (appName: string) => {
  const accessToken = cookieUserStore.getAccessToken();
  const commonHeader = {
    "x-vryno-client-id": uuidv4(),
    "x-vryno-schema":
      appName === "accounts"
        ? "568dd213-3eac-47b7-8ae1-49f154615cc9"
        : "d8762e11-4553-4679-be8b-7bc7857bb85f",
  };
  const authHeader = {
    authorization: `Bearer ${accessToken}`,
  };
  if (!accessToken) {
    return {
      ...commonHeader,
    };
  }
  return {
    ...commonHeader,
    ...authHeader,
  };
};

let linkConnections: Record<string, GraphQLWsLink> = {};

const getGraphqlWsLink = (appName: string) => {
  const url =
    process.browser && !atRootApp()
      ? Config.websocketUrl({
          apiHostName: `${Config.apiSubDomain}.${Config.apiHostName}`,
          apiSubDomain: extractInstanceSubDomain(),
        })
      : Config.websocketUrl();
  if (linkConnections[appName]) {
    return linkConnections[appName];
  }

  linkConnections[appName] = new GraphQLWsLink(
    createClient({
      url: `${url}/${appName}`,
      lazy: false,
      connectionParams: () => getConnectionParams(appName),
    })
  );

  return linkConnections[appName];
};

type FetchOptions = {
  headers: { vrynopath?: string; subdomain?: string };
};
const customFetchFunction = (
  requestInfo: RequestInfo,
  options: RequestInit & FetchOptions
): Promise<Response> => {
  return new Promise<Response>(async (resolve, reject) => {
    const { headers: internalHeaders } = options;
    const { vrynopath, subdomain, ...rest } = internalHeaders;
    options.headers = rest;
    const requestBody = JSON.parse(options.body as string);
    const url = Config.apiUrl({
      apiHostName: `${Config.apiSubDomain}.${Config.apiHostName}`,
      apiSubDomain: subdomain,
    });
    const postUrl = `${url}/${vrynopath}`;
    const req =
      requestInfo instanceof Request
        ? requestInfo
        : new Request(requestInfo, options);

    const {
      cache,
      credentials,
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
    } = req;

    const { headers, body } = options;

    fetch(
      new Request(postUrl, {
        cache,
        credentials,
        integrity,
        method,
        mode,
        redirect,
        referrer,
        referrerPolicy,
        body,
        headers: {
          ...headers,
          ...{
            "x-vryno-timeout": "30",
          },
          ...getConnectionParams(vrynopath || ""),
        },
      })
    )
      .then(resolve)
      .catch(reject);
  });
};

const getHttpLink = () => {
  return new HttpLink({
    uri: "",
    fetch: customFetchFunction as any,
  });
};

const useSubdomain = (op: Operation) => {
  const subdomain = op.getContext().headers?.subdomain;
  return !!subdomain;
};

export const getGraphqlWsLinkClient = () => {
  const backendApps = {
    crm: getGraphqlWsLink(crmPath),
    accounts: getGraphqlWsLink(accountsPath),
    workflow: getGraphqlWsLink(workflowPath),
    notify: getGraphqlWsLink(notifyPath),
    search: getGraphqlWsLink("search"),
  };
  const defaultClient: keyof typeof backendApps = "accounts";

  const isRequestedClient = (appName: string) => (op: Operation) =>
    op.getContext().headers?.vrynopath === appName;

  const applicableApp = Object.entries(backendApps)
    .map(([appName, Link]) => [appName, ApolloLink.from([Link])] as const)
    .reduce(
      ([_, PreviousLink], [clientName, NextLink]) => {
        const ChainedLink = split(
          isRequestedClient(clientName),
          NextLink,
          PreviousLink
        );

        return [clientName, ChainedLink];
      },
      ["_default", backendApps[defaultClient]]
    )[1];

  const connectionOptions = {
    link: ApolloLink.from([
      loggerLink,
      split(useSubdomain, getHttpLink(), applicableApp),
    ]),
    cache: new InMemoryCache({ addTypename: false }),
  };
  return new ApolloClient(connectionOptions);
};
