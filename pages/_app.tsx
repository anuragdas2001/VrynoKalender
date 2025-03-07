import React, { createContext } from "react";
import { IDashboardDetails } from "../models/Dashboard";
import DashboardSidePageNavigation from "../screens/modules/crm/dashboard/view/DashboardSidePageNavigation";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NavBar } from "../screens/layouts/NavBar/NavBar";
import dashboardDetails from "../constraints/constraints";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export const MessageListContext = createContext<{
  instanceMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  appMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
}>({ instanceMessage: [], appMessage: [] });

const client = new ApolloClient({
  uri: "https://your-graphql-endpoint.com/graphql",
  cache: new InMemoryCache(),
});

type NextPageWithLayout = {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
} & AppProps["Component"];

interface CustomAppProps extends AppProps {
  Component: NextPageWithLayout;
}

export default function App({ Component, pageProps }: CustomAppProps) {
  const dashboardArr: IDashboardDetails[] = dashboardDetails;
  const router = useRouter();
  const currentTab = router.asPath.split("/")[1];
  const currentTab2 = router.asPath.split("/")[2];
  
  const isCollapsed =
    currentTab === "meetings" ||
    (currentTab === "event_types" && Boolean(currentTab2)) ||
    currentTab === "settings";

  const handlePreferencesChange = (
    dashboard: IDashboardDetails,
    isDelete: boolean
  ): void => {
    console.log("handlePreferencesChange", dashboard, isDelete);
  };

  const setDeleteModal = (tempObj: {
    visible: boolean;
    item: IDashboardDetails;
  }): void => {
    console.log("setDeleteModal", tempObj);
  };

  // Check if the page has a custom layout
  if (Component.getLayout) {
    return (
      <ApolloProvider client={client}>
        {Component.getLayout(<Component {...pageProps} />)}
      </ApolloProvider>
    );
  }

  // Default layout
  return (
    <div className="relative flex w-full h-full">
      <div
        className={`h-screen fixed inset-y-0 shadow-md left-0 bg-white hidden px-4 py-2 z-[600] sm:block pb-[60px] transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <DashboardSidePageNavigation
          appName="VrynoBook"
          modelName="home"
          dashboards={dashboardArr}
          currentDashboard={dashboardDetails[0]}
          handlePreferencesChange={handlePreferencesChange}
          setDeleteModal={setDeleteModal}
          user={null}
          isCollapsed={isCollapsed}
        />
      </div>
      <div
        className={`flex flex-col w-full h-screen transition-all duration-300 ${
          isCollapsed ? "sm:ml-20" : "sm:ml-64"
        }`}
      >
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </div>
    </div>
  );
}