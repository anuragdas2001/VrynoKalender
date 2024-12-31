import { get } from "lodash";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../../../models/ICustomField";
import {
  IModuleMetadata,
  ReverseLookup,
} from "../../../../../models/IModuleMetadata";
import { IUserPreference, SupportedApps } from "../../../../../models/shared";
import { ActivitiesModule } from "../../../../../shared/constants";
import { DetailFieldPerDataType } from "../../shared/components/ReadOnly/DetailFieldPerDataType";
import { fieldConvertor } from "../../shared/utils/getOrderedFieldsList";
import { RelatedToContainer } from "./RelatedToContainer";
import { ConnectedReverseLookupContainer } from "./ReverseLookupContainer/ConnectedReverseLookupContainer";
import { columnLayoutValues } from "../../shared/components/Form/FormFieldPerDataTypeProps";
import { ConnectedActivityContainer } from "./ActivityRelatedTo/ConnectedActivityContainer";
import { IGenericActivityLabel } from "./TypesGenericModelDetails";
import React from "react";
import {
  FieldsListDictType,
  IChangedStatusRecord,
  RelatedActivityStatusType,
} from "./ActivityRelatedTo/activityRelatedToHelper";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { ConnectedNotes } from "./Notes/ConnectedNotes";
import { ConnectedTimeline } from "./Timeline/ConnectedTimeline";
import { ConnectedAttachment } from "./Attachments/ConnectedAttachment";
import { ConnectedEmail } from "./Email/ConnectedEmail";
import { EmailPreview } from "./Email/connectedEmailHelpers";
import { IAttachmentModal } from "./Attachments/attachmentHelper";
import { ConnectedSubFormContainer } from "./SubFormContainer/ConnectedSubFormContainer";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SendEmailModalRecordsType } from "./GenericModelDetailsScreen";
import { SectionDetailsType } from "../GenericForms/Shared/genericFormProps";

export function fetchRecordImageField(
  fieldsList: {
    label: string;
    value: string;
    dataType: FieldSupportedDataType;
    field: ICustomField;
  }[]
) {
  let updatedFieldsListHelper = [...fieldsList];
  let index = updatedFieldsListHelper?.findIndex(
    (field) => field.dataType === "recordImage"
  );
  if (index === -1) return null;
  return updatedFieldsListHelper[index];
}

export function fieldsListHelper(
  fieldsList: ICustomField[],
  modelData: any,
  modelDetailData: any
) {
  return fieldsList
    ?.filter((field) => {
      if (
        !field.visible ||
        field.addInSummarySection ||
        field.name === "relatedTo"
      )
        return null;
      if (
        get(modelData, "leadConverted", null) ||
        get(modelDetailData, "leadConverted", null)
      ) {
        return field;
      } else {
        if (
          [
            "convertedBy",
            "convertedContactId",
            "convertedDealId",
            "convertedOn",
            "convertedOrganizationId",
          ].includes(field.name) &&
          field.systemDefined
        ) {
          return null;
        } else return field;
      }
    })
    .map(fieldConvertor);
}

export const getSectionFieldsList = (
  sectionFields: ICustomField[],
  sectionFieldsWithOrder: {
    fieldName: string;
    order: number;
    dataType: string;
    visible: boolean;
    addInForm: boolean;
    readOnly: boolean;
  }[],
  checkForSubform: boolean = false
) => {
  let updatedSectionFields: ICustomField[] = [];
  sectionFieldsWithOrder?.forEach((field) => {
    sectionFields = checkForSubform
      ? sectionFields.filter((f) => !f?.dataTypeMetadata?.isSubform)
      : sectionFields;
    const findFieldIndex = sectionFields?.findIndex(
      (sectionField) => sectionField.name === field.fieldName
    );
    if (findFieldIndex === -1) return;
    else {
      updatedSectionFields = [
        ...updatedSectionFields,
        sectionFields[findFieldIndex],
      ];
      return;
    }
  });
  return updatedSectionFields;
};

export const GenericModelDetails = ({
  id,
  appName,
  modelData,
  modelDetailData,
  modelName,
  relatedFilter,
  relatedFilterId,
  fieldsList,
  currentModule,
  userPreferences,
  attachmentsCount,
  emailCount,
  notesCount,
  sections,
  navActivityModuleLabels,
  cardContainerOrder,
  sideNavigationRefreshed,
  quickCreateReverseLookupModal,
  chooseFieldModal,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  moduleViewPermission,
  updateModelFieldData,
  imapEmailModal,
  setQuickCreateReverseLookupModal,
  setChooseFieldModal,
  handleCloseActivityCount,
  handleNotesCount,
  handleAttachmentsCount,
  handleEmailCount,
  handleOpenActivityCount,
  handleReverseRecordLookupsCount,
  handleUpdateUserPreferences,
  handleOpenCollapseCardContainer = () => {},
  quickCreateNoteModal,
  setQuickCreateNoteModal,
  setAddAttachmentUrlModalForm,
  setAddAttachmentModalForm,
  addAttachmentUrlModalForm,
  addAttachmentModalForm,
  setExecuteActivitySave,
  executeActivitySave,
  handleSubFormCount,
  sendMassEmailRecords,
  setSendMassEmailRecords,
}: {
  id: string;
  appName: SupportedApps;
  modelData: any;
  modelDetailData: any;
  modelName: string;
  relatedFilter: string | undefined;
  relatedFilterId: string | undefined;
  fieldsList: ICustomField[];
  currentModule: IModuleMetadata | undefined;
  userPreferences: IUserPreference[];
  openActivityCount: number;
  closeActivityCount: number;
  attachmentsCount: number;
  emailCount: number;
  notesCount: number;
  hasRelatedTo?: boolean;
  imapEmailModal: (record: EmailPreview) => void;
  sections?: SectionDetailsType[];
  navActivityModuleLabels: IGenericActivityLabel;
  cardContainerOrder: {
    id: string;
    label: string;
    name: string;
    type: string;
    order: number;
    value: string;
  }[];
  sideNavigationRefreshed: boolean;
  chooseFieldModal: { reverseLookupName: string; visible: boolean };
  quickCreateReverseLookupModal: {
    reverseLookupName: string;
    visible: boolean;
  };
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  moduleViewPermission: boolean;
  setQuickCreateReverseLookupModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  setChooseFieldModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  handleCloseActivityCount: (value: number) => void;
  handleNotesCount: (value: number) => void;
  handleAttachmentsCount: (value: number) => void;
  handleEmailCount: (value: number) => void;
  handleOpenActivityCount: (value: number) => void;
  handleReverseRecordLookupsCount: (
    index: string,
    reverseLookup: ReverseLookup,
    count: number
  ) => void;
  handleUpdateUserPreferences: () => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  quickCreateNoteModal: boolean;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  addAttachmentUrlModalForm: IAttachmentModal;
  addAttachmentModalForm: IAttachmentModal;
  setExecuteActivitySave: React.Dispatch<React.SetStateAction<any>>;
  executeActivitySave: any;
  sendMassEmailRecords?: SendEmailModalRecordsType;
  setSendMassEmailRecords?: (
    value: SendEmailModalRecordsType | undefined
  ) => void;
  handleSubFormCount: (
    id: string,
    subForm: {
      label: { en: string };
      moduleName: string;
      value: string;
    },
    count: number
  ) => void;
  updateModelFieldData: (field: string, value: any, id: string) => void;
}) => {
  const [fieldsListDict, setFieldsListDict] =
    React.useState<FieldsListDictType>({
      task: [],
      meeting: [],
      callLog: [],
      note: [],
      attachment: [],
    });
  const [fieldsListDataLoading, setFieldsListDataLoading] =
    React.useState(true);
  const [activityStatus, setActivityStatus] = React.useState<
    RelatedActivityStatusType[]
  >([]);
  const [activityStatusLoading, setActivityStatusLoading] =
    React.useState(true);
  const [changedStatusRecord, setChangedStatusRecord] =
    React.useState<IChangedStatusRecord>({
      data: {},
      status: "",
      moduleName: "",
    });
  const { navigations } = React.useContext(NavigationStoreContext);

  const [getActivityStatus] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setActivityStatus(responseOnCompletion?.fetch?.data);
      }
      setActivityStatusLoading(false);
    },
  });

  React.useEffect(() => {
    if (allLayoutFetched) {
      let fieldListData: FieldsListDictType = {
        task: genericModels["task"]?.fieldsList || [],
        meeting: genericModels["meeting"]?.fieldsList || [],
        callLog: genericModels["callLog"]?.fieldsList || [],
        note: genericModels["note"]?.fieldsList || [],
        attachment: genericModels["attachment"]?.fieldsList || [],
      };
      setFieldsListDict(fieldListData);
      setFieldsListDataLoading(false);
    }
  }, [allLayoutFetched]);

  React.useEffect(() => {
    if (!appName) return;
    getActivityStatus({
      variables: {
        modelName: "Lookup",
        filters: [{ operator: "eq", name: "type", value: "status" }],
        fields: ["id", "defaultLabel", "key"],
      },
    });
  }, [appName]);

  const handleActivityStatusChange = (
    activityData: any,
    currentActivityStatus: string,
    moduleName: string
  ) => {
    setChangedStatusRecord({
      data: activityData,
      status: currentActivityStatus === "open" ? "closed" : "open",
      moduleName: moduleName,
    });
  };

  const resetActivityStatusChangeData = () => {
    setChangedStatusRecord({
      data: {},
      status: "",
      moduleName: "",
    });
  };

  return (
    <div className={`px-6 pb-6 ${modelName !== "deal" && "pt-6"}`}>
      {cardContainerOrder?.map(
        (
          cardContainer: {
            id: string;
            label: string;
            name: string;
            type: string;
            order: number;
            value: string;
            metadata?: Record<string, any>;
          },
          index: number
        ) => {
          if (cardContainer?.type === "section") {
            const sectionIndex: number | undefined = sections?.findIndex(
              (section) =>
                get(section, "sectionName", "") === cardContainer?.name
            );
            if (!sections || sectionIndex === -1 || sectionIndex === undefined)
              return null;
            const section = sections[sectionIndex];
            return (
              <div className="grid grid-cols-12 w-full gap-x-4" key={index}>
                <div
                  className={`col-span-12 w-full flex items-center justify-center`}
                >
                  <GenericHeaderCardContainer
                    key={index}
                    modelName={modelName}
                    id={get(cardContainer, "id", "name")}
                    cardHeading={get(section, "sectionLabel", "")}
                    extended={true}
                    handleOpenCollapseCardContainer={(id, showDetails) =>
                      handleOpenCollapseCardContainer(id, showDetails)
                    }
                    userPreferences={userPreferences}
                    allowRecordImage={
                      fetchRecordImageField(
                        fieldsListHelper(
                          getSectionFieldsList(
                            section?.sectionFields,
                            section?.sectionFieldsWithOrder
                          ),
                          modelData,
                          modelDetailData
                        )
                      )
                        ? {
                            visible: true,
                            information: {
                              data: modelDetailData || modelData,
                              field: {
                                label:
                                  fetchRecordImageField(
                                    fieldsListHelper(
                                      getSectionFieldsList(
                                        section?.sectionFields,
                                        section?.sectionFieldsWithOrder
                                      ),
                                      modelData,
                                      modelDetailData
                                    )
                                  )?.label ?? "",
                                value:
                                  fetchRecordImageField(
                                    fieldsListHelper(
                                      getSectionFieldsList(
                                        section?.sectionFields,
                                        section?.sectionFieldsWithOrder
                                      ),
                                      modelData,
                                      modelDetailData
                                    )
                                  )?.value ?? "",
                                dataType:
                                  fetchRecordImageField(
                                    fieldsListHelper(
                                      getSectionFieldsList(
                                        section?.sectionFields,
                                        section?.sectionFieldsWithOrder
                                      ),
                                      modelData,
                                      modelDetailData
                                    )
                                  )?.dataType ?? "singleline",
                                field: fieldsList.filter(
                                  (field) =>
                                    field.name ===
                                    fetchRecordImageField(
                                      fieldsListHelper(
                                        getSectionFieldsList(
                                          section?.sectionFields,
                                          section?.sectionFieldsWithOrder
                                        ),
                                        modelData,
                                        modelDetailData
                                      )
                                    )?.value
                                )[0],
                              },
                              onDetail: true,
                              fieldDetail: fieldsList.filter(
                                (field) =>
                                  field.name ===
                                  fetchRecordImageField(
                                    fieldsListHelper(
                                      getSectionFieldsList(
                                        section?.sectionFields,
                                        section?.sectionFieldsWithOrder
                                      ),
                                      modelData,
                                      modelDetailData
                                    )
                                  )?.value
                              )[0],
                              headerVisible: true,
                              fontSize: {
                                header: "text-sm",
                                value: "text-sm",
                              },
                              isSample:
                                modelDetailData?.isSample || modelData.isSample,
                              modelName: relatedFilterId || modelName,
                              includeBaseUrl: true,
                            },
                          }
                        : { visible: false, information: null }
                    }
                  >
                    <div
                      className={`mt-5 gap-x-4 ${
                        columnLayoutValues
                          ? columnLayoutValues[
                              get(section, "columnLayout", "4")
                            ]
                          : "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }`}
                    >
                      {fieldsListHelper(
                        getSectionFieldsList(
                          section?.sectionFields,
                          section?.sectionFieldsWithOrder,
                          true
                        ),
                        modelData,
                        modelDetailData
                      )
                        ?.filter((field) => field.dataType !== "recordImage")
                        .map((header, index) => {
                          return (
                            <DetailFieldPerDataType
                              data={modelDetailData || modelData}
                              field={{
                                label: header.label,
                                value: header.value,
                                dataType: header.dataType,
                                field: header.field,
                              }}
                              headerVisible={true}
                              fontSize={{
                                header: "text-sm",
                                value: "text-sm",
                              }}
                              key={index}
                              isSample={
                                modelDetailData?.isSample || modelData.isSample
                              }
                              modelName={relatedFilterId || modelName}
                              includeBaseUrl={true}
                              showMaskedIcon={true}
                              userPreferences={userPreferences}
                              appName={appName}
                              showFieldEditInput={true}
                              updateModelFieldData={updateModelFieldData}
                              fieldsList={fieldsList}
                            />
                          );
                        })}
                    </div>
                  </GenericHeaderCardContainer>
                </div>
              </div>
            );
          }
          if (cardContainer?.type === "relatedTo") {
            return (
              <RelatedToContainer
                relatedToData={
                  modelData?.relatedTo || modelDetailData?.relatedTo
                }
                key={index}
                app={appName}
                modelName={modelName}
                heading="Related To"
                extended={true}
                id={id}
                containerId={cardContainer.id}
                userPreferences={userPreferences}
                handleOpenCollapseCardContainer={(id, showDetails) =>
                  handleOpenCollapseCardContainer(id, showDetails)
                }
                fieldsList={fieldsList}
                genericModels={genericModels}
                allModulesFetched={allModulesFetched}
              />
            );
          }
          if (
            cardContainer?.type === "activity" &&
            !(modelName in ActivitiesModule)
          ) {
            return (
              <ConnectedActivityContainer
                id={cardContainer.id}
                appName={appName}
                modelName={relatedFilterId || modelName}
                parentModelName={modelName}
                recordId={id}
                extended={true}
                key={index}
                type={
                  cardContainer?.name === "openActivities" ? "Open" : "Closed"
                }
                userPreferences={userPreferences}
                setActivityCount={(value, type: string) =>
                  type === "Open"
                    ? handleOpenActivityCount(value)
                    : handleCloseActivityCount(value)
                }
                sideNavigationRefreshed={sideNavigationRefreshed}
                fieldsListDataLoading={fieldsListDataLoading}
                activityStatusLoading={activityStatusLoading}
                fieldsListDict={fieldsListDict}
                activityStatus={activityStatus}
                changedStatusRecord={changedStatusRecord}
                resetActivityStatusChangeData={resetActivityStatusChangeData}
                handleActivityStatusChange={handleActivityStatusChange}
                handleUpdateUserPreferences={handleUpdateUserPreferences}
                navActivityModuleLabels={navActivityModuleLabels}
                handleOpenCollapseCardContainer={(id, showDetails) =>
                  handleOpenCollapseCardContainer(id, showDetails)
                }
                setExecuteActivitySave={setExecuteActivitySave}
                executeActivitySave={executeActivitySave}
              />
            );
          }
          if (cardContainer?.type === "reverseLookup") {
            let reverseLookupIndex: number | undefined =
              currentModule?.reverseLookups?.findIndex(
                (reverseLookup) =>
                  `${get(reverseLookup, "fieldUniqueName")}` ===
                  cardContainer?.name
              );
            if (
              !currentModule ||
              currentModule?.reverseLookups?.length === 0 ||
              reverseLookupIndex === -1 ||
              reverseLookupIndex === undefined
            )
              return null;
            let reverseLookup =
              currentModule?.reverseLookups[reverseLookupIndex];
            return (
              <ConnectedReverseLookupContainer
                id={cardContainer.id}
                reverseLookup={reverseLookup}
                key={index}
                recordId={relatedFilter || id}
                serviceName={reverseLookup.moduleUniqueName.split(".")[0]}
                moduleUniqueName={reverseLookup.moduleUniqueName.split(".")[1]}
                moduleName={reverseLookup.moduleName}
                parentModelName={modelName}
                parentModelData={modelData || modelDetailData}
                userPreferences={userPreferences}
                sideNavigationRefreshed={sideNavigationRefreshed}
                chooseFieldModalFromSideNavigation={chooseFieldModal}
                quickCreateModalFromSideNavigation={
                  quickCreateReverseLookupModal
                }
                setQuickCreateModalFromSideNavigation={(
                  reverseLookupName,
                  visible
                ) =>
                  setQuickCreateReverseLookupModal({
                    reverseLookupName: reverseLookupName,
                    visible: visible,
                  })
                }
                setChooseFieldModalFromSideNavigation={() =>
                  setChooseFieldModal({
                    reverseLookupName: "",
                    visible: false,
                  })
                }
                handleUpdateUserPreferences={handleUpdateUserPreferences}
                handleReverseRecordLookupsCount={(count) =>
                  handleReverseRecordLookupsCount(
                    cardContainer.id,
                    reverseLookup,
                    count
                  )
                }
                handleOpenCollapseCardContainer={(id, showDetails) =>
                  handleOpenCollapseCardContainer(id, showDetails)
                }
                genericModels={genericModels}
                allLayoutFetched={allLayoutFetched}
                sendMassEmailRecords={sendMassEmailRecords}
                setSendMassEmailRecords={setSendMassEmailRecords}
              />
            );
          }
          if (cardContainer?.type === "subForm") {
            const fieldData = cardContainer?.metadata?.field;
            if (!fieldData) return;
            const subFormCardData = {
              name: `${fieldData.name}Data`,
              moduleName: fieldData.dataTypeMetadata.allLookups[0].moduleName
                .split(".")
                .pop(),
              moduleUniqueName:
                fieldData.dataTypeMetadata.allLookups[0].moduleName,
              fieldName: fieldData.name,
              fieldUniqueName: fieldData.uniqueName,
              displayedAs: fieldData.label,
              summarySection: [],
            };
            return (
              <ConnectedSubFormContainer
                key={index}
                id={cardContainer.id}
                recordId={relatedFilter || id}
                data={modelDetailData || modelData}
                field={fieldData}
                serviceName={subFormCardData.moduleUniqueName.split(".")[0]}
                moduleName={subFormCardData.moduleName}
                parentModelName={modelName}
                parentModelData={modelData || modelDetailData}
                userPreferences={userPreferences}
                sideNavigationRefreshed={sideNavigationRefreshed}
                chooseFieldModalFromSideNavigation={chooseFieldModal}
                handleUpdateUserPreferences={handleUpdateUserPreferences}
                handleOpenCollapseCardContainer={
                  handleOpenCollapseCardContainer
                }
                handleSubFormCount={(count: number) =>
                  handleSubFormCount(
                    cardContainer.id,
                    {
                      label: fieldData.label,
                      moduleName: subFormCardData.moduleName,
                      value: fieldData.name,
                    },
                    count
                  )
                }
                setChooseFieldModalFromSideNavigation={() =>
                  setChooseFieldModal({
                    reverseLookupName: "",
                    visible: false,
                  })
                }
                navigations={navigations}
                genericModels={genericModels}
                allLayoutFetched={allLayoutFetched}
                moduleViewPermission={moduleViewPermission}
                sendMassEmailRecords={sendMassEmailRecords}
                setSendMassEmailRecords={setSendMassEmailRecords}
              />
            );
          }
          if (cardContainer?.type === "notes") {
            return (
              <div className="mb-5" id={cardContainer.id} key={index}>
                <ConnectedNotes
                  appName={appName}
                  modelName={modelName}
                  status="Open"
                  recordId={id}
                  id={cardContainer.id}
                  fieldsList={fieldsList}
                  notesCount={notesCount}
                  userPreferences={userPreferences}
                  setNotesCount={(value) => handleNotesCount(value)}
                  handleOpenCollapseCardContainer={(id, showDetails) =>
                    handleOpenCollapseCardContainer(
                      cardContainer.id,
                      showDetails
                    )
                  }
                  quickCreateNoteModal={quickCreateNoteModal}
                  setQuickCreateNoteModal={setQuickCreateNoteModal}
                />
              </div>
            );
          }
          if (cardContainer?.type === "attachments") {
            return (
              <div id={cardContainer.id} key={index}>
                <ConnectedAttachment
                  cardHeading="Attachments"
                  appName={appName}
                  recordId={id}
                  id={cardContainer.id}
                  modelName={modelName}
                  attachmentsCount={attachmentsCount}
                  userPreferences={userPreferences}
                  setAttachmentsCount={(value) => handleAttachmentsCount(value)}
                  handleOpenCollapseCardContainer={(id, showDetails) =>
                    handleOpenCollapseCardContainer(
                      cardContainer.id,
                      showDetails
                    )
                  }
                  setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
                  setAddAttachmentModalForm={setAddAttachmentModalForm}
                  addAttachmentUrlModalForm={addAttachmentUrlModalForm}
                  addAttachmentModalForm={addAttachmentModalForm}
                  allLayoutFetched={allLayoutFetched}
                  genericModels={genericModels}
                />
              </div>
            );
          }
          if (cardContainer?.type === "timeline") {
            return (
              <div id={cardContainer.id} key={index}>
                <ConnectedTimeline
                  appName={appName}
                  modelName={modelName}
                  recordId={id}
                  userPreferences={userPreferences}
                  fieldsList={fieldsList}
                  navActivityModuleLabels={navActivityModuleLabels}
                  genericModels={genericModels}
                  allLayoutFetched={allLayoutFetched}
                  allModulesFetched={allModulesFetched}
                />
              </div>
            );
          }
          if (
            cardContainer?.type == "email" &&
            fieldsList?.filter(
              (field) => field.visible && field?.dataType === "email"
            )?.length > 0
          ) {
            return (
              <div id={cardContainer.id} key={index}>
                <ConnectedEmail
                  id={id}
                  containerName={cardContainer.label}
                  appName={appName}
                  modelName={modelName}
                  fieldsList={fieldsList}
                  modelData={modelData || modelDetailData}
                  imapEmailModal={imapEmailModal}
                  handleEmailCount={handleEmailCount}
                  userPreferences={userPreferences}
                />
              </div>
            );
          }
        }
      )}
    </div>
  );
};
