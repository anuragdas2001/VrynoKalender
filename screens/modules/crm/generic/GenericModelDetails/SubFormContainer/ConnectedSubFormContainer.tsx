import React from "react";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import ChooseFieldsIcon from "remixicon-react/ListCheckIcon";
import { AccountModels } from "../../../../../../models/Accounts";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { ICustomField } from "../../../../../../models/ICustomField";
import { getDataObjectArray } from "../../../shared/utils/getDataObject";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { getVisibleFieldsArray } from "../../../shared/utils/getFieldsArray";
import { NoViewPermission } from "../../../shared/components/NoViewPermission";
import { getSortedFieldList } from "../../../shared/utils/getOrderedFieldsList";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import { ChooseFieldsForReverseLookup } from "../ReverseLookupContainer/ChooseFieldsForReverseLookup";
import { LoadMoreDataComponent } from "../../../../../../components/TailwindControls/LoadMoreDataComponent";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { INavigation } from "../../../../../../models/INavigation";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { handleSelectedMassEmailRecord } from "../ReverseLookupContainer/massEmailSelectHandlerInSections";
import { SendEmailModalRecordsType } from "../GenericModelDetailsScreen";

function splitArray(array: string[], number: number) {
  const arrayLength = array.length;
  const startIndex = (number - 1) * 50;
  const endIndex = Math.min(number * 50 - 1, arrayLength - 1);
  if (startIndex >= arrayLength || startIndex < 0) {
    return []; // return empty array if startIndex is out of bounds
  }
  return array.slice(startIndex, endIndex + 1);
}

export const ConnectedSubFormContainer = ({
  id,
  data,
  field,
  serviceName,
  moduleName,
  parentModelName,
  userPreferences,
  genericModels,
  allLayoutFetched,
  moduleViewPermission,
  handleUpdateUserPreferences,
  handleOpenCollapseCardContainer,
  handleSubFormCount,
  setChooseFieldModalFromSideNavigation,
  navigations,
  sendMassEmailRecords,
  setSendMassEmailRecords = () => {},
}: {
  id: string;
  recordId: string;
  data: any;
  field: ICustomField;
  serviceName: string;
  moduleName: string;
  parentModelName: string;
  parentModelData: any;
  userPreferences: IUserPreference[];
  sideNavigationRefreshed?: boolean;
  chooseFieldModalFromSideNavigation: {
    reverseLookupName: string;
    visible: boolean;
  };
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  moduleViewPermission: boolean;
  handleUpdateUserPreferences: () => void;
  handleOpenCollapseCardContainer: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  handleSubFormCount: (count: number) => void;
  setChooseFieldModalFromSideNavigation: () => void;
  navigations: INavigation[];
  sendMassEmailRecords?: SendEmailModalRecordsType;
  setSendMassEmailRecords?: (
    value: SendEmailModalRecordsType | undefined
  ) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const isModuleAvailableInNavigation = navigations?.find(
    (nav) => nav?.navTypeMetadata?.moduleName === moduleName && nav.visible
  );
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [modelData, setModelData] = React.useState<Array<any>>([]);
  const [modelDataCount, setModelDataCount] = React.useState<number>(0);
  const [dataLoading, setDataLoading] = React.useState<boolean>(true);
  const [subFormFetchVariables, setSubFormFetchVariables] = React.useState({});

  const [availableFieldsList, setAvailableFieldsList] = React.useState<
    ICustomField[]
  >([]);
  const [selectedFieldsList, setSelectedFieldsList] = React.useState<
    ICustomField[]
  >([]);
  const [previousSelectedFieldList, setPreviousSelectedFieldList] =
    React.useState<ICustomField[]>([]);
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);

  const [viewPermission, setViewPermission] = React.useState(true);
  const [noViewFieldPermission, setNoViewFieldPermission] =
    React.useState<ICustomField | null>(null);

  const [subFormActivePageNumber, setSubFormActivePageNumber] =
    React.useState(1);

  const [chooseFieldModal, setChooseFieldModal] =
    React.useState<boolean>(false);
  const [moduleExists, setModuleExists] = React.useState(true);

  const [getDataList] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: serviceName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setModelData([
          ...modelData,
          ...getDataObjectArray(responseOnCompletion.fetch.data),
        ]);
        handleSubFormCount(data[field?.name]?.length || 0);
        if (!modelDataCount) setModelDataCount(data[field?.name]?.length);
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

  React.useEffect(() => {
    if (
      !Object.keys(subFormFetchVariables)?.length &&
      moduleViewPermission &&
      allLayoutFetched
    ) {
      let fieldsListFromStore = genericModels[moduleName]?.fieldsList ?? [];
      if (fieldsListFromStore?.length <= 0) {
        setModuleExists(false);
        return;
      }

      const variables: Record<string, any> = {
        fields: [
          ...getVisibleFieldsArray(
            fieldsListFromStore.filter(
              (field) => field.dataType !== "relatedTo"
            )
          ),
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
        ],
        filters: [
          {
            name: `id`,
            operator: "in",
            value:
              data[field?.name]?.length > 50
                ? data[field?.name].slice(0, 50)
                : data[field?.name] || [],
          },
          { name: "recordStatus", operator: "in", value: ["a", "i"] },
        ],
        orderBy: [{ name: "updatedAt", order: ["ASC"] }],
        modelName: moduleName,
      };
      try {
        setDataLoading(true);
        setSubFormFetchVariables(variables);
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
  }, [moduleViewPermission, allLayoutFetched]);

  React.useEffect(() => {
    if (
      fieldsList?.length > 0 &&
      userPreferences?.length > 0 &&
      parentModelName
    ) {
      let updatedAvailableFieldList: any[] = [];
      let updatedSelectedFieldList: any[] = [];
      let fields: string[] = [];
      if (
        userPreferences &&
        userPreferences?.length > 0 &&
        userPreferences[0]?.defaultPreferences &&
        userPreferences[0]?.defaultPreferences[parentModelName] &&
        userPreferences[0]?.defaultPreferences[parentModelName]["subForm"] &&
        userPreferences[0]?.defaultPreferences[parentModelName]["subForm"][
          field.name
        ]
      ) {
        fields = get(
          userPreferences[0]?.defaultPreferences[parentModelName]["subForm"],
          [field.name],
          []
        );
      }
      fieldsList.forEach((field: ICustomField) => {
        if (fields.findIndex((item) => item === field.name) === -1) {
          updatedAvailableFieldList = updatedAvailableFieldList.concat([field]);
        } else {
          updatedSelectedFieldList = updatedSelectedFieldList.concat([field]);
        }
      });

      setAvailableFieldsList(updatedAvailableFieldList);
      setSelectedFieldsList(updatedSelectedFieldList);
      setPreviousSelectedFieldList(updatedSelectedFieldList);
    }
  }, [fieldsList, userPreferences, parentModelName]);

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
                  subForm: get(
                    defaultPreferences[parentModelName],
                    "subForm",
                    null
                  )
                    ? {
                        ...get(
                          defaultPreferences[parentModelName],
                          "subForm",
                          null
                        ),
                        [field?.name]: selectedFieldsList.map(
                          (field) => field.name
                        ),
                      }
                    : {
                        [field?.name]: selectedFieldsList.map(
                          (field) => field.name
                        ),
                      },
                }
              : {
                  subForm: {
                    [field?.name]: selectedFieldsList.map(
                      (field) => field.name
                    ),
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
        cardHeading={field.label.en || "Sub Form"}
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
              id={`${field.label.en}-sub-form-choose-field-icon`}
              onClick={() => setChooseFieldModal(true)}
              customStyle={`rounded-full bg-gray-500 hover:bg-vryno-theme-light-blue flex items-center justify-center w-[24px] h-[24px] hover:cursor-pointer`}
              userEventName="open-subForm-choose-field-modal-click"
              data-testid={`${modelData}-sub-form`}
            >
              <ChooseFieldsIcon size={16} className="text-white" />
            </Button>
          </div>
        }
      >
        {!viewPermission ? (
          <NoViewPermission
            addPadding={false}
            modelName={moduleName.toUpperCase()}
            entireMessage={false}
            shadow={false}
            autoHeight={false}
            showIcon={false}
            containerPadding={""}
          />
        ) : !moduleExists ? (
          <div className="w-full flex items-center justify-center">
            <p
              className="text-vryno-danger text-sm"
              id={`${field.label.en}-module-not-found`}
            >
              Sub form module not found
            </p>
          </div>
        ) : (
          <div
            className={`${
              userPreferences?.[0]?.defaultPreferences?.[parentModelName]
                ?.selectedSizeView === "noLimit"
                ? ""
                : "overflow-y-auto max-h-64 max-w-[inherit]"
            }`}
          >
            {modelData.length > 0 ? (
              <div className="overflow-auto">
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
                    sendMassEmailRecords?.id === id || !sendMassEmailRecords?.id
                      ? true
                      : false
                  }
                  selectedItems={
                    sendMassEmailRecords &&
                    sendMassEmailRecords?.selectedItems?.length > 0
                      ? [...sendMassEmailRecords?.selectedItems]
                      : []
                  }
                  onItemSelect={(item) =>
                    handleSelectedMassEmailRecord(sendMassEmailRecords, item)
                      ?.length > 0
                      ? setSendMassEmailRecords({
                          id: id,
                          appName: SupportedApps.crm,
                          fieldsList: fieldsList,
                          currentModule: genericModels[moduleName]?.moduleInfo,
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
                    return isModuleAvailableInNavigation
                      ? appsUrlGenerator(
                          serviceName,
                          moduleName,
                          AllowedViews.detail,
                          item.id as string
                        )
                      : "#";
                  }}
                  oldGenericListUI={true}
                />
                <LoadMoreDataComponent
                  itemsCount={modelDataCount}
                  currentDataCount={modelData?.length}
                  loading={dataLoading}
                  handleLoadMoreClicked={() => {
                    try {
                      const pageNumber = subFormActivePageNumber + 1;
                      const arrayIds = splitArray(
                        data[field?.name],
                        pageNumber
                      );
                      setDataLoading(true);
                      getDataList({
                        variables: {
                          ...subFormFetchVariables,
                          filters: [
                            {
                              name: `id`,
                              operator: "in",
                              value: arrayIds,
                            },
                            {
                              name: "recordStatus",
                              operator: "in",
                              value: ["a", "i"],
                            },
                          ],
                        },
                      });
                      setSubFormActivePageNumber(pageNumber);
                    } catch (error) {
                      console.error(error);
                      setDataLoading(false);
                      setSubFormActivePageNumber(subFormActivePageNumber - 1);
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
        )}
      </GenericHeaderCardContainer>
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
