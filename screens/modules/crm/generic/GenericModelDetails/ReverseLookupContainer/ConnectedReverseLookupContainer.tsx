import { useLazyQuery, useMutation } from "@apollo/client";
import _, { get, orderBy } from "lodash";
import React, { useContext } from "react";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { ICustomField } from "../../../../../../models/ICustomField";
import { ReverseLookup } from "../../../../../../models/IModuleMetadata";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import { getDataObjectArray } from "../../../shared/utils/getDataObject";
import AddIcon from "remixicon-react/AddLineIcon";
import ChooseFieldsIcon from "remixicon-react/ListCheckIcon";
import {
  getAllFieldsObjectArray,
  getVisibleFieldsArray,
} from "../../../shared/utils/getFieldsArray";
import { getSortedFieldList } from "../../../shared/utils/getOrderedFieldsList";
import GenericFormModalWrapper from "../../../../../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { ChooseFieldsForReverseLookup } from "./ChooseFieldsForReverseLookup";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { useTranslation } from "next-i18next";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { SupportedLabelLocations } from "../../../../../../components/TailwindControls/SupportedLabelLocations";
import { Formik } from "formik";
import { calculateTaxValue } from "../../../../../../components/TailwindControls/Form/QuoteTax/QuoteTax";
import { useRouter } from "next/router";
import { NoViewPermission } from "../../../shared/components/NoViewPermission";
import { capitalCase } from "change-case";
import { AccountModels } from "../../../../../../models/Accounts";
import { LoadMoreDataComponent } from "../../../../../../components/TailwindControls/LoadMoreDataComponent";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SendEmailModalRecordsType } from "../GenericModelDetailsScreen";
import { handleSelectedMassEmailRecord } from "./massEmailSelectHandlerInSections";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
  reverseLookupURLGenerator,
} from "../../../shared/utils/modelNameMapperForParamUrlGenerator";

export type ConnectedReverseLookupContainerProps = {
  id: string;
  reverseLookup: ReverseLookup;
  recordId: string;
  moduleUniqueName: string;
  serviceName: string;
  moduleName: string;
  userPreferences: IUserPreference[];
  parentModelName: string;
  sideNavigationRefreshed?: boolean;
  parentModelData: any;
  chooseFieldModalFromSideNavigation: {
    reverseLookupName: string;
    visible: boolean;
  };
  quickCreateModalFromSideNavigation: {
    reverseLookupName: string;
    visible: boolean;
  };
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  sendMassEmailRecords?: SendEmailModalRecordsType;
  setSendMassEmailRecords?: (
    value: SendEmailModalRecordsType | undefined
  ) => void;
  setChooseFieldModalFromSideNavigation: () => void;
  setQuickCreateModalFromSideNavigation: (
    reverseLookupName: string,
    visible: boolean
  ) => void;
  handleReverseRecordLookupsCount: (count: number) => void;
  handleUpdateUserPreferences: () => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
};

export const ConnectedReverseLookupContainer = ({
  id,
  reverseLookup,
  recordId,
  moduleUniqueName,
  moduleName,
  serviceName,
  userPreferences,
  parentModelName,
  parentModelData,
  genericModels,
  allLayoutFetched,
  quickCreateModalFromSideNavigation,
  chooseFieldModalFromSideNavigation,
  sendMassEmailRecords,
  setSendMassEmailRecords = () => {},
  setChooseFieldModalFromSideNavigation = () => {},
  setQuickCreateModalFromSideNavigation = () => {},
  handleReverseRecordLookupsCount = () => {},
  handleUpdateUserPreferences = () => {},
  handleOpenCollapseCardContainer = () => {},
}: ConnectedReverseLookupContainerProps) => {
  const { t } = useTranslation(["common"]);
  const router = useRouter();
  const { navigations } = useContext(NavigationStoreContext);
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [modelData, setModelData] = React.useState<Array<any>>([]);
  const [modelDataCount, setModelDataCount] = React.useState<number>(0);
  const [reverseLookupFetchVariables, setReverseLookupFetchVariables] =
    React.useState({});
  const [reverseLookupActivePageNumber, setReverseLookupActivePageNumber] =
    React.useState(1);
  const [dataLoading, setDataLoading] = React.useState<boolean>(true);
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [externalData, setExternalData] = React.useState<{
    [key: string]: any;
  }>({});

  const [availableFieldsList, setAvailableFieldsList] = React.useState<
    ICustomField[]
  >([]);
  const [selectedFieldsList, setSelectedFieldsList] = React.useState<
    ICustomField[]
  >([]);
  const [previousSelectedFieldList, setPreviousSelectedFieldList] =
    React.useState<ICustomField[]>([]);

  const [quickCreateModal, setQuickCreateModal] =
    React.useState<boolean>(false);
  const [chooseFieldModal, setChooseFieldModal] =
    React.useState<boolean>(false);

  const [viewPermission, setViewPermission] = React.useState(true);
  const [noViewFieldPermission, setNoViewFieldPermission] =
    React.useState<ICustomField | null>(null);

  React.useEffect(() => {
    if (
      fieldsList?.length > 0 &&
      userPreferences?.length > 0 &&
      parentModelName &&
      reverseLookup
    ) {
      let updatedAvailableFieldList: any[] = [];
      let updatedSelectedFieldList: any[] = [];
      let fields: string[] = [];
      if (
        userPreferences &&
        userPreferences?.length > 0 &&
        userPreferences[0]?.defaultPreferences &&
        userPreferences[0]?.defaultPreferences[parentModelName] &&
        userPreferences[0]?.defaultPreferences[parentModelName][
          "reverseLookup"
        ] &&
        userPreferences[0]?.defaultPreferences[parentModelName][
          "reverseLookup"
        ][reverseLookup?.moduleName] &&
        userPreferences[0]?.defaultPreferences[parentModelName][
          "reverseLookup"
        ][reverseLookup?.moduleName][reverseLookup?.fieldName]
      ) {
        fields = get(
          userPreferences[0]?.defaultPreferences[parentModelName][
            "reverseLookup"
          ][reverseLookup?.moduleName],
          [reverseLookup?.fieldName],
          []
        );
      }

      if (fields?.length > 0) {
        fields.forEach((field) => {
          const fieldIndex = fieldsList.findIndex(
            (fieldList) => fieldList.name === field
          );
          if (fieldIndex !== -1) {
            updatedSelectedFieldList.push(fieldsList[fieldIndex]);
          }
        });
      }

      fieldsList.forEach((field: ICustomField) => {
        if (fields.findIndex((item) => item === field.name) === -1) {
          updatedAvailableFieldList.push(field);
        }
      });
      setAvailableFieldsList(updatedAvailableFieldList);
      setSelectedFieldsList(updatedSelectedFieldList);
      setPreviousSelectedFieldList(updatedSelectedFieldList);
    }
  }, [fieldsList, userPreferences, parentModelName, reverseLookup]);

  React.useEffect(() => {
    if (fieldsList?.length > 0 && reverseLookup) {
      if (
        reverseLookup?.fieldUniqueName ===
        chooseFieldModalFromSideNavigation?.reverseLookupName
      ) {
        setChooseFieldModal(true);
      }
    }
  }, [fieldsList, reverseLookup, chooseFieldModalFromSideNavigation]);

  React.useEffect(() => {
    if (fieldsList?.length > 0 && reverseLookup) {
      if (
        reverseLookup?.fieldUniqueName ===
        quickCreateModalFromSideNavigation?.reverseLookupName
      ) {
        let dependentField = [
          {
            parentDependentField: `${reverseLookup.fieldName}`,
            parentDependentFieldValue: recordId,
          },
        ];

        if (parentModelData?.["contactId"]) {
          dependentField.push({
            parentDependentField: "contactId",
            parentDependentFieldValue: parentModelData?.["contactId"],
          });
        }
        if (parentModelData?.["organizationId"]) {
          dependentField.push({
            parentDependentField: "organizationId",
            parentDependentFieldValue: parentModelData?.["organizationId"],
          });
        }

        let defaultReverseLookupURLGenerator = reverseLookupURLGenerator({
          dependentField: [...dependentField],
          subFormName: modelNameMapperForParamURLGenerator(
            reverseLookup?.moduleName
          )?.subForm,
          dependingModule: "product",
        });

        reverseLookup?.summarySection?.length > 0
          ? router.push(
              appsUrlGenerator(
                serviceName,
                parentModelName,
                AllowedViews.edit,
                parentModelData?.id,
                modelNameValuesWithSystemSubForm.includes(parentModelName)
                  ? [
                      `?subform=${
                        modelNameMapperForParamURLGenerator(parentModelName)
                          ?.subForm
                      }&&dependingModule=product&&subformfield=${
                        modelNameMapperForParamURLGenerator(parentModelName)
                          ?.subFormFieldLinked
                      }`,
                    ]
                  : []
              )
            )
          : modelNameValuesWithSystemSubForm?.includes(
              reverseLookup?.moduleName
            )
          ? router?.replace(
              appsUrlGenerator(
                serviceName,
                reverseLookup?.moduleName,
                AllowedViews.add,
                undefined,
                modelNameValuesWithSystemSubForm?.includes(
                  reverseLookup?.moduleName
                )
                  ? [defaultReverseLookupURLGenerator]
                  : []
              )
            )
          : setQuickCreateModal(true);
      }
    }
  }, [fieldsList, reverseLookup, quickCreateModalFromSideNavigation]);

  const [getDataList] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: serviceName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        let updatedData = [...modelData];
        for (let fetchedData of getDataObjectArray(
          responseOnCompletion.fetch.data
        )) {
          let findIndexIfAlreadyExist = updatedData?.findIndex(
            (data) => data.id === fetchedData.id
          );
          if (findIndexIfAlreadyExist === -1) {
            updatedData.push(fetchedData);
          } else {
            updatedData[findIndexIfAlreadyExist] = { ...fetchedData };
          }
        }
        setModelData([...updatedData]);
        handleReverseRecordLookupsCount(responseOnCompletion.fetch.count);
        if (!modelDataCount)
          setModelDataCount(responseOnCompletion.fetch.count);
      }
      if (responseOnCompletion.fetch?.messageKey.includes("requires-view")) {
        setViewPermission(false);
      }
      setDataLoading(false);
    },
    onError: () => {
      setDataLoading(false);
    },
  });

  const [saveUserPreference] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        Toast.success(responseOnCompletion.save.message);
        handleUpdateUserPreferences();
        setSavingProcess(false);
        setChooseFieldModalFromSideNavigation();
        setChooseFieldModal(false);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        setSavingProcess(false);
        setSelectedFieldsList(previousSelectedFieldList);
        return;
      }
      Toast.error(t("common:unknown-message"));
      setSavingProcess(false);
      setSelectedFieldsList(previousSelectedFieldList);
      return;
    },
  });
  React.useEffect(() => {
    if (!Object.keys(reverseLookupFetchVariables)?.length && allLayoutFetched) {
      let fieldsListFromStore = genericModels[moduleName]?.fieldsList ?? [];
      if (fieldsListFromStore?.length <= 0) return;

      let fieldsArray = getAllFieldsObjectArray(fieldsListFromStore);
      let reverseLookupField = fieldsArray?.filter(
        (field) => field.value === reverseLookup.fieldName
      );

      if (reverseLookupField?.length === 0) {
        let hiddenFieldPermission = null;
        for (const field of fieldsListFromStore) {
          if (field.name === reverseLookup.fieldName && !field.visible) {
            hiddenFieldPermission = field;
            break;
          }
        }
        setNoViewFieldPermission(hiddenFieldPermission);
        return;
      }
      const variables: Record<string, any> = {
        fields: [
          ...getVisibleFieldsArray(fieldsListFromStore),
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
        ],
        filters: [
          {
            name: `${
              reverseLookup.fieldName.includes("custom")
                ? `fields.${reverseLookup.fieldName}`
                : `${reverseLookup.fieldName}`
            }`,
            operator:
              reverseLookupField && reverseLookupField?.length > 0
                ? reverseLookupField[0].dataType === "multiSelectRecordLookup"
                  ? "any"
                  : "in"
                : "in",
            value: [recordId?.toString() || ""],
          },
          {
            operator: "in",
            name: "recordStatus",
            value: ["a", "i"],
          },
        ],
        orderBy: [{ name: "updatedAt", order: ["ASC"] }],
        modelName: moduleName,
      };
      try {
        setDataLoading(true);
        setReverseLookupFetchVariables(variables);
        getDataList({
          variables: variables,
        });
      } catch (error) {
        console.error(error);
        setDataLoading(false);
      }
      const filteredFields = getSortedFieldList(fieldsListFromStore)?.filter(
        (field) => {
          if (
            [
              "convertedOn",
              "leadConverted",
              "convertedBy",
              "convertedContactId",
              "convertedOrganizationId",
              "convertedDealId",
            ].includes(field.name) &&
            field.systemDefined &&
            field.visible
          ) {
          } else if (field.visible) return field;
        }
      );
      setFieldsList(filteredFields);
      setAvailableFieldsList(filteredFields);
    }
  }, [userPreferences, allLayoutFetched]);

  React.useEffect(() => {
    if (reverseLookup && fieldsList && fieldsList?.length > 0) {
      const findIndex = fieldsList?.findIndex(
        (field) => field.name === reverseLookup?.fieldName
      );
      if (findIndex !== -1) {
        if (
          fieldsList[findIndex]?.dataType === "multiSelectLookup" ||
          fieldsList[findIndex]?.dataType === "multiSelectRecordLookup"
        ) {
          setExternalData({ [reverseLookup?.fieldName]: [recordId] });
        } else {
          if (
            (reverseLookup.moduleName === "deal" ||
              reverseLookup.moduleName === "quote" ||
              reverseLookup?.moduleName === "salesOrder" ||
              reverseLookup?.moduleName === "purchaseOrder" ||
              reverseLookup?.moduleName === "invoice") &&
            reverseLookup.fieldName === "contactId" &&
            parentModelData?.["organizationId"]
          ) {
            setExternalData({
              [reverseLookup?.fieldName]: recordId,
              organizationId: parentModelData?.["organizationId"],
            });
          } else if (
            reverseLookup.moduleName === "quote" ||
            reverseLookup?.moduleName === "salesOrder" ||
            reverseLookup?.moduleName === "purchaseOrder" ||
            reverseLookup?.moduleName === "invoice"
          ) {
            if (reverseLookup.fieldName === "contactId") {
              setExternalData({
                [reverseLookup?.fieldName]: recordId,
                organizationId: parentModelData?.["organizationId"] || null,
              });
            } else if (reverseLookup.fieldName === "dealId") {
              setExternalData({
                [reverseLookup?.fieldName]: recordId,
                contactId: parentModelData?.["contactId"] || null,
                organizationId: parentModelData?.["organizationId"] || null,
              });
            } else setExternalData({ [reverseLookup?.fieldName]: recordId });
          } else {
            setExternalData({ [reverseLookup?.fieldName]: recordId });
          }
        }
      }
    }
  }, [fieldsList, reverseLookup]);

  const handleAvailableFields = (fields: ICustomField[]) => {
    let updatedAvailableArray = [...availableFieldsList];
    updatedAvailableArray = updatedAvailableArray.filter((item) => {
      if (
        fields.findIndex((field) => field.uniqueName === item.uniqueName) === -1
      ) {
        return item;
      }
    });
    setAvailableFieldsList(updatedAvailableArray);
    setSelectedFieldsList([...selectedFieldsList, ...fields]);
  };

  const handleSelectedFields = (fields: ICustomField[]) => {
    let updatedSelectedArray = [...selectedFieldsList];
    updatedSelectedArray = updatedSelectedArray.filter((item) => {
      if (
        fields.findIndex((field) => field.uniqueName === item.uniqueName) === -1
      ) {
        return item;
      }
    });
    setSelectedFieldsList(updatedSelectedArray);
    setAvailableFieldsList([...availableFieldsList, ...fields]);
  };

  const handleSave = () => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    setSavingProcess(true);
    setPreviousSelectedFieldList(selectedFieldsList);

    saveUserPreference({
      variables: {
        id: updatedUserPreferences ? updatedUserPreferences.id : null,
        modelName: AccountModels.Preference,
        saveInput: {
          defaultPreferences: {
            ...defaultPreferences,
            [parentModelName]: get(defaultPreferences, parentModelName, null)
              ? {
                  ...get(defaultPreferences, parentModelName),
                  ["reverseLookup"]: get(
                    defaultPreferences[parentModelName],
                    "reverseLookup",
                    null
                  )
                    ? get(
                        defaultPreferences[parentModelName]["reverseLookup"],
                        moduleName,
                        null
                      )
                      ? {
                          ...get(
                            defaultPreferences[parentModelName],
                            "reverseLookup",
                            null
                          ),
                          [moduleName]: {
                            ...get(
                              defaultPreferences[parentModelName][
                                "reverseLookup"
                              ],
                              moduleName,
                              null
                            ),
                            [reverseLookup?.fieldName]: selectedFieldsList.map(
                              (field) => field.name
                            ),
                          },
                        }
                      : {
                          ...get(
                            defaultPreferences[parentModelName],
                            "reverseLookup",
                            null
                          ),
                          [moduleName]: {
                            [reverseLookup?.fieldName]: selectedFieldsList.map(
                              (field) => field.name
                            ),
                          },
                        }
                    : {
                        [moduleName]: {
                          [reverseLookup?.fieldName]: selectedFieldsList.map(
                            (field) => field.name
                          ),
                        },
                      },
                }
              : {
                  reverseLookup: {
                    [moduleName]: {
                      [reverseLookup?.fieldName]: selectedFieldsList.map(
                        (field) => field.name
                      ),
                    },
                  },
                },
          },
          serviceName: SupportedApps.crm,
        },
      },
    });
  };

  return (
    <>
      <GenericHeaderCardContainer
        cardHeading={`${get(reverseLookup.displayedAs, "en", moduleName)}`}
        extended={true}
        id={id}
        modelName={parentModelName}
        userPreferences={userPreferences}
        handleOpenCollapseCardContainer={(id, showDetails) =>
          handleOpenCollapseCardContainer(id, showDetails)
        }
        headerButton={
          <div className={`h-9 flex items-center gap-x-4`}>
            <Button
              id={`${get(
                reverseLookup.displayedAs,
                "en",
                moduleName
              )}-reverse-lookup-choose-field-icon`}
              onClick={() => setChooseFieldModal(true)}
              customStyle={`rounded-full bg-gray-500 hover:bg-vryno-theme-light-blue flex items-center justify-center w-[24px] h-[24px] hover:cursor-pointer`}
              userEventName="open-reverseLookup-choose-field-modal-click"
              data-testid={`${modelData}-reverse-lookup`}
            >
              <ChooseFieldsIcon size={16} className="text-white" />
            </Button>
            <Button
              id={`${get(
                reverseLookup.displayedAs,
                "en",
                moduleName
              )}-reverse-lookup-quick-create-icon`}
              onClick={() => {
                if (
                  reverseLookup?.moduleName !== "quotedItem" &&
                  reverseLookup?.moduleName !== "orderedItem" &&
                  reverseLookup?.moduleName !== "invoicedItem" &&
                  reverseLookup?.moduleName !== "purchaseItem"
                ) {
                  setQuickCreateModal(true);
                }
                setQuickCreateModalFromSideNavigation(
                  reverseLookup?.fieldUniqueName,
                  true
                );
              }}
              customStyle={`rounded-full ${
                !viewPermission
                  ? "bg-gray-500 opacity-50 hover:opacity-40"
                  : "bg-gray-500 hover:bg-vryno-theme-light-blue"
              } flex items-center justify-center w-[24px] h-[24px] hover:cursor-pointer`}
              userEventName="open-reverseLookup-quickCreate-modal-click"
              disabled={!viewPermission}
            >
              <AddIcon size={16} className={`text-white `} />
            </Button>
          </div>
        }
      >
        {viewPermission ? (
          noViewFieldPermission ? (
            <div className="w-full flex items-center justify-center">
              <span className="text-sm text-gray-600">
                No view permission for{" "}
                <span className="font-medium">{`${capitalCase(
                  reverseLookup.moduleName
                )}: ${
                  noViewFieldPermission?.label?.en ||
                  noViewFieldPermission?.name ||
                  ""
                }`}</span>
              </span>
            </div>
          ) : (
            <>
              <div
                className={`${
                  userPreferences?.[0]?.defaultPreferences?.[parentModelName]
                    ?.selectedSizeView === "noLimit"
                    ? "overflow-x-auto max-w-[inherit]"
                    : "overflow-y-auto max-h-64 max-w-[inherit]"
                }`}
              >
                {Object.keys(modelData).length > 0 ? (
                  <div className="">
                    <GenericList
                      tableHeaders={
                        selectedFieldsList?.length > 0
                          ? selectedFieldsList
                              ?.filter((field) => field.visible)
                              ?.map((field) => {
                                return {
                                  columnName: field.name,
                                  label: field.label.en,
                                  dataType: field.dataType,
                                };
                              })
                          : fieldsList
                              ?.filter((field) => field.visible)
                              ?.map((field) => {
                                return {
                                  columnName: field.name,
                                  label: field.label.en,
                                  dataType: field.dataType,
                                };
                              })
                      }
                      data={modelData}
                      listSelector={
                        sendMassEmailRecords?.id === id ||
                        !sendMassEmailRecords?.id
                          ? true
                          : false
                      }
                      insertInDataTestId={`${get(
                        reverseLookup.displayedAs,
                        "en",
                        moduleName
                      )}`}
                      selectedItems={
                        sendMassEmailRecords &&
                        sendMassEmailRecords?.selectedItems?.length > 0
                          ? [...sendMassEmailRecords?.selectedItems]
                          : []
                      }
                      onItemSelect={(item) =>
                        handleSelectedMassEmailRecord(
                          sendMassEmailRecords,
                          item
                        )?.length > 0
                          ? setSendMassEmailRecords({
                              id: id,
                              appName: SupportedApps.crm,
                              fieldsList: fieldsList,
                              currentModule:
                                genericModels[moduleName]?.moduleInfo,
                              modelName: moduleName,
                              selectedItems: handleSelectedMassEmailRecord(
                                sendMassEmailRecords,
                                item
                              ),
                            })
                          : setSendMassEmailRecords(undefined)
                      }
                      fieldsList={fieldsList}
                      externalModelName={moduleName}
                      rowUrlGenerator={(item) => {
                        if (
                          navigations?.filter(
                            (navigation) =>
                              _.get(
                                navigation?.navTypeMetadata,
                                "moduleName",
                                ""
                              ) === moduleName && navigation?.visible
                          )?.length > 0
                        ) {
                          return appsUrlGenerator(
                            serviceName,
                            moduleName,
                            AllowedViews.detail,
                            item.id as string
                          );
                        } else {
                          return ``;
                        }
                      }}
                      oldGenericListUI={true}
                    />
                    <LoadMoreDataComponent
                      itemsCount={modelDataCount}
                      currentDataCount={modelData?.length}
                      loading={dataLoading}
                      handleLoadMoreClicked={() => {
                        try {
                          const pageNumber = reverseLookupActivePageNumber + 1;
                          setDataLoading(true);
                          getDataList({
                            variables: {
                              ...reverseLookupFetchVariables,
                              pageNumber: pageNumber,
                            },
                          });
                          setReverseLookupActivePageNumber(pageNumber);
                        } catch (error) {
                          console.error(error);
                          setDataLoading(false);
                          setReverseLookupActivePageNumber(
                            reverseLookupActivePageNumber - 1
                          );
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <span className="text-sm text-gray-600">No Data Found</span>
                  </div>
                )}
              </div>
              <div
                className={`flex w-full items-center justify-end mt-4 ${
                  reverseLookup?.summarySection?.length > 0 &&
                  Object.keys(modelData)?.length > 0
                    ? ""
                    : "hidden"
                }`}
              >
                <div
                  className={`w-full sm:w-1/2 md:w-1/3 rounded-lg bg-vryno-light-fade-blue px-6`}
                >
                  <Formik
                    initialValues={{}}
                    enableReinitialize
                    onSubmit={() => {}}
                  >
                    {() => (
                      <>
                        {reverseLookup?.summarySection?.flatMap(
                          (
                            field: {
                              aggregation_method: string;
                              expression: string;
                              fieldsUsed: [string];
                              displayAs: { en: string };
                              name: string;
                              module_name: string;
                              value: string | number | null | undefined;
                            },
                            index: number
                          ) => {
                            return (
                              <div key={`field_${index}`}>
                                <FormInputBox
                                  name={`${field?.name}`}
                                  label={field?.displayAs?.en}
                                  labelLocation={
                                    SupportedLabelLocations?.OnLeftSide
                                  }
                                  disabled={true}
                                  value={
                                    field.name === "taxes"
                                      ? calculateTaxValue(
                                          parentModelData[`${field?.name}`]
                                        )
                                      : field.name === "discount"
                                      ? get(
                                          parentModelData[`${field?.name}`],
                                          "amount",
                                          0
                                        )
                                      : parentModelData[`${field?.name}`]
                                  }
                                />
                              </div>
                            );
                          }
                        )}
                      </>
                    )}
                  </Formik>
                </div>
              </div>
            </>
          )
        ) : (
          <NoViewPermission
            addPadding={false}
            modelName={moduleName.toUpperCase()}
            entireMessage={false}
            shadow={false}
            autoHeight={false}
            showIcon={false}
            containerPadding={""}
          />
        )}
      </GenericHeaderCardContainer>
      {quickCreateModal && (
        <>
          <GenericFormModalWrapper
            onCancel={() => {
              setQuickCreateModal(false);
              setQuickCreateModalFromSideNavigation("", false);
            }}
            formDetails={{
              type: "Add",
              parentId: "",
              parentModelName: "",
              aliasName: `${get(reverseLookup.displayedAs, "en", moduleName)}`,
              id: null,
              modelName: moduleName,
              appName: "crm",
              quickCreate: true,
            }}
            externalData={externalData}
            onOutsideClick={() => {
              setQuickCreateModal(false);
              setQuickCreateModalFromSideNavigation("", false);
            }}
            stopRouting={true}
            passedId={""}
            handleAddedRecord={(data, modelName) => {
              setModelData(
                data?.fields
                  ? [{ ...data, ...data?.fields }].concat(modelData)
                  : [data].concat(modelData)
              );
              handleReverseRecordLookupsCount(modelDataCount + 1);
              setModelDataCount(modelDataCount + 1);
            }}
          />
          <Backdrop
            onClick={() => {
              setQuickCreateModal(false);
              setQuickCreateModalFromSideNavigation("", false);
            }}
          />
        </>
      )}
      {chooseFieldModal && (
        <>
          <ChooseFieldsForReverseLookup
            availableFieldsList={availableFieldsList}
            selectedFieldsList={selectedFieldsList}
            onCancel={() => {
              setChooseFieldModalFromSideNavigation();
              setChooseFieldModal(false);
              setSelectedFieldsList(previousSelectedFieldList);
            }}
            handleAvailableFields={(fields) => handleAvailableFields(fields)}
            handleSelectedFields={(fields) => handleSelectedFields(fields)}
            handleSave={() => handleSave()}
            loading={savingProcess}
          />
          <Backdrop
            onClick={() => {
              setChooseFieldModalFromSideNavigation();
              setChooseFieldModal(false);
              setSelectedFieldsList(previousSelectedFieldList);
            }}
          />
        </>
      )}
    </>
  );
};
