import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { startCase, toLower, get } from "lodash";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SupportedApps } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import {
  getDataObject,
  getDataObjectArray,
} from "../../../shared/utils/getDataObject";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { SingleActivityContainerItem } from "./SingleActivityContainerItem";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { getVisibleFieldsArray } from "../../../shared/utils/getFieldsArray";
import { NoViewPermission } from "../../../shared/components/NoViewPermission";
import { getSortedFieldList } from "../../../shared/utils/getOrderedFieldsList";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { ChooseFieldsForReverseLookup } from "../ReverseLookupContainer/ChooseFieldsForReverseLookup";
import {
  IDeleteActivityItem,
  IFormActivityModalObject,
  SingleActivityContainerProps,
  emptyModalValues,
} from "./activityRelatedToHelper";
import { AccountModels } from "../../../../../../models/Accounts";
import { maskRecordData } from "../../../shared/utils/maskRecordData";

export const SingleActivityContainer = ({
  appName,
  recordId,
  activity,
  modelName,
  relatedName,
  activityCount,
  setActivityCount,
  statusArray,
  activityType,
  fieldsList,
  sideNavigationRefreshed,
  handleActivityStatusChange,
  handleUpdateUserPreferences = () => {},
  changedStatusRecord,
  resetActivityStatusChangeData,
  relatedToField,
  status,
  setExecuteActivitySave,
  executeActivitySave,
  userPreferences,
}: SingleActivityContainerProps) => {
  const { t } = useTranslation(["common"]);
  const [addActivityModal, setAddActivityModal] =
    React.useState<IFormActivityModalObject>(emptyModalValues);
  const [deleteModal, setDeleteModal] = React.useState<IDeleteActivityItem>({
    visible: false,
    item: { modelName: "", id: "", alias: "" },
  });
  const [editActivityModal, setEditActivityModal] =
    React.useState<IFormActivityModalObject>(emptyModalValues);
  const [activityData, setActivityData] = React.useState<any[]>([]);
  const [viewPermission, setViewPermission] = React.useState(true);
  const [activityFetchLoading, setActivityFetchLoading] = React.useState(true);
  const [activeActivityPageNumber, setActiveActivityPageNumber] =
    React.useState(1);

  const [availableFieldsList, setAvailableFieldsList] =
    React.useState<ICustomField[]>(fieldsList);
  const [selectedFieldsList, setSelectedFieldsList] = React.useState<
    ICustomField[]
  >(
    fieldsList?.filter(
      (field) =>
        field.name === "description" ||
        field.name === "priorityId" ||
        field.name === "statusId"
    )
  );

  const [previousSelectedFieldList, setPreviousSelectedFieldList] =
    React.useState<ICustomField[]>([]);
  const [chooseFieldsForActivityModal, setChooseFieldsForActivityModal] =
    React.useState<{
      visible: boolean;
      formDetails: {
        appName: string;
        parentModelName: string;
        aliasName: string;
        modelName: string;
        fieldsList: ICustomField[];
      } | null;
    }>();
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);

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
        setChooseFieldsForActivityModal({
          visible: false,
          formDetails: null,
        });
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

  const handleFetchedActivityDataResponse = (
    response: any,
    resetData: boolean
  ) => {
    if (response?.data?.fetch?.data?.length) {
      if (!relatedToField || (relatedToField && !relatedToField.visible)) {
        setActivityData([]);
        setActivityCount(0, activity.name);
        setViewPermission(true);
        setActivityFetchLoading(false);
        return;
      }
      setActivityData(
        resetData
          ? response.data.fetch.data
          : [...activityData, ...response.data.fetch.data]
      );
      setActivityCount(response.data.fetch.count, activity.name);
      setViewPermission(true);
    } else if (response?.data?.fetch?.messageKey.includes("requires-view")) {
      setViewPermission(false);
    }
    setActivityFetchLoading(false);
  };

  const [getActivityData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [
    serverDeleteData,
    { loading: deleteProcessing, error: deleteError, data: deleteData },
  ] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.data) {
        const deletedRecord = responseOnCompletion.save.data;
        setActivityData(
          activityData.filter((data) => data.id !== deletedRecord.id)
        );
        setActivityCount(activityCount - 1, activity.name);
        setDeleteModal({
          visible: false,
          item: { modelName: "", id: "", alias: "" },
        });
        toast.success(
          `${startCase(toLower(deleteModal.item.alias))} deleted successfully`
        );
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion?.save?.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleUpdatedData = (data: any) => {
    data = maskRecordData(data, fieldsList);
    let hasCorrectStatus = false;
    for (let i = 0; i < statusArray.length; i++) {
      if (data.statusId === statusArray[i].id) {
        hasCorrectStatus = true;
        break;
      }
    }
    if (!hasCorrectStatus) {
      setActivityData(
        activityData.filter((activityData) => activityData.id !== data.id)
      );
      setActivityCount(activityCount - 1, activity.name);
      handleActivityStatusChange(data, activityType, activity.name);
      return;
    }
    let hasRelatedTo = false;
    data = getDataObject(data);
    const updatedActivityData = activityData
      .map((val) => {
        if (val.id === data.id) {
          for (let i = 0; i < data.relatedTo?.length; i++) {
            const relatedData: { recordId: string } = data.relatedTo[i];
            if (relatedData.recordId === recordId) {
              hasRelatedTo = true;
              break;
            }
          }
          if (!hasRelatedTo) {
            return null;
          }
          return data;
        } else {
          return val;
        }
      })
      .filter((relatedData) => relatedData);
    setActivityData(updatedActivityData);
    setActivityCount(updatedActivityData?.length, activity.name);
  };

  const handleAddActivityData = (data: any) => {
    if (!data?.relatedTo?.length) return;
    let hasRelatedTo = false;
    data = getDataObject(data);
    for (let i = 0; i < data.relatedTo.length; i++) {
      if (data.relatedTo[i].recordId === recordId) {
        hasRelatedTo = true;
        break;
      }
    }
    if (!hasRelatedTo) return;
    let hasCorrectStatus = false;
    for (let i = 0; i < statusArray.length; i++) {
      if (data.statusId === statusArray[i].id) {
        hasCorrectStatus = true;
        break;
      }
    }
    const dataWithMaskedFields = maskRecordData(data, fieldsList);
    if (!hasCorrectStatus) {
      handleActivityStatusChange(
        dataWithMaskedFields,
        activityType,
        activity.name
      );
      return;
    }
    setActivityData([...activityData, dataWithMaskedFields]);
    setActivityCount(activityCount + 1, activity.name);
  };

  React.useEffect(() => {
    if (
      executeActivitySave &&
      executeActivitySave?.modelName === activity.name
    ) {
      let hasCorrectStatus = false;
      for (let i = 0; i < statusArray.length; i++) {
        if (executeActivitySave.data.statusId === statusArray[i].id) {
          hasCorrectStatus = true;
          break;
        }
      }
      if (hasCorrectStatus) {
        handleAddActivityData(executeActivitySave.data);
        setExecuteActivitySave(null);
      }
    }
  }, [executeActivitySave]);

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

  const handleActivityLoadMoreClicked = () => {
    const pageNumber = activeActivityPageNumber + 1;
    setActivityFetchLoading(true);
    getActivityData({
      variables: {
        modelName: activity.name,
        fields: getVisibleFieldsArray(fieldsList),
        filters: [
          { name: "recordId", operator: "eq", value: recordId },
          {
            name: "statusId",
            operator: "in",
            value: statusArray.map((obj: any) => {
              return obj.id;
            }),
          },
          {
            operator: "in",
            name: "recordStatus",
            value: ["a", "i"],
          },
        ],
        pageNumber,
      },
    }).then((response) => handleFetchedActivityDataResponse(response, false));
    setActiveActivityPageNumber(pageNumber);
  };

  React.useEffect(() => {
    if (!appName) return;
    getActivityData({
      variables: {
        modelName: activity.name,
        fields: getVisibleFieldsArray(fieldsList),
        filters: [
          { name: "recordId", operator: "eq", value: recordId },
          {
            name: "statusId",
            operator: "in",
            value: statusArray.map((obj: any) => {
              return obj.id;
            }),
          },
          {
            operator: "in",
            name: "recordStatus",
            value: ["a", "i"],
          },
        ],
      },
    }).then((response) => handleFetchedActivityDataResponse(response, true));
  }, [userPreferences, sideNavigationRefreshed, appName]);

  React.useEffect(() => {
    if (changedStatusRecord) {
      handleAddActivityData(changedStatusRecord.data);
      resetActivityStatusChangeData();
    }
  }, [changedStatusRecord]);

  React.useEffect(() => {
    if (
      fieldsList?.length > 0 &&
      userPreferences &&
      userPreferences?.length > 0 &&
      modelName &&
      activity
    ) {
      let updatedAvailableFieldList: ICustomField[] = [];
      let updatedSelectedFieldList: ICustomField[] = [];
      let fields: string[] = [];
      if (
        userPreferences &&
        userPreferences?.length > 0 &&
        userPreferences[0]?.defaultPreferences &&
        userPreferences[0]?.defaultPreferences[modelName] &&
        userPreferences[0]?.defaultPreferences[modelName]["activity"] &&
        userPreferences[0]?.defaultPreferences[modelName]["activity"][
          activity?.name
        ] &&
        userPreferences[0]?.defaultPreferences[modelName]["activity"][
          activity?.name
        ]
      ) {
        fields = get(
          userPreferences[0]?.defaultPreferences[modelName]["activity"],
          [activity?.name],
          fieldsList?.filter(
            (field) =>
              field.name === "description" ||
              field.name === "priorityId" ||
              field.name === "statusId"
          )
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
      if (updatedSelectedFieldList?.length > 0) {
        setSelectedFieldsList(updatedSelectedFieldList);
        setPreviousSelectedFieldList(updatedSelectedFieldList);
      } else {
        setSelectedFieldsList(
          fieldsList?.filter(
            (field) =>
              field.name === "description" ||
              field.name === "priorityId" ||
              field.name === "statusId"
          )
        );
        setPreviousSelectedFieldList(
          fieldsList?.filter(
            (field) =>
              field.name === "description" ||
              field.name === "priorityId" ||
              field.name === "statusId"
          )
        );
      }
    } else {
      setAvailableFieldsList(
        fieldsList?.filter(
          (field) =>
            field.name !== "description" &&
            field.name !== "priorityId" &&
            field.name !== "statusId"
        )
      );
      setPreviousSelectedFieldList(
        fieldsList?.filter(
          (field) =>
            field.name === "description" ||
            field.name === "priorityId" ||
            field.name === "statusId"
        )
      );
      setSelectedFieldsList(
        fieldsList?.filter(
          (field) =>
            field.name === "description" ||
            field.name === "priorityId" ||
            field.name === "statusId"
        )
      );
    }
  }, [fieldsList, userPreferences, modelName, activity]);

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
            [modelName]: get(defaultPreferences, modelName, null)
              ? {
                  ...get(defaultPreferences, modelName),
                  activity: get(defaultPreferences[modelName], "activity", null)
                    ? {
                        ...get(defaultPreferences[modelName], "activity"),
                        [activity.name]: selectedFieldsList.map(
                          (field) => field.name
                        ),
                      }
                    : {
                        [activity.name]: selectedFieldsList.map(
                          (field) => field.name
                        ),
                      },
                }
              : {
                  activity: {
                    [activity.name]: selectedFieldsList.map(
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

  return viewPermission ? (
    <>
      <SingleActivityContainerItem
        appName={appName}
        modelName={modelName}
        recordId={recordId}
        relatedName={relatedName}
        fieldsList={fieldsList}
        activity={activity}
        activityType={activityType}
        activityData={getDataObjectArray(activityData)}
        activityFetchLoading={activityFetchLoading}
        deleteProcessing={deleteProcessing}
        deleteModal={deleteModal}
        addActivityModal={addActivityModal}
        editActivityModal={editActivityModal}
        visibleFields={selectedFieldsList}
        handleAddActivityData={handleAddActivityData}
        handleUpdatedData={(data: any) => handleUpdatedData(data)}
        handleServerDeleteData={(variables: {
          id: string;
          modelName: string;
          saveInput: {
            recordStatus: string;
          };
        }) => serverDeleteData({ variables: variables })}
        handleAddActivityModal={(data) =>
          setAddActivityModal({
            ...data,
            formDetails: {
              ...data.formDetails,
              activityType: status === "Open" ? "open" : "closed",
            },
          })
        }
        handleEditActivityModal={(data: IFormActivityModalObject) =>
          setEditActivityModal(data)
        }
        handleDeleteModal={(data: IDeleteActivityItem) => setDeleteModal(data)}
        changeDisplayFields={(item) =>
          setChooseFieldsForActivityModal({
            visible: item.visible,
            formDetails: item.formDetails,
          })
        }
        relatedToField={relatedToField}
        userPreferences={userPreferences}
        activityCount={activityCount}
        handleActivityLoadMoreClicked={handleActivityLoadMoreClicked}
      />
      {chooseFieldsForActivityModal?.visible && (
        <>
          <ChooseFieldsForReverseLookup
            availableFieldsList={getSortedFieldList(
              availableFieldsList
                ?.filter((field) => field.visible)
                .filter(
                  (field) =>
                    field.name !== "layoutId" &&
                    field.name !== "recordStatus" &&
                    field.name !== "location" &&
                    field.name !== "name" &&
                    field.name !== "dueDate" &&
                    field.name !== "relatedTo"
                )
            )}
            selectedFieldsList={selectedFieldsList}
            onCancel={() => {
              setChooseFieldsForActivityModal({
                visible: false,
                formDetails: null,
              });
              setSelectedFieldsList(previousSelectedFieldList);
            }}
            handleAvailableFields={(fields) => handleAvailableFields(fields)}
            handleSelectedFields={(fields) => handleSelectedFields(fields)}
            handleSave={() => handleSave()}
            loading={savingProcess}
          />
          <Backdrop
            onClick={() => {
              setChooseFieldsForActivityModal({
                visible: false,
                formDetails: null,
              });
              setSelectedFieldsList(previousSelectedFieldList);
            }}
          />
        </>
      )}
    </>
  ) : (
    <NoViewPermission
      modelName={activity.name}
      showIcon={false}
      autoHeight={false}
      shadow={false}
      fontSize={"text-sm"}
      entireMessage={false}
    />
  );
};
