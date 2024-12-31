import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { useContext, ChangeEvent } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import GenericAddCustomViewForm from "./GenericAddCustomViewForm";
import { AllowedViews } from "../../../../../models/allowedViews";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../models/ICustomField";
import { customViewSave } from "./customViewHelpers/customViewSave";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { dataUploadHandler } from "../../shared/utils/dataUploadHandler";
import { InstanceStoreContext } from "../../../../../stores/InstanceStore";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { geCurrentViewPerModulePerInstancePerUser } from "../../shared/utils/getCurrentViewPerModulePerInstancePerUser";
import {
  customFilterValueExtractor,
  fieldNameExtractor,
} from "./customViewHelpers/customFilterHelper";
import {
  customViewFilterDataGenerator,
  customViewInitialDataDataGenerator,
} from "./customViewHelpers/customViewFetchHelpers";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import {
  BaseGenericObjectType,
  ICriteriaFilterRow,
  ICustomView,
  ISharingRuleData,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { FormikValues } from "formik";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { observer } from "mobx-react-lite";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";

export type GenericAddCustomViewProps = {
  appName: SupportedApps;
  modelName: string;
  fieldsList: Array<ICustomField>;
  uniqueCustomName: string;
};

const GenericAddCustomView = observer(
  ({
    appName,
    modelName,
    fieldsList,
    uniqueCustomName,
  }: GenericAddCustomViewProps) => {
    const { id, relatedFilter, relatedFilterId } = getAppPathParts();
    const router = useRouter();
    const { t } = useTranslation(["common"]);
    const { instances } = React.useContext(InstanceStoreContext);
    const { generalModelStore } = React.useContext(GeneralStoreContext);
    const {
      setCurrentCustomViewId,
      setCurrentCustomViewFilter,
      setCurrentCustomView,
      addCustomView,
      userPreferences,
    } = generalModelStore;
    const cookieUser = cookieUserStore.getUserDetails();
    const subDomain = window.location.hostname.split(".")[0];
    const findInstanceIndex = instances?.findIndex(
      (instance) => instance?.subdomain === subDomain
    );
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const updatedCurrentDashboardView = cookieUser?.id
      ? geCurrentViewPerModulePerInstancePerUser(
          cookieUser.id,
          instances[findInstanceIndex]?.id
        )
      : "";
    const currentModuleDashboardView: string =
      updatedCurrentDashboardView[cookieUser?.id as string][
        instances[findInstanceIndex]?.id as string
      ][modelName];
    const [processedFieldList, setProcessedFieldList] = React.useState<
      ISimplifiedCustomField[]
    >([]);
    const [availableFieldsList, setAvailableFieldsList] =
      React.useState<ISimplifiedCustomField[]>(processedFieldList);
    const [selectedFieldsList, setSelectedFieldsList] = React.useState<
      ISimplifiedCustomField[]
    >([]);
    const [availableThresholdFieldsList, setAvailableThresholdFieldsList] =
      React.useState<ISimplifiedCustomField[]>([]);
    const [selectedThresholdFieldsList, setSelectedThresholdFieldsList] =
      React.useState<ISimplifiedCustomField[]>([]);
    const [conditionList, setConditionList] = React.useState<
      ICriteriaFilterRow[]
    >([
      {
        [`fieldName${uniqueCustomName}`]: "",
        [`value${uniqueCustomName}`]: "",
      },
    ]);
    const [existingFileKey, setExistingFileKey] = React.useState<string | null>(
      null
    );
    const [orderByList, setOrderByList] = React.useState<
      Record<string, string>[]
    >([{}]);
    const [saveFormLoading, setSaveFormLoading] = React.useState(false);
    const sessionData = sessionStorage.getItem("ActiveModuleView");
    const [viewPermission, setViewPermission] = React.useState(true);
    const [fieldInitialValues, setFieldInitialValues] = React.useState({
      id: "",
      customViewName: "",
    });
    const [customViewLoading, setCustomViewLoading] = React.useState(false);
    const [moduleViewDataError, setModuleViewDataError] = React.useState(false);
    const [moduleViewData, setModuleViewData] =
      React.useState<ICustomView | null>(null);
    const [moduleViewSharingData, setModuleViewSharingData] =
      React.useState<ISharingRuleData | null>(null);

    const [saveCustomView] = useMutation<
      SaveData<ICustomView>,
      SaveVars<ICustomView>
    >(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
      onCompleted: (data) => {
        setSaveFormLoading(false);
        if (data.save.messageKey.includes("success")) {
          let sData = "{}";
          if (sessionData && sessionData.length) {
            sData = sessionData;
          }
          setCurrentCustomView(data.save.data, modelName);
          setCurrentCustomViewId(data.save.data.id, modelName);
          setCurrentCustomViewFilter(
            {
              filters: data.save.data.filters,
              expression: data.save.data.expression,
            },
            modelName
          );
          addCustomView(
            { ...data.save.data, expression: data.save.data.expression },
            modelName
          );
          sessionStorage.setItem(
            "ActiveModuleView",
            JSON.stringify({
              ...JSON.parse(sData),
              [modelName]: {
                moduleView: data.save.data.id,
                filters: data.save.data.filters,
                expression: data.save.data.expression,
              },
            })
          );
          toast.success(data.save.message);

          if (findInstanceIndex === -1 || !cookieUser?.id || !modelName) {
            router.push(
              relatedFilter == "reports"
                ? `/reports/crm/view/${relatedFilterId}`
                : appsUrlGenerator(
                    appName,
                    modelName,
                    AllowedViews.view,
                    SupportedDashboardViews.Card.toLocaleLowerCase()
                  )
            );
            return;
          } else {
            router.push(
              relatedFilter == "reports"
                ? `/reports/crm/view/${relatedFilterId}`
                : appsUrlGenerator(
                    appName,
                    modelName,
                    AllowedViews.view,
                    currentModuleDashboardView
                      ? currentModuleDashboardView.toLocaleLowerCase()
                      : SupportedDashboardViews.Card.toLocaleLowerCase()
                  )
            );
            return;
          }
        }
        if (data.save.messageKey) {
          toast.error(data.save.message);
          return;
        }
        toast.error(t("common:unknown-message"));
      },
    });

    const handleAvailableFieldSelection = (value: ISimplifiedCustomField) => {
      availableThresholdFieldsList.includes(value)
        ? setAvailableThresholdFieldsList(
            availableThresholdFieldsList.filter(
              (field) => JSON.stringify(field) !== JSON.stringify(value)
            )
          )
        : setAvailableThresholdFieldsList([
            ...availableThresholdFieldsList,
            value,
          ]);
    };

    const handleSelectedFieldSelection = (value: ISimplifiedCustomField) => {
      selectedThresholdFieldsList.includes(value)
        ? setSelectedThresholdFieldsList(
            selectedThresholdFieldsList.filter(
              (field) => JSON.stringify(field) !== JSON.stringify(value)
            )
          )
        : setSelectedThresholdFieldsList([
            ...selectedThresholdFieldsList,
            value,
          ]);
    };

    const handleAvailableFields = () => {
      setSelectedFieldsList([
        ...selectedFieldsList,
        ...availableThresholdFieldsList,
      ]);
      setAvailableFieldsList(
        availableFieldsList.filter(
          (field) => !availableThresholdFieldsList.includes(field)
        )
      );
      setAvailableThresholdFieldsList([]);
    };

    const handleSelectedFields = () => {
      setAvailableFieldsList([
        ...selectedThresholdFieldsList,
        ...availableFieldsList,
      ]);
      setSelectedFieldsList(
        selectedFieldsList.filter(
          (field) => !selectedThresholdFieldsList.includes(field)
        )
      );
      setSelectedThresholdFieldsList([]);
    };

    const handleOrderByChange = (
      e: ChangeEvent<HTMLSelectElement>,
      index: number
    ) => {
      const { name, value } = e.target;
      const oList = [...orderByList];
      oList[index][name] = value;
      setOrderByList(oList);
    };

    const handleOrderByRemoveClick = (index: number) => {
      const oList = [...orderByList];
      oList.splice(index, 1);
      let filteredList: Record<string, string>[] = [...orderByList].slice(
        0,
        index
      );
      for (let i = index; i < oList.length; i++) {
        const filteredValues: Record<string, string> = {};
        for (const key in oList[i]) {
          if (key === `orderByName${i + 1}`) {
            filteredValues[`orderByName${i}`] = oList[i][key];
          } else if (key === `orderByOrder${i + 1}`) {
            filteredValues[`orderByOrder${i}`] = oList[i][key];
          } else {
            filteredValues[key] = oList[i][key];
          }
        }
        filteredList = [...filteredList, filteredValues];
      }
      setOrderByList(filteredList);
    };

    const handleCustomViewSave = async (values: FormikValues) => {
      setSaveFormLoading(true);
      const saveInput: any = customViewSave(
        values,
        selectedFieldsList,
        conditionList,
        orderByList,
        modelName,
        processedFieldList,
        uniqueCustomName,
        fieldsList,
        user?.timezone
      );
      if (!saveInput) {
        setSaveFormLoading(false);
        return;
      }
      saveInput["sharedUsers"] = values["sharedUsers"] ?? [];
      saveInput["sharedType"] = values["sharedType"] ?? "onlyMe";
      const fileKey = await dataUploadHandler(
        "",
        existingFileKey,
        "moduleView",
        "crm",
        "text/csv"
      );
      try {
        saveCustomView({
          variables: {
            id: values.id ? values.id : null,
            modelName: "ModuleView",
            saveInput: {
              ...saveInput,
              expression: values.expression,
              fileKey: fileKey,
            },
          },
        });
      } catch (error) {
        setSaveFormLoading(false);
        console.error(error);
      }
    };

    const [getCustomViewData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (
          responseOnCompletion?.fetch.data &&
          responseOnCompletion?.fetch.data.length === 1
        ) {
          const responseData = responseOnCompletion.fetch.data[0];
          setModuleViewSharingData({
            sharedType: responseData.sharedType,
            sharedUsers: responseData.sharedUsers,
          });
          setModuleViewData(responseData);
          setExistingFileKey(responseData?.fileName ?? null);
          const filteredFilterData = customFilterValueExtractor(
            responseData.filters
          );
          if (filteredFilterData) {
            responseData["filters"] = filteredFilterData;
          }
          let orderByData = {};
          let orderByList: Record<string, string>[] = [];
          responseData.orderBy.forEach(
            (val: BaseGenericObjectType, index: number) => {
              orderByData = {
                ...orderByData,
                [`orderByName${index}`]: fieldNameExtractor(val.name),
                [`orderByOrder${index}`]: val.order.pop(),
              };
              orderByList.push(orderByData);
            }
          );

          const selectedFieldsResponse = responseData.moduleFields.map(
            (field: string) => fieldNameExtractor(field)
          );
          const selectedFields = [];
          const availableFields = [];
          for (const field of availableFieldsList) {
            let found = false;
            for (const fieldName of selectedFieldsResponse) {
              if (fieldName == field.value) {
                found = true;
                break;
              }
            }
            if (!found) availableFields.push(field);
          }
          for (const fieldName of selectedFieldsResponse) {
            for (const field of availableFieldsList) {
              if (fieldName == field.value) {
                selectedFields.push(field);
              }
            }
          }
          const fieldInitialData = customViewInitialDataDataGenerator(
            responseData.filters,
            processedFieldList,
            uniqueCustomName
          );
          const conditionListData: ICriteriaFilterRow[] =
            customViewFilterDataGenerator(
              responseData.filters,
              processedFieldList,
              uniqueCustomName
            );
          setSelectedFieldsList(selectedFields);
          setAvailableFieldsList(availableFields);
          setFieldInitialValues({
            ...fieldInitialValues,
            ...orderByData,
            ...fieldInitialData,
            id: responseData.id,
            customViewName: responseData.name,
          });
          if (conditionListData.length) {
            setConditionList(conditionListData);
          }
          setOrderByList(
            responseData.orderBy.length === 0 ? [{}] : orderByList
          );
          setCustomViewLoading(true);
        } else if (
          responseOnCompletion.fetch?.messageKey.includes("requires-view")
        ) {
          toast.error(
            `${responseOnCompletion?.fetch.messageKey} : ${responseOnCompletion?.fetch.message}`
          );
          setViewPermission(false);
        } else {
          toast.error("Unexpected Module View Response");
          setModuleViewDataError(true);
        }
      },
    });

    React.useEffect(() => {
      if (id && appName) {
        getCustomViewData({
          variables: {
            modelName: "ModuleView",
            fields: [
              "name",
              "moduleName",
              "filters",
              "moduleFields",
              "recordsPerPage",
              "orderBy",
              "config",
              "isShared",
              "createdBy",
              "sharedUsers",
              "sharedType",
            ],
            filters: [{ name: "id", operator: "eq", value: [id] }],
          },
        });
      }
    }, [id, appName]);

    React.useEffect(() => {
      if (fieldsList?.length > 0) {
        setProcessedFieldList([
          ...fieldsList
            .filter(
              (field) =>
                !["id", "recordStatus", "layoutId"].includes(field.name)
            )
            .map((field: ICustomField) => {
              return {
                value: field.name,
                label: field.label["en"],
                dataType: field.dataType,
                systemDefined: field.systemDefined,
                dataTypeMetadata: field.dataTypeMetadata,
              };
            }),
        ]);
      }
    }, [fieldsList]);

    React.useEffect(() => {
      if (processedFieldList?.length > 0) {
        setAvailableFieldsList([...processedFieldList]);
      }
    }, [processedFieldList]);

    if (fieldsList.length <= 0) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    const component = () => {
      return !fieldsList.length ? (
        <div
          style={{
            height: (window.innerHeight * 4) / 6,
          }}
          className="w-full flex flex-col items-center justify-center"
        >
          <PageLoader />
        </div>
      ) : (
        <GenericAddCustomViewForm
          fieldInitialValues={fieldInitialValues}
          id={id}
          appName={appName}
          modelName={modelName}
          fieldsList={fieldsList}
          loading={saveFormLoading}
          currentModuleDashboardView={currentModuleDashboardView}
          selectedFieldsList={selectedFieldsList}
          selectedThresholdFieldsList={selectedThresholdFieldsList}
          availableFieldsList={availableFieldsList}
          availableThresholdFieldsList={availableThresholdFieldsList}
          handleAvailableFieldSelection={handleAvailableFieldSelection}
          conditionList={conditionList}
          orderByList={orderByList}
          handleSubmit={(values) => handleCustomViewSave(values)}
          setSelectedThresholdFieldsList={(value) =>
            setSelectedThresholdFieldsList(value)
          }
          handleAvailableFields={handleAvailableFields}
          handleSelectedFields={handleSelectedFields}
          handleSelectedFieldSelection={handleSelectedFieldSelection}
          setAvailableThresholdFieldsList={(value) =>
            setAvailableThresholdFieldsList(value)
          }
          handleOrderByAddClick={() => setOrderByList([...orderByList, {}])}
          handleOrderByRemoveClick={handleOrderByRemoveClick}
          setConditionList={(value: ICriteriaFilterRow[]) => {
            setConditionList(value);
          }}
          handleOrderByChange={handleOrderByChange}
          resetOrderBy={() => setOrderByList([{}])}
          editMode={true}
          relatedFilter={relatedFilter}
          relatedFilterId={relatedFilterId}
          uniqueCustomName={uniqueCustomName}
          moduleViewData={moduleViewData}
          moduleViewSharingData={moduleViewSharingData}
          userPreferences={userPreferences}
        />
      );
    };

    return viewPermission ? (
      moduleViewDataError ? (
        <div
          style={{
            height: (window.innerHeight * 4) / 6,
          }}
          className="w-full flex flex-col  items-center justify-center"
        >
          <div className="w-full max-w-sm max-h-64 flex flex-col items-center justify-center h-full rounded-xl p-6 bg-white">
            <p className="font-medium w-full text-center">
              {"Unexpected Module View Response"}
            </p>
          </div>
        </div>
      ) : id?.length ? (
        customViewLoading ? (
          component()
        ) : (
          <div
            style={{
              height: (window.innerHeight * 4) / 6,
            }}
            className="w-full flex flex-col items-center justify-center"
          >
            <PageLoader />
          </div>
        )
      ) : (
        component()
      )
    ) : (
      <NoViewPermission />
    );
  }
);
export default GenericAddCustomView;
