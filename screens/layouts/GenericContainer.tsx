import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useContext, useRef } from "react";
import { ClickOutsideToClose } from "../../components/TailwindControls/shared/ClickOutsideToClose";
import { IUserPreference, SupportedApps } from "../../models/shared";
import { SearchScreen } from "../Shared/SearchScreen";
import { sliderWindowType } from "../modules/crm/shared/components/SliderWindow";
import { getAppPathParts } from "../modules/crm/shared/utils/getAppPathParts";
import { NavBar } from "./NavBar/NavBar";
import { IFormModalObject } from "../modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import GenericFormModalWrapper from "../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import { Backdrop } from "../../components/TailwindControls/Backdrop";
import { GeneralStoreContext } from "../../stores/RootStore/GeneralStore/GeneralStore";
import { AccountModels } from "../../models/Accounts";
import { checkLightOrDark } from "../modules/crm/shared/utils/checkLightDarkColor";
import { NavigationStoreContext } from "../../stores/RootStore/NavigationStore/NavigationStore";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../graphql/queries/fetchQuery";
import { observer } from "mobx-react-lite";
import { ReminderModal } from "./Reminders/ReminderModal";
import { IModuleMetadata } from "../../models/IModuleMetadata";
import { ILayout } from "../../models/ILayout";
import { getSortedFieldList } from "../modules/crm/shared/utils/getOrderedFieldsList";
import { appsUrlGenerator } from "../modules/crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../models/allowedViews";
import { InstanceStoreContext } from "../../stores/InstanceStore";
import { MessageListContext } from "../../pages/_app";
import { UserStoreContext } from "../../stores/UserStore";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../modules/crm/shared/utils/modelNameMapperForParamUrlGenerator";

interface IGenericContainerProps {
  children: React.ReactNode;
}

type MassDeleteSessionIdContextType = {
  massDeleteSessionId: Record<string, string[]>;
  setMassDeleteSessionId: Dispatch<SetStateAction<Record<string, string[]>>>;
};

export const MassDeleteSessionIdContext =
  React.createContext<MassDeleteSessionIdContextType>({
    massDeleteSessionId: {},
    setMassDeleteSessionId: () => {},
  });

export const useMassDeleteSessionId = () => {
  const context = useContext(MassDeleteSessionIdContext);
  if (!context) {
    throw new Error(
      "useMassDeleteSessionId must be used within a MassDeleteSessionIdProvider"
    );
  }
  return context;
};

const emptyModalValues = {
  visible: false,
  formDetails: {
    type: null,
    id: null,
    modelName: "",
    appName: "",
    quickCreate: false,
    aliasName: "",
    parentid: "",
  },
};

export const GenericContainer = observer(
  ({ children }: IGenericContainerProps) => {
    const router = useRouter();
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const { appName } = getAppPathParts();
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      allModulesFetched,
      allLayoutFetched,
      userPreferences,
      removeModuleDataById,
      importModuleLayouts,
      importModuleInfo,
      importFields,
      setAllLayoutFetchStatus,
      setAllModulesFetchedStatus,
      setAllModuleViewPermission,
    } = generalModelStore;
    const { instances, importAllInstances, addInstance } =
      React.useContext(InstanceStoreContext);
    const { importNavigations, navigations } = React.useContext(
      NavigationStoreContext
    );
    const { appMessage, instanceMessage } = useContext(MessageListContext);
    const wrapperRef = useRef(null);
    const { navbarColor, setNavbarColor } = useContext(NavigationStoreContext);
    const { addModuleData, importUserPreferences } = generalModelStore;
    const [mounted, setMounted] = React.useState(false);
    const [disableSearchButton, setDisableSearchButton] =
      React.useState<boolean>(true);
    const [searchFormClosed, setSearchFormClosed] =
      React.useState<boolean>(false);
    const [massDeleteSessionId, setMassDeleteSessionId] = React.useState<
      Record<string, string[]>
    >({});
    const [globalSearchModal, setGlobalSearchModal] =
      React.useState<sliderWindowType>("-translate-y-full");
    ClickOutsideToClose(wrapperRef, (value: boolean) => {
      setGlobalSearchModal("-translate-y-full");
    });
    const [allNotificationClass, setAllNotificationClass] =
      React.useState("translate-x-full");
    const [modulesFetched, setModulesFetched] = React.useState<{
      data: IModuleMetadata[];
      loading: boolean;
      error: boolean;
    }>({ data: [], loading: true, error: false });
    const [quickAddModal, setQuickAddModal] = React.useState<IFormModalObject>({
      visible: false,
      formDetails: {
        type: null,
        id: null,
        modelName: "",
        appName: "",
        quickCreate: false,
        aliasName: "",
      },
    });

    const [getUserPreferences] = useLazyQuery<
      FetchData<IUserPreference>,
      FetchVars
    >(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "accounts",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
          if (
            responseOnCompletion.fetch.data &&
            responseOnCompletion.fetch.data.length > 0
          ) {
            let userPreferences = responseOnCompletion.fetch.data[0];
            if (userPreferences) {
              setNavbarColor(userPreferences?.defaultPreferences?.navbarColor);
            }
          }
          importUserPreferences(responseOnCompletion?.fetch?.data);
        }
      },
    });

    const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
        context: {
          headers: {
            vrynopath: SupportedApps.crm,
          },
        },
      }
    );

    const [getModule] = useLazyQuery<FetchData<IModuleMetadata>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
        context: {
          headers: {
            vrynopath: SupportedApps.crm,
          },
        },
      }
    );

    React.useEffect(() => {
      if (!allModulesFetched && modulesFetched?.loading) {
        localStorage.removeItem("BackgroundProccessRunning");
        const handleModuleFetch = async () => {
          await getModule({
            variables: {
              modelName: "Module",
              fields: ["id", "name", "label", "customizationAllowed", "order"],
              filters: [],
            },
          })
            .then(async (responseOnCompletion) => {
              if (
                responseOnCompletion?.data?.fetch?.data &&
                responseOnCompletion?.data?.fetch?.data?.length > 0
              ) {
                responseOnCompletion?.data?.fetch?.data?.forEach(
                  (module: IModuleMetadata) =>
                    importModuleInfo(module, module.name)
                );
                setModulesFetched({
                  data: responseOnCompletion?.data?.fetch?.data,
                  loading: false,
                  error: false,
                });
                setAllModulesFetchedStatus(true);
                setAllModuleViewPermission(true);
                await getLayout({
                  variables: {
                    modelName: "Layout",
                    fields: [
                      "id",
                      "name",
                      "moduleName",
                      "layout",
                      "config",
                      "type",
                    ],
                    filters: [
                      {
                        name: "moduleName",
                        operator: "in",
                        value: [
                          ...responseOnCompletion?.data?.fetch?.data
                            ?.filter(
                              (module: IModuleMetadata) =>
                                module.customizationAllowed
                            )
                            ?.map((module: IModuleMetadata) => module.name),
                          "note",
                          "attachment",
                        ],
                      },
                    ],
                  },
                })
                  .then((responseOnCompletion) => {
                    if (
                      responseOnCompletion?.data?.fetch?.data &&
                      responseOnCompletion?.data?.fetch?.data?.length > 0
                    ) {
                      responseOnCompletion?.data?.fetch?.data?.forEach(
                        (layout: ILayout) => {
                          importModuleLayouts([layout], layout.moduleName);
                          importFields(
                            getSortedFieldList(layout.config.fields),
                            layout.moduleName
                          );
                        }
                      );
                      setAllLayoutFetchStatus(true);
                    } else if (
                      responseOnCompletion?.data?.fetch?.messageKey?.includes(
                        "-success"
                      )
                    ) {
                      setAllLayoutFetchStatus(true);
                    } else {
                    }
                  })
                  .catch((error) => {});
              } else if (
                responseOnCompletion?.data?.fetch?.messageKey?.includes(
                  "-success"
                )
              ) {
                setModulesFetched({ data: [], loading: false, error: false });
                setAllModulesFetchedStatus(true);
                setAllModuleViewPermission(true);
              } else if (
                responseOnCompletion?.data?.fetch?.messageKey?.includes(
                  "requires-view"
                )
              ) {
                setModulesFetched({ data: [], loading: false, error: true });
                setAllModuleViewPermission(false);
              } else {
                setModulesFetched({ data: [], loading: false, error: true });
              }
            })
            .catch((error) => {
              setModulesFetched({ data: [], loading: false, error: true });
            });
        };
        handleModuleFetch();
      }
    }, [allModulesFetched]);

    React.useEffect(() => {
      setMounted(true);
      getUserPreferences({
        variables: {
          modelName: AccountModels.Preference,
          fields: ["id", "serviceName", "defaultPreferences"],
          filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
        },
      });
    }, []);

    const handleAddedRecord = (data: any, modelName?: string) => {
      if (modelName) addModuleData(data, modelName);
    };

    React.useEffect(() => {
      if (quickAddModal?.visible) {
        if (
          quickAddModal?.formDetails?.modelName === "quote" ||
          quickAddModal?.formDetails?.modelName === "invoice" ||
          quickAddModal?.formDetails?.modelName === "salesOrder" ||
          quickAddModal?.formDetails?.modelName === "purchaseOrder"
        ) {
          router.push(
            appsUrlGenerator(
              quickAddModal?.formDetails?.appName,
              quickAddModal?.formDetails?.modelName,
              AllowedViews.add,
              quickAddModal?.formDetails?.id || undefined,
              modelNameValuesWithSystemSubForm.includes(
                quickAddModal?.formDetails?.modelName
              )
                ? [
                    `?subform=${
                      modelNameMapperForParamURLGenerator(
                        quickAddModal?.formDetails?.modelName
                      )?.subForm
                    }&&dependingModule=product&&subformfield=${
                      modelNameMapperForParamURLGenerator(
                        quickAddModal?.formDetails?.modelName
                      )?.subFormFieldLinked
                    }`,
                  ]
                : []
            )
          );
        }
      }
    }, [quickAddModal]);

    return mounted ? (
      <MassDeleteSessionIdContext.Provider
        value={{ massDeleteSessionId, setMassDeleteSessionId }}
      >
        <div ref={wrapperRef}>
          <NavBar
            appName={appName}
            disableSearchButton={disableSearchButton}
            setQuickAddModal={(value) => setQuickAddModal(value)}
            setGlobalSearchModal={(value) => {
              setGlobalSearchModal(value);
              setSearchFormClosed(false);
            }}
            allNotificationClass={allNotificationClass}
            setAllNotificationClass={(value) => setAllNotificationClass(value)}
            navbarColor={navbarColor}
            navbarTextColor={
              checkLightOrDark(navbarColor) === "dark" ? "white" : "black"
            }
            instanceMessage={instanceMessage}
            instances={instances}
            addInstance={addInstance}
            appMessage={appMessage}
            user={user}
            removeModuleDataById={removeModuleDataById}
            importAllInstances={importAllInstances}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            navigations={[...navigations]}
            importNavigations={importNavigations}
          />
          <div className="w-full h-full">{children}</div>
          <ReminderModal
            navbarColor={navbarColor}
            navbarTextColor={
              checkLightOrDark(navbarColor) === "dark" ? "white" : "black"
            }
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            userPreferences={userPreferences}
            removeModuleDataById={removeModuleDataById}
          />
          <SearchScreen
            appName={appName ?? "crm"}
            modelName={""}
            currentModuleLabel={`Global`}
            searchModel={globalSearchModal}
            useModuleExpression={true}
            formClosed={searchFormClosed}
            setDisableSearchButton={(value) => setDisableSearchButton(value)}
            setFormClosed={(value) => setSearchFormClosed(value)}
            setSearchModal={(value) => setGlobalSearchModal(value)}
            hiddenDropdownLookup={`globalHiddenDropdownLookup`}
            hiddenSearchLookup={`globalHiddenSearchLookup`}
            handleSearchedSelectedItem={(item) => {
              item.modelName === AccountModels.User
                ? router.push(
                    `/settings/${appName ?? SupportedApps.crm}/users/edit/${
                      item.rowId
                    }`
                  )
                : router.push(
                    `/app/${appName ?? SupportedApps.crm}/${
                      item?.modelName
                    }/detail/${item?.rowId}`
                  );
              setGlobalSearchModal("-translate-y-full");
              setSearchFormClosed(true);
            }}
            allowFilters={true}
            generateLink={true}
          />
          {quickAddModal.visible &&
            quickAddModal?.formDetails?.modelName !== "quote" &&
            quickAddModal?.formDetails?.modelName !== "invoice" &&
            quickAddModal?.formDetails?.modelName !== "salesOrder" &&
            quickAddModal?.formDetails?.modelName !== "purchaseOrder" && (
              <>
                <GenericFormModalWrapper
                  onCancel={() => setQuickAddModal(emptyModalValues)}
                  formDetails={quickAddModal.formDetails}
                  onOutsideClick={() => setQuickAddModal(emptyModalValues)}
                  stopRouting={true}
                  passedId={""}
                  handleAddedRecord={(data, modelName) =>
                    handleAddedRecord(data, modelName)
                  }
                />
                <Backdrop onClick={() => setQuickAddModal(emptyModalValues)} />
              </>
            )}
        </div>
      </MassDeleteSessionIdContext.Provider>
    ) : null;
  }
);
