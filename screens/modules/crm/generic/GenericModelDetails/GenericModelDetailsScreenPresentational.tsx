import { emptyModalValues } from "./IGenericFormDetails";
import { SidePageNavigation } from "./SidePageNav/SidePageNavigation";
import { GenericModelHeader } from "./GenericModelHeader";
import { GenericDealStagePipeline } from "./DealStagePipeline/GenericDealStagePipeline";
import { SidePageNavigationMobile } from "./SidePageNav/SidePageNavigationMobile";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import GenericFormModalWrapper from "../../../../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericFormModalWrapper";
import React from "react";
import { GenericModelDetailsScreenPresentationalProps } from "./TypesGenericModelDetails";
import { ReverseLookup } from "../../../../../models/IModuleMetadata";
import { GenericModelDetails } from "./GenericModelDetails";
import { SendEmailModal } from "../GenericModelView/SendEmailForm/SendEmailModal";
import _, { get, uniqBy } from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../shared/utils/getFieldsFromDisplayExpression";
import { getDefaultCardContainerOrder } from "./getDefaultCardContainerOrder";
import { EditSidePageNavigationModal } from "./SidePageNav/EditSidePageNavigationModal";
import { SupportedApps } from "../../../../../models/shared";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { useTranslation } from "react-i18next";
import { getCardContainerOrderSideNavMapper } from "./SidePageNav/getCardContainerOrderSideNavMapper";
import { ExportPdfModal } from "../GenericModelView/ExportPdfForm/ExportPdfModal";
import { EmailScreen } from "../../../notify/email/EmailScreen";
import { EmailPreview } from "./Email/connectedEmailHelpers";
import { removeSectionsWithDuplicateName } from "./removeSectionsWithDuplicateName";
import { AccountModels } from "../../../../../models/Accounts";
import { getDetailCardContainerOrder } from "../../shared/utils/getDetailCardContainerOrderFromPreference";
import GenericFormModalContainer from "../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { GenericConversionForm } from "../GenericModelView/GenericConversionForm";

export const GenericModelDetailsScreenPresentational = ({
  id,
  user,
  appName,
  modelData,
  modelDetailData,
  modelName,
  activeRelatedId,
  relatedFilter,
  relatedFilterId,
  fieldsList,
  currentModule,
  launchMenuVisible,
  EditDropdownList,
  sideModalClass,
  sendEmailModal,
  previousRecordId,
  nextRecordId,
  moduleData,
  itemsCount = 0,
  fetchNewRecordsLoading,
  userPreferences,
  deleteModal,
  formModal,
  sections,
  hasRelatedTo,
  navActivityModuleLabels,
  currentModuleLabel,
  sideNavigationRefreshed,
  exportPdfModal,
  quickCreateReverseLookupModal,
  chooseFieldModal,
  cardContainerOrder,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  moduleViewPermission,
  setCardContainerOrder,
  setChooseFieldModal,
  setQuickCreateReverseLookupModal,
  handleIdChange,
  setDeleteModal,
  setExportPdfModal,
  serverDeleteData,
  setSendEmailModal,
  setSideModalClass,
  setFormModal,
  updateModelData,
  handleNewRecordsFetch,
  setLaunchMenuVisible,
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
  setAddActivityModal,
  addActivityModal,
  setModelData,
  setModelDetailData,
  displayConversionModal,
  setDisplayConversionModal,
  setRefetchRecordData,
  sendMassEmailRecords,
  setSendMassEmailRecords,
}: GenericModelDetailsScreenPresentationalProps) => {
  const { t } = useTranslation(["common"]);
  const [openActivityCount, setOpenActivityCount] = React.useState<number>(0);
  const [closeActivityCount, setCloseActivityCount] = React.useState<number>(0);
  const [notesCount, setNotesCount] = React.useState<number>(0);
  const [attachmentsCount, setAttachmentsCount] = React.useState<number>(0);
  const [emailCount, setEmailCount] = React.useState<number>(0);
  const [imapEmailModal, setImapEmailModal] = React.useState<{
    visible: boolean;
    record: EmailPreview | null;
  }>({ visible: false, record: null });

  const [reverseRecordLookupsCount, setReverseRecordLookupsCount] =
    React.useState<
      { id: string; label: string; value: string; count: number }[]
    >([]);
  const [subFormsCount, setSubFormsCount] = React.useState<
    { id: string; label: string; value: string; count: number }[]
  >([]);
  const [editSideNavigation, setEditSideNavigation] =
    React.useState<boolean>(false);
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);

  const handleReverseRecordLookupsCount = (
    id: string,
    reverseLookup: ReverseLookup,
    count: number
  ) => {
    const updatedRecordIndex = reverseRecordLookupsCount.findIndex(
      (updatedRecord) => updatedRecord.id === id
    );
    if (updatedRecordIndex === -1) {
      setReverseRecordLookupsCount((reverseRecordLookupsCount) => [
        ...reverseRecordLookupsCount,
        {
          id: id,
          label: get(
            reverseLookup?.displayedAs,
            "en",
            reverseLookup.moduleName
          ),
          value: get(reverseLookup, "fieldUniqueName"),
          count: count,
        },
      ]);
    } else {
      let updatedReverseRecordLookupsCount = [...reverseRecordLookupsCount];
      updatedReverseRecordLookupsCount[updatedRecordIndex] = {
        id: id,
        label: get(reverseLookup?.displayedAs, "en", reverseLookup.moduleName),
        value: get(reverseLookup, "fieldUniqueName"),
        count: count,
      };
      setReverseRecordLookupsCount([...updatedReverseRecordLookupsCount]);
    }
  };

  const handleSubFormCount = (
    id: string,
    subForm: {
      label: { en: string };
      moduleName: string;
      value: string;
    },
    count: number
  ) => {
    let updatedSubFormsCount = [...subFormsCount];
    const updatedRecordIndex = updatedSubFormsCount.findIndex(
      (updatedRecord) => updatedRecord.id === id
    );
    if (updatedRecordIndex === -1) {
      updatedSubFormsCount = [
        ...updatedSubFormsCount,
        {
          id: id,
          label: get(subForm?.label, "en", subForm.moduleName),
          value: subForm.value,
          count: count,
        },
      ];
    } else {
      updatedSubFormsCount[updatedRecordIndex] = {
        id: id,
        label: get(subForm?.label, "en", subForm.moduleName),
        value: subForm.value,
        count: count,
      };
    }
    setSubFormsCount((prevState) =>
      uniqBy([...prevState, ...updatedSubFormsCount], "id")
    );
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
        handleUpdateUserPreferences(false);
        setSavingProcess(false);
        setEditSideNavigation(false);
        Toast.success("Related list updated successfully");
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        setSavingProcess(false);
        Toast.error(responseOnCompletion.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
      setSavingProcess(false);
      return;
    },
  });

  const handleUpdateSectionSize = (size: string) => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
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
                  selectedSizeView: size,
                }
              : {
                  selectedSizeView: size,
                },
          },
          serviceName: SupportedApps.crm,
        },
      },
    });
  };

  const handleUpdateSideNavigationOrder = async (
    cardContainerOrder: {
      id: string;
      name: string;
      label: string;
      value: string;
      type: string;
      order: number;
    }[],
    manuallySaved?: boolean
  ) => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    if (manuallySaved) {
      setSavingProcess(true);
      await saveUserPreference({
        variables: {
          id: updatedUserPreferences ? updatedUserPreferences.id : null,
          modelName: AccountModels.Preference,
          saveInput: {
            defaultPreferences: {
              ...defaultPreferences,
              [modelName]: get(defaultPreferences, modelName, null)
                ? {
                    ...get(defaultPreferences, modelName),
                    detailCardContainerOrder: [...cardContainerOrder],
                  }
                : {
                    detailCardContainerOrder: [...cardContainerOrder],
                  },
            },
            serviceName: SupportedApps.crm,
          },
        },
      });
    } else {
      setCardContainerOrder([
        ...getCardContainerOrderSideNavMapper(
          [...cardContainerOrder],
          sections,
          openActivityCount,
          closeActivityCount,
          notesCount,
          attachmentsCount,
          emailCount,
          reverseRecordLookupsCount,
          subFormsCount
        ),
      ]);
    }
  };

  const updateModelFieldData = (field: string, value: any, id: string) => {
    console.log(field, value);
    let updatedModelData =
      Object.keys(modelData)?.length > 0
        ? { ...modelData, [field]: value }
        : { ...modelDetailData, [field]: value };
    setModelData({ ...updatedModelData });
    setModelDetailData({ ...updatedModelData });
  };

  const getSubheadingData = (data: any, fields: string[]) => {
    let headingText = "";
    if (fields && fields.length > 0)
      fields.forEach((field) => {
        headingText += (data[field] ?? "") + " ";
      });
    if (fields && fields.length > 0) {
      return (
        <p
          className={`max-w-[250px] sm:max-w-[170px] md:max-w-[320px] lg:max-w-[550px]`}
        >
          <p className="truncate">{headingText}</p>
        </p>
      );
    } else {
      return (
        <p
          className={`max-w-[250px] sm:max-w-[170px] md:max-w-[320px] lg:max-w-[550px]`}
        >
          <p className="truncate">{data?.name ?? ""}</p>
        </p>
      );
    }
  };

  React.useEffect(() => {
    if (userPreferences && modelName && userPreferences?.length > 0) {
      const cardContainerOrder: {
        id: string;
        label: string;
        name: string;
        type: string;
        order: number;
        value: string;
        metadata?: Record<string, any>;
      }[] = userPreferences[0]?.defaultPreferences
        ? userPreferences[0]?.defaultPreferences?.[modelName]
          ? get(
              userPreferences[0]?.defaultPreferences?.[modelName],
              "detailCardContainerOrder",
              []
            )
          : []
        : [];
      if (cardContainerOrder?.length > 0) {
        let newItemAdded: boolean = false;
        let updatedCardContainerOrder = [...cardContainerOrder];
        let order = 0;
        updatedCardContainerOrder.forEach((cardContainer) =>
          cardContainer?.order > order
            ? (order = cardContainer.order)
            : (order = order)
        );

        updatedCardContainerOrder = [
          ...updatedCardContainerOrder
            ?.filter((cardContainer) => {
              const findIndex = sections?.findIndex(
                (section) =>
                  cardContainer.type === "section" &&
                  cardContainer?.name === section.sectionName
              );
              if (findIndex !== -1 || cardContainer.type !== "section")
                return cardContainer;
            })
            ?.filter((container) => container),
        ];

        sections
          ?.filter((section) => section.sectionName !== "relatedTo")
          ?.forEach((section) => {
            let findCardContainer = updatedCardContainerOrder?.filter(
              (cardContainer) => {
                if (
                  cardContainer.type === "section" &&
                  cardContainer?.name === section.sectionName
                )
                  return cardContainer;
              }
            );
            if (findCardContainer?.length <= 0) {
              newItemAdded = true;
              updatedCardContainerOrder = [
                ...updatedCardContainerOrder,
                {
                  id: uuidv4(),
                  type: "section",
                  name: section.sectionName,
                  label: section.sectionLabel,
                  order: (order = order + 1),
                  value: section.sectionName,
                },
              ];
            }
          });

        updatedCardContainerOrder = [
          ...updatedCardContainerOrder
            ?.filter((cardContainer) => {
              const findIndex = currentModule?.reverseLookups?.findIndex(
                (reverseLookup) =>
                  cardContainer.type === "reverseLookup" &&
                  cardContainer?.name ===
                    `${get(reverseLookup, "fieldUniqueName")}`
              );
              if (findIndex !== -1 || cardContainer.type !== "reverseLookup")
                return cardContainer;
            })
            ?.filter((container) => container),
        ];

        const visibleSubFormFields = fieldsList?.filter(
          (field) => field?.dataTypeMetadata?.isSubform && field?.visible
        );
        let subFormCountOrder = updatedCardContainerOrder?.length;
        visibleSubFormFields.forEach((field) => {
          let cardExist = false;
          cardContainerOrder.forEach((card) => {
            if (card.name === field.name) {
              cardExist = true;
            }
          });
          if (!cardExist) {
            updatedCardContainerOrder = [
              ...updatedCardContainerOrder,
              {
                id: uuidv4(),
                type: "subForm",
                name: field.name,
                label: field.label.en,
                order: (subFormCountOrder = subFormCountOrder + 1),
                value: field.name,
                metadata: { field: field },
              },
            ];
          }
        });

        // revert back if side navigation breaks
        updatedCardContainerOrder = [
          ...updatedCardContainerOrder
            ?.filter((cardContainer) => {
              if (cardContainer.type === "subForm") {
                const findIndex = fieldsList?.findIndex(
                  (field) =>
                    field.name ===
                    _.get(cardContainer?.metadata?.field, "name", {})
                );
                if (findIndex !== -1 && fieldsList[findIndex]?.visible) {
                  return cardContainer;
                }
              } else {
                return cardContainer;
              }
            })
            ?.filter((cardContainer) => cardContainer),
        ];

        currentModule?.reverseLookups?.forEach((reverseLookup) => {
          let findCardContainer = updatedCardContainerOrder?.filter(
            (cardContainer) => {
              if (
                cardContainer.type === "reverseLookup" &&
                cardContainer?.name ===
                  `${get(reverseLookup, "fieldUniqueName")}`
              )
                return cardContainer;
            }
          );

          if (findCardContainer?.length <= 0) {
            newItemAdded = true;
            updatedCardContainerOrder = [
              ...updatedCardContainerOrder,
              {
                id: uuidv4(),
                type: "reverseLookup",
                name: `${get(reverseLookup, "fieldUniqueName")}`,
                label: `${get(reverseLookup.displayedAs, "en", "moduleName")}`,
                value: `${get(reverseLookup, "fieldUniqueName")}`,
                order: (order = order + 1),
              },
            ];
          } else {
            let findCardContainerIndex = updatedCardContainerOrder?.findIndex(
              (cardContainer) => {
                if (
                  cardContainer.type === "reverseLookup" &&
                  cardContainer?.name ===
                    `${get(reverseLookup, "fieldUniqueName")}`
                )
                  return cardContainer;
              }
            );
            updatedCardContainerOrder[findCardContainerIndex] = {
              ...updatedCardContainerOrder[findCardContainerIndex],
              label: `${get(reverseLookup.displayedAs, "en", "moduleName")}`,
            };
          }
        });
        if (newItemAdded) {
          handleUpdateSideNavigationOrder([
            ...getCardContainerOrderSideNavMapper(
              [...updatedCardContainerOrder]
                .concat(
                  updatedCardContainerOrder?.findIndex(
                    (container) => container.type === "timeline"
                  ) !== -1
                    ? []
                    : [
                        {
                          id: uuidv4(),
                          type: "timeline",
                          name: "Timeline",
                          label: "Timeline",
                          value: "Timeline",
                          order: order++,
                        },
                      ]
                )
                .concat(
                  updatedCardContainerOrder?.findIndex(
                    (container) => container.type === "email"
                  ) !== -1
                    ? []
                    : [
                        {
                          id: uuidv4(),
                          type: "email",
                          name: "Emails",
                          label: "Emails",
                          value: "Email",
                          order: order++,
                        },
                      ]
                ),
              sections,
              openActivityCount,
              closeActivityCount,
              notesCount,
              attachmentsCount,
              emailCount,
              reverseRecordLookupsCount,
              subFormsCount
            ),
          ]);
        } else {
          setCardContainerOrder([
            ...getCardContainerOrderSideNavMapper(
              [...updatedCardContainerOrder]
                .concat(
                  updatedCardContainerOrder?.findIndex(
                    (container) => container.type === "timeline"
                  ) !== -1
                    ? []
                    : [
                        {
                          id: uuidv4(),
                          type: "timeline",
                          name: "Timeline",
                          label: "Timeline",
                          value: "Timeline",
                          order: order++,
                        },
                      ]
                )
                .concat(
                  updatedCardContainerOrder?.findIndex(
                    (container) => container.type === "email"
                  ) !== -1
                    ? []
                    : [
                        {
                          id: uuidv4(),
                          type: "email",
                          name: "Emails",
                          label: "Emails",
                          value: "Email",
                          order: order++,
                        },
                      ]
                ),
              sections,
              openActivityCount,
              closeActivityCount,
              notesCount,
              attachmentsCount,
              emailCount,
              reverseRecordLookupsCount,
              subFormsCount
            ),
          ]);
        }
      } else {
        handleUpdateSideNavigationOrder([
          ...getCardContainerOrderSideNavMapper(
            [
              ...getDefaultCardContainerOrder(
                sections,
                hasRelatedTo,
                currentModule,
                fieldsList
              ),
            ],
            sections,
            openActivityCount,
            closeActivityCount,
            notesCount,
            attachmentsCount,
            emailCount,
            reverseRecordLookupsCount,
            subFormsCount
          ),
        ]);
      }
    } else {
      handleUpdateSideNavigationOrder([
        ...getCardContainerOrderSideNavMapper(
          [
            ...getDefaultCardContainerOrder(
              sections,
              hasRelatedTo,
              currentModule,
              fieldsList
            ),
          ],
          sections,
          openActivityCount,
          closeActivityCount,
          notesCount,
          attachmentsCount,
          emailCount,
          reverseRecordLookupsCount,
          subFormsCount
        ),
      ]);
    }
  }, [userPreferences, currentModule, modelName, sections]);

  return (
    <>
      <div
        className={`flex flex-row w-full ${formModal.visible ? "fixed" : ""}`}
      >
        <SidePageNavigation
          sections={removeSectionsWithDuplicateName(
            sections?.filter((section) => {
              if (!hasRelatedTo && section.sectionName === "relatedTo")
                return null;
              else return section;
            })
          )}
          modelData={modelDetailData || modelData}
          modelName={relatedFilterId || modelName}
          recordId={id}
          appName={appName}
          activeRelatedId={activeRelatedId}
          relatedFilter={relatedFilter}
          relatedFilterId={relatedFilterId}
          fieldsList={fieldsList}
          currentModule={currentModule}
          cardContainerOrder={cardContainerOrder}
          openActivityCount={openActivityCount}
          closeActivityCount={closeActivityCount}
          notesCount={notesCount}
          attachmentsCount={attachmentsCount}
          emailCount={emailCount}
          reverseRecordLookupsCount={reverseRecordLookupsCount}
          subFormsCount={subFormsCount}
          setChooseFieldModal={(value) => setChooseFieldModal(value)}
          setQuickCreateReverseLookupModal={(value) =>
            setQuickCreateReverseLookupModal(value)
          }
          handleIdChange={handleIdChange}
          setEditSideNavigation={(value) => setEditSideNavigation(value)}
          setQuickCreateNoteModal={setQuickCreateNoteModal}
          setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
          setAddAttachmentModalForm={setAddAttachmentModalForm}
          navActivityModuleLabels={navActivityModuleLabels}
          setAddActivityModal={setAddActivityModal}
          genericModels={genericModels}
        />
        <div className="flex flex-col w-full lg:w-[80vw] xl:w-[83.3vw] h-full lg:ml-1/5 xl:ml-2/12">
          <GenericModelHeader
            setLaunchMenuVisible={setLaunchMenuVisible}
            modelName={modelName}
            heading={getSubheadingData(
              modelDetailData ? modelDetailData : modelData,
              evaluateDisplayExpression(
                getFieldsFromDisplayExpression(
                  get(currentModule, "displayExpression", "")
                ),
                fieldsList
              )
            )}
            id={id}
            appName={appName}
            launchMenuVisible={launchMenuVisible}
            previousRecordId={previousRecordId}
            nextRecordId={nextRecordId}
            moduleData={moduleData}
            itemsCount={itemsCount}
            handleNewRecordsFetch={(value) => handleNewRecordsFetch(value)}
            fetchNewRecordsLoading={fetchNewRecordsLoading}
            editDropdownList={EditDropdownList}
            setExportPdfModal={setExportPdfModal}
            handleUpdateSectionSize={handleUpdateSectionSize}
            userPreferences={userPreferences}
          />
          <SidePageNavigationMobile
            modelData={modelDetailData || modelData}
            modelName={relatedFilterId || modelName}
            recordId={id}
            appName={appName}
            activeRelatedId={activeRelatedId}
            sections={removeSectionsWithDuplicateName(
              sections?.filter((section) => {
                if (!hasRelatedTo && section.sectionName === "relatedTo")
                  return null;
                else return section;
              })
            )}
            relatedFilter={relatedFilter}
            relatedFilterId={relatedFilterId}
            fieldsList={fieldsList}
            currentModule={currentModule}
            sideModalClass={sideModalClass}
            cardContainerOrder={cardContainerOrder}
            openActivityCount={openActivityCount}
            closeActivityCount={closeActivityCount}
            notesCount={notesCount}
            attachmentsCount={attachmentsCount}
            emailCount={emailCount}
            reverseRecordLookupsCount={reverseRecordLookupsCount}
            subFormsCount={subFormsCount}
            handleIdChange={handleIdChange}
            setChooseFieldModal={(value) => setChooseFieldModal(value)}
            setQuickCreateReverseLookupModal={(value) =>
              setQuickCreateReverseLookupModal(value)
            }
            setSideModalClass={(value) => setSideModalClass(value)}
            setEditSideNavigation={(value) => setEditSideNavigation(value)}
            setQuickCreateNoteModal={setQuickCreateNoteModal}
            setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
            setAddAttachmentModalForm={setAddAttachmentModalForm}
            navActivityModuleLabels={navActivityModuleLabels}
            setAddActivityModal={setAddActivityModal}
            genericModels={genericModels}
          />
          {modelName === "deal" && (
            <GenericDealStagePipeline
              modelData={modelDetailData || modelData}
              updateModelData={updateModelData}
              modelName={modelName}
              appName={appName}
              id={id}
              fieldsList={fieldsList}
            />
          )}
          <GenericModelDetails
            modelData={modelData}
            modelDetailData={modelDetailData}
            modelName={modelName}
            relatedFilter={relatedFilter}
            relatedFilterId={relatedFilterId}
            fieldsList={fieldsList}
            currentModule={currentModule}
            id={id}
            sections={removeSectionsWithDuplicateName(
              sections?.filter((section) => {
                if (!hasRelatedTo && section.sectionName === "relatedTo")
                  return null;
                else return section;
              })
            )}
            appName={appName}
            hasRelatedTo={hasRelatedTo}
            userPreferences={userPreferences}
            openActivityCount={openActivityCount}
            closeActivityCount={closeActivityCount}
            attachmentsCount={attachmentsCount}
            emailCount={emailCount}
            notesCount={notesCount}
            cardContainerOrder={cardContainerOrder}
            sideNavigationRefreshed={sideNavigationRefreshed}
            quickCreateReverseLookupModal={quickCreateReverseLookupModal}
            chooseFieldModal={chooseFieldModal}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            moduleViewPermission={moduleViewPermission}
            imapEmailModal={(record) =>
              setImapEmailModal({ visible: true, record: record })
            }
            setQuickCreateReverseLookupModal={(value) =>
              setQuickCreateReverseLookupModal(value)
            }
            setChooseFieldModal={(value) => setChooseFieldModal(value)}
            handleOpenActivityCount={(value) => setOpenActivityCount(value)}
            handleReverseRecordLookupsCount={handleReverseRecordLookupsCount}
            handleCloseActivityCount={(value) => setCloseActivityCount(value)}
            handleNotesCount={(value) => setNotesCount(value)}
            handleAttachmentsCount={(value) => setAttachmentsCount(value)}
            handleEmailCount={(value) => setEmailCount(value)}
            handleUpdateUserPreferences={handleUpdateUserPreferences}
            navActivityModuleLabels={navActivityModuleLabels}
            handleOpenCollapseCardContainer={(id, showDetails) =>
              handleOpenCollapseCardContainer(id, showDetails)
            }
            quickCreateNoteModal={quickCreateNoteModal}
            setQuickCreateNoteModal={setQuickCreateNoteModal}
            setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
            setAddAttachmentModalForm={setAddAttachmentModalForm}
            addAttachmentUrlModalForm={addAttachmentUrlModalForm}
            addAttachmentModalForm={addAttachmentModalForm}
            setExecuteActivitySave={setExecuteActivitySave}
            executeActivitySave={executeActivitySave}
            handleSubFormCount={handleSubFormCount}
            updateModelFieldData={updateModelFieldData}
            sendMassEmailRecords={sendMassEmailRecords}
            setSendMassEmailRecords={setSendMassEmailRecords}
          />
        </div>
      </div>
      {displayConversionModal.visible && displayConversionModal.data ? (
        <>
          <GenericFormModalContainer
            formHeading={`Convert ${currentModuleLabel}`}
            onOutsideClick={() =>
              setDisplayConversionModal({ visible: false, data: null })
            }
            limitWidth={true}
            onCancel={() =>
              setDisplayConversionModal({ visible: false, data: null })
            }
          >
            <GenericConversionForm
              modelName={modelName}
              currentModuleLabel={currentModuleLabel}
              data={displayConversionModal.data}
              onCancel={() =>
                setDisplayConversionModal({ visible: false, data: null })
              }
              setRefetchRecordData={setRefetchRecordData}
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setDisplayConversionModal({ visible: false, data: null })
            }
          />
        </>
      ) : (
        <></>
      )}
      {addActivityModal.visible && (
        <>
          <GenericFormModalWrapper
            formDetails={addActivityModal.formDetails}
            externalData={
              addActivityModal.formDetails?.activityType === "open"
                ? { statusId: "Open", setBy: "label" }
                : addActivityModal.formDetails?.activityType === "closed"
                ? { statusId: "Close", setBy: "label" }
                : {}
            }
            handleAddedRecord={(data) => {
              setExecuteActivitySave({
                data,
                modelName: addActivityModal.formDetails.modelName,
              });
              setAddActivityModal(emptyModalValues);
            }}
            onCancel={() => setAddActivityModal(emptyModalValues)}
            onOutsideClick={() => setAddActivityModal(emptyModalValues)}
            stopRouting={true}
          />
          <Backdrop onClick={() => setAddActivityModal(emptyModalValues)} />
        </>
      )}
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader={`Delete ${currentModuleLabel}`}
            modalMessage={`Are you sure you want to delete this ${currentModuleLabel}?`}
            leftButton="Cancel"
            rightButton="Delete"
            loading={false}
            onCancel={() => setDeleteModal({ visible: false, id: null })}
            onDelete={(id) => {
              serverDeleteData({
                variables: {
                  id: deleteModal.id,
                  modelName: modelName,
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              });
              setDeleteModal({ visible: false, id: null });
            }}
            onOutsideClick={() => setDeleteModal({ visible: false, id: null })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: null })}
          />
        </>
      )}
      {formModal.visible && (
        <>
          <GenericFormModalWrapper
            onCancel={() => setFormModal(emptyModalValues)}
            formDetails={formModal.formDetails}
            onOutsideClick={() => setFormModal(emptyModalValues)}
            stopRouting={false}
          />
          <Backdrop onClick={() => setFormModal(emptyModalValues)} />
        </>
      )}
      {sendEmailModal && (
        <SendEmailModal
          formHeading="Send Email"
          onCancel={(value) => setSendEmailModal(value)}
          selectedItems={
            sendMassEmailRecords &&
            sendMassEmailRecords?.selectedItems?.length > 0
              ? [...sendMassEmailRecords?.selectedItems]
              : [modelData]
          }
          appName={
            sendMassEmailRecords && sendMassEmailRecords?.appName
              ? sendMassEmailRecords?.appName
              : appName
          }
          modelName={
            sendMassEmailRecords && sendMassEmailRecords?.modelName
              ? sendMassEmailRecords?.modelName
              : modelName
          }
          fieldsList={
            sendMassEmailRecords && sendMassEmailRecords?.fieldsList
              ? sendMassEmailRecords?.fieldsList
              : fieldsList
          }
          currentModule={
            sendMassEmailRecords && sendMassEmailRecords?.currentModule
              ? sendMassEmailRecords?.currentModule
              : currentModule
          }
          user={user}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
        />
      )}
      {exportPdfModal && (
        <ExportPdfModal
          formHeading="Export PDF"
          modelName={modelName}
          selectedItem={modelData || modelDetailData}
          onCancel={(value) => setExportPdfModal(value)}
        />
      )}
      {editSideNavigation && (
        <EditSidePageNavigationModal
          modelName={modelName}
          formHeading={`Edit Related List`}
          sections={removeSectionsWithDuplicateName(
            sections?.filter((section) => {
              if (!hasRelatedTo && section.sectionName === "relatedTo")
                return null;
              else return section;
            })
          )}
          userPreferences={userPreferences}
          savingProcess={savingProcess}
          openActivityCount={openActivityCount}
          closeActivityCount={closeActivityCount}
          notesCount={notesCount}
          attachmentsCount={attachmentsCount}
          emailCount={emailCount}
          reverseRecordLookupsCount={reverseRecordLookupsCount}
          subFormsCount={subFormsCount}
          cardContainerOrder={getDetailCardContainerOrder(
            cardContainerOrder,
            modelName,
            fieldsList
          )}
          onCancel={() => setEditSideNavigation(false)}
          handleUpdateUserPreferences={() => {
            handleUpdateUserPreferences(false);
          }}
          handleUpdateSideNavigationOrder={(values) => {
            handleUpdateSideNavigationOrder(values, true);
          }}
        />
      )}
      {imapEmailModal.visible && (
        <EmailScreen
          record={imapEmailModal.record}
          onCancel={() => setImapEmailModal({ visible: false, record: null })}
        />
      )}
    </>
  );
};
