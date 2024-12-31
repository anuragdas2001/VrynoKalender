import { ICustomField } from "../../../../models/ICustomField";
import { IReportsParameters } from "../ReportViewerContainer";
import React, { useContext } from "react";
import { ReportCustomViewTable } from "./ReportCustomViewTable";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../graphql/queries/fetchQuery";
import {
  ICriteriaFilterRow,
  ICustomView,
  SupportedApps,
} from "../../../../models/shared";
import router from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import GenericBackHeader from "../../crm/shared/components/GenericBackHeader";
import { ReportTabComponent } from "./ReportTabComponent";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import { ReportParametersForm } from "./ReportParametersForm";
import { UserStoreContext } from "../../../../stores/UserStore";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../stores/RootStore/GeneralStore/GeneralStore";

export const ReportViewTabContainer = observer(
  ({
    // reportFile,
    parameters,
    moduleName,
    handleReportSubmit,
    reportFields,
    id,
    hasParameter,
    conditionList,
    setConditionList,
    reportCreatedById,
  }: {
    // reportFile: Rdl.Report | null;
    parameters: IReportsParameters[] | null;
    moduleName: string;
    handleReportSubmit: (values: any, type: "filterValues" | "viewId") => void;
    reportFields: ICustomField[] | undefined;
    id: string;
    hasParameter: boolean;
    conditionList: ICriteriaFilterRow[];
    setConditionList: (value: any[]) => void;
    reportCreatedById: string | null;
  }) => {
    const userContext = React.useContext(UserStoreContext);
    const { user } = userContext;
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { userPreferences } = generalModelStore;
    const [selectedTab, setSelectedTab] = React.useState<
      "parameter" | "customView"
    >("parameter");
    const [customViewList, setCustomViewList] = React.useState<ICustomView[]>(
      []
    );

    const [getModuleView] = useLazyQuery<FetchData<ICustomView>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
        context: {
          headers: {
            vrynopath: SupportedApps.crm,
          },
        },
        onCompleted: (responseOnCompletion) => {
          if (responseOnCompletion?.fetch?.data) {
            setCustomViewList(responseOnCompletion?.fetch?.data);
          }
        },
      }
    );

    React.useEffect(() => {
      if (moduleName) {
        getModuleView({
          variables: {
            modelName: "ModuleView",
            fields: [
              "id",
              "name",
              "createdAt",
              "createdBy",
              "updatedAt",
              "updatedBy",
              "moduleName",
              "filters",
              "moduleFields",
              "recordsPerPage",
              "orderBy",
              "isShared",
              "config",
              "systemDefined",
            ],
            filters: [
              // {
              //   operator: "eq",
              //   name: "createdBy",
              //   value: cookieUserStore.getUserId() || "",
              // },
              {
                name: "moduleName",
                operator: "eq",
                value: moduleName,
              },
            ],
          },
        });
      }
    }, [moduleName]);

    const initialValues = !parameters
      ? {}
      : parameters.reduce((accum, next, index) => {
          accum[next.Name] = "";
          accum[`${next.Name}_datatype`] = "";
          return accum;
        }, {} as Record<string, string>);

    const validationObject = !parameters
      ? {}
      : parameters.reduce((accum, next) => {
          accum[next.Name] = Yup.lazy((value) => {
            if (Array.isArray(value)) {
              return Yup.array()
                .nullable()
                .min(1, `Please select at least one value`)
                .required(`${next.Prompt} is required.`);
            } else return Yup.string().required(`${next.Prompt} is required.`);
          });
          accum[`${next.Name}_datatype`] = Yup.string().required(
            `${next.Prompt} is required.`
          );
          return accum;
        }, {} as Record<string, any>);

    // !reportFields ? (
    //   <div className={"flex items-center justify-center h-screen text-xl"}>
    //     <PageLoader />
    //   </div>
    // ) :

    return (
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={(values) => {
          handleReportSubmit(values, "filterValues");
        }}
      >
        {({ handleSubmit }) => (
          <>
            {!parameters ||
            (hasParameter && reportFields?.length !== parameters.length) ? (
              <GenericBackHeader
                heading={"Report Parameter"}
                addButtonInFlexCol={true}
              />
            ) : (
              <GenericBackHeader
                heading={"Report Parameter"}
                addButtonInFlexCol={true}
              >
                <div className="col-span-3 sm:col-span-2">
                  <Button
                    id="save-form"
                    onClick={() => handleSubmit()}
                    buttonType="thin"
                    kind="primary"
                    userEventName="run-report-click"
                  >
                    <div className="flex">
                      <p>Run Report</p>
                    </div>
                  </Button>
                </div>
              </GenericBackHeader>
            )}

            <ReportTabComponent
              selectedTab={selectedTab}
              onSelectedTab={(value: "parameter" | "customView") =>
                setSelectedTab(value)
              }
            />

            {selectedTab === "parameter" ? (
              !hasParameter ? (
                <div className="flex items-center justify-center px-6">
                  <div className="bg-white rounded-md mt-5 px-10 py-20 w-full text-center text-sm">
                    <p>Parameters Not Found</p>
                  </div>
                </div>
              ) : !parameters ||
                (hasParameter && reportFields?.length !== parameters.length) ? (
                <div className="flex items-center justify-center px-6">
                  <div className="bg-white rounded-md mt-5 p-10 w-full text-center text-sm">
                    <div className="flex flex-col items-center justify-center mb-10">
                      <img
                        src="/wrong-param-visual.svg"
                        alt="Wrong Parameters"
                        className="w-32 mt-14"
                      />
                      <p className="text-sm mt-2 text-vryno-card-heading-text">
                        You have added wrong field name or datatype.
                      </p>
                      <p className="text-sm mt-2 text-vryno-card-heading-text">
                        Please check your report parameters and try again.
                      </p>
                      <div className="w-auto mt-4">
                        <Button
                          onClick={() => router.push(`/reports/crm/edit/${id}`)}
                          id={id}
                          userEventName="report-edit:action-click"
                          disabled={reportCreatedById !== user?.id}
                        >
                          <div className="flex items-center justify-center px-4 gap-x-2">
                            <EditBoxIcon size={20} className="text-white" />
                            <p>Edit Report</p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : hasParameter && reportFields ? (
                <ReportParametersForm
                  parameters={parameters}
                  moduleName={moduleName}
                  reportFields={reportFields}
                  conditionList={conditionList}
                  setConditionList={setConditionList}
                  userPreferences={userPreferences}
                />
              ) : (
                <div className="flex items-center justify-center px-6">
                  <div className="bg-white rounded-md mt-5 px-10 py-20 w-full text-center text-sm">
                    <p>Parameters Not Found</p>
                  </div>
                </div>
              )
            ) : (
              <ReportCustomViewTable
                customViewList={customViewList}
                moduleName={moduleName}
                handleReportSubmit={handleReportSubmit}
                user={user}
              />
            )}
          </>
        )}
      </Formik>
    );
  }
);
