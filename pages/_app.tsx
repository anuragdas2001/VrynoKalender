import React, { createContext } from "react";
// import { IDashboardDetails } from "@/models/Dashboard";
import { IDashboardDetails } from "../models/Dashboard";
// import DashboardSidePageNavigation from "@/screens/modules/crm/dashboard/view/DashboardSidePageNavigation";
import DashboardSidePageNavigation from "../screens/modules/crm/dashboard/view/DashboardSidePageNavigation";
// import Styles from '../styles/_app.module.css'
// import "@/styles/globals.css";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NavBar } from "../screens/layouts/NavBar/NavBar";
import dashboardDetails from "../constraints/constraints";

import type { AppProps } from "next/app";
import { SupportedApps } from "../models/shared";

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
  uri: "https://your-graphql-endpoint.com/graphql", // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
  // const dashboardDetails: IDashboardDetails = {
  //   id: '101',
  //   name: 'Event Types',
  //   instanceId: 'I101',
  //   widgetDetails: [
  //     {
  //       id: '1001',
  //       fieldPermissionMessage: null,
  //       name: 'abc',
  //       key: null, // Assuming `key` is `WidgetsView | string | null`
  //       widgetType: 'abc',
  //       widgetMetadata: null, // Assuming it’s of type `BaseGenericObjectType | null`
  //       moduleViewId: ['1001'], // String array
  //       customView: [
  //         { key: 'key' }, // Assuming `customView` is an array of `BaseGenericObjectType`
  //       ],
  //     },
  //   ],
  //   widgets: ['string1', 'string2', 'string3'], // String array
  //   url:'/event_types'
  // };

  const dashboardArr: IDashboardDetails[] = dashboardDetails;

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

  return (
    <>
      <div className="relative flex w-full h-full ">
        {/* <div className='min-h-screen overflow-y-auto fixed inset-y-0 shadow-md left-0 mt-20 sm:mt-21.5 md:mt-15 bg-white hidden sm:w-4/12 md:w-3/12 lg:w-1/5 xl:w-2/12 px-4 py-2 z-[600] sm:block pb-[60px]'> */}
        <div className="min-h-screen overflow-y-auto fixed inset-y-0 shadow-md left-0  bg-white hidden sm:w-4/12 md:w-3/12 lg:w-1/5 xl:w-2/12 px-4 py-2 z-[600] sm:block pb-[60px]">
          {/*
                        mt-20 
                        sm:mt-21.5 
                        md:mt-15
                        removed margin from the above div margin-top
                        */}
          {/* <NavBar appName="vrynokalendar" /> */}
          <DashboardSidePageNavigation
            appName="VrynoBook"
            modelName="home"
            dashboards={dashboardArr}
            currentDashboard={dashboardDetails[0]}
            handlePreferencesChange={handlePreferencesChange}
            setDeleteModal={setDeleteModal}
            user={null}
          />
        </div>
        <div className="flex flex-col w-full h-screen sm:w-8/12 md:w-9/12 lg:w-4/5 xl:w-10/12 sm:ml-4/12 md:ml-3/12 lg:ml-1/5 xl:ml-2/12 overflow-y-auto">
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </div>
      </div>
    </>
  );
}
