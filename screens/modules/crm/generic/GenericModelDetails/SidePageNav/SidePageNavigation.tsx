import React, { useContext } from "react";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { ActivitiesModule } from "../../../../../../shared/constants";
import DetailsPageSideNav from "../../../shared/components/DetailsPageSideNav";
import { RelatedToSideNav } from "../RelatedToSideNav";
import { getCardContainerOrderSideNavMapper } from "./getCardContainerOrderSideNavMapper";
import { IAttachmentModal } from "../Attachments/attachmentHelper";
import { IGenericActivityLabel } from "../TypesGenericModelDetails";
import { IFormActivityModalObject } from "../ActivityRelatedTo/activityRelatedToHelper";
import { SupportedApps } from "../../../../../../models/shared";
import { MessageListContext } from "../../../../../../pages/_app";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SectionDetailsType } from "../../GenericForms/Shared/genericFormProps";

export type SidePageNavigationProps = {
  modelName: string;
  recordId: string;
  appName: SupportedApps;
  modelData: any;
  sections: SectionDetailsType[];
  handleIdChange: (id: string) => void;
  activeRelatedId: string;
  relatedFilter?: string;
  relatedFilterId?: string;
  fieldsList: ICustomField[];
  currentModule?: IModuleMetadata;
  openActivityCount: number;
  closeActivityCount: number;
  notesCount: number;
  attachmentsCount: number;
  emailCount: number;
  reverseRecordLookupsCount?: { label: string; value: string; count: number }[];
  subFormsCount?: {
    id: string;
    label: string;
    value: string;
    count: number;
  }[];
  cardContainerOrder: {
    id: string;
    label: string;
    name: string;
    type: string;
    order: number;
  }[];
  genericModels: IGenericModel;
  setQuickCreateReverseLookupModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  setChooseFieldModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  setEditSideNavigation: (value: boolean) => void;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  navActivityModuleLabels: IGenericActivityLabel;
  setAddActivityModal: React.Dispatch<
    React.SetStateAction<IFormActivityModalObject>
  >;
};

export const SidePageNavigation = ({
  modelName,
  recordId,
  appName,
  modelData,
  sections,
  activeRelatedId,
  relatedFilter,
  relatedFilterId,
  fieldsList,
  currentModule,
  openActivityCount,
  closeActivityCount,
  notesCount,
  emailCount,
  attachmentsCount,
  reverseRecordLookupsCount,
  subFormsCount,
  cardContainerOrder,
  genericModels,
  handleIdChange,
  setQuickCreateReverseLookupModal,
  setChooseFieldModal,
  setEditSideNavigation,
  setQuickCreateNoteModal,
  setAddAttachmentUrlModalForm,
  setAddAttachmentModalForm,
  navActivityModuleLabels,
  setAddActivityModal,
}: SidePageNavigationProps) => {
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  let cardContainerOrderSideNav: {
    id: string;
    label: string;
    value: string;
    name: string;
    type: string;
    order: number;
    count?: number;
  }[] =
    cardContainerOrder?.length > 0
      ? [
          ...getCardContainerOrderSideNavMapper(
            cardContainerOrder,
            sections,
            openActivityCount,
            closeActivityCount,
            notesCount,
            attachmentsCount,
            emailCount,
            reverseRecordLookupsCount,
            subFormsCount
          ),
        ]
      : [];

  return (
    <>
      {modelName in ActivitiesModule ? (
        modelData && Object.keys(modelData)?.length > 0 ? (
          <div
            className={`h-screen fixed inset-y-0 left-0 ${
              appMessage?.length > 0 && instanceMessage?.length > 0
                ? `mt-[120px] sm:mt-[126px] md:mt-[100px]`
                : appMessage?.length > 0 || instanceMessage?.length > 0
                ? `mt-[100px] sm:mt-[106px] md:mt-[80px]`
                : "mt-20 sm:mt-21.5 md:mt-15"
            } bg-white hidden lg:flex lg:flex-col z-10 lg:w-[20vw] xl:w-[16.67vw] shadow-xl`}
          >
            <span
              data-testid="related-list-button"
              className={`text-base flex items-center justify-between rounded-md break-all text-vryno-label-gray px-4 pt-4.5 pb-1.5`}
            >
              Related List
              <EditBoxIcon
                size={16}
                className={`hover:text-vryno-theme-light-blue cursor-pointer`}
                onClick={() => {
                  setEditSideNavigation(true);
                }}
              />
            </span>
            <RelatedToSideNav
              idChange={handleIdChange}
              activeRelatedId={activeRelatedId}
              relatedFilterValue={relatedFilter || ""}
              relatedFilterId={relatedFilterId || ""}
              fieldsList={fieldsList?.filter((field) => field.visible)}
              genericModels={genericModels}
            />
          </div>
        ) : (
          <div
            className={`h-screen overflow-y-auto fixed inset-y-0 left-0 ${
              appMessage?.length > 0 && instanceMessage?.length > 0
                ? `mt-[120px] sm:mt-[126px] md:mt-[100px]`
                : appMessage?.length > 0 || instanceMessage?.length > 0
                ? `mt-[100px] sm:mt-[106px] md:mt-[80px]`
                : "mt-20 sm:mt-21.5 md:mt-15"
            } bg-white hidden lg:block lg:w-[20vw] xl:w-[16.67vw] shadow-xl`}
          ></div>
        )
      ) : (
        <div
          className={`h-screen fixed inset-y-0 left-0 ${
            appMessage?.length > 0 && instanceMessage?.length > 0
              ? `mt-[120px] sm:mt-[126px] md:mt-[100px]`
              : appMessage?.length > 0 || instanceMessage?.length > 0
              ? `mt-[100px] sm:mt-[106px] md:mt-[80px]`
              : "mt-20 sm:mt-21.5 md:mt-15"
          } bg-white hidden lg:flex lg:flex-col p-3 z-10 lg:w-[20vw] xl:w-[16.67vw] shadow-xl`}
        >
          <DetailsPageSideNav
            menuItems={cardContainerOrderSideNav}
            fieldsList={fieldsList?.filter((field) => field.visible)}
            setChooseFieldModal={setChooseFieldModal}
            setQuickCreateReverseLookupModal={setQuickCreateReverseLookupModal}
            setEditSideNavigation={(value) => setEditSideNavigation(value)}
            setQuickCreateNoteModal={setQuickCreateNoteModal}
            setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
            setAddAttachmentModalForm={setAddAttachmentModalForm}
            navActivityModuleLabels={navActivityModuleLabels}
            modelName={modelName}
            recordId={recordId}
            appName={appName}
            setAddActivityModal={setAddActivityModal}
          />
        </div>
      )}
    </>
  );
};
