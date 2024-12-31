import React from "react";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { ActivitiesModule } from "../../../../../../shared/constants";
import DetailsPageSideNav from "../../../shared/components/DetailsPageSideNav";
import { RelatedToSideNav } from "../RelatedToSideNav";
import { MobileApplicationLogo } from "../../../shared/components/MobileApplicationLogo";
import MobileMenuIcon from "remixicon-react/MenuUnfoldLineIcon";
import CloseIcon from "remixicon-react/CloseLineIcon";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { getCardContainerOrderSideNavMapper } from "./getCardContainerOrderSideNavMapper";
import { IAttachmentModal } from "../Attachments/attachmentHelper";
import { IGenericActivityLabel } from "../TypesGenericModelDetails";
import { IFormActivityModalObject } from "../ActivityRelatedTo/activityRelatedToHelper";
import { SupportedApps } from "../../../../../../models/shared";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SectionDetailsType } from "../../GenericForms/Shared/genericFormProps";

export type SidePageNavigationMobileProps = {
  modelName: string;
  modelData: any;
  activeRelatedId: string;
  relatedFilter?: string;
  relatedFilterId?: string;
  fieldsList: ICustomField[];
  currentModule?: IModuleMetadata;
  sideModalClass?: string;
  sections: SectionDetailsType[];
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
    type: string;
    label: string;
    name: string;
    order: number;
  }[];
  setQuickCreateReverseLookupModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  setChooseFieldModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  handleIdChange: (id: string) => void;
  setSideModalClass: (value: string) => void;
  setEditSideNavigation: (value: boolean) => void;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  navActivityModuleLabels: IGenericActivityLabel;
  recordId: string;
  appName: SupportedApps;
  genericModels: IGenericModel;
  setAddActivityModal: React.Dispatch<
    React.SetStateAction<IFormActivityModalObject>
  >;
};

export const SidePageNavigationMobile = ({
  modelName,
  recordId,
  appName,
  modelData,
  activeRelatedId,
  relatedFilter,
  relatedFilterId,
  fieldsList,
  sections,
  currentModule,
  sideModalClass,
  openActivityCount,
  closeActivityCount,
  notesCount,
  attachmentsCount,
  emailCount,
  reverseRecordLookupsCount,
  subFormsCount,
  cardContainerOrder,
  genericModels,
  setQuickCreateReverseLookupModal,
  setChooseFieldModal,
  handleIdChange,
  setSideModalClass,
  setEditSideNavigation,
  setQuickCreateNoteModal,
  setAddAttachmentUrlModalForm,
  setAddAttachmentModalForm,
  navActivityModuleLabels,
  setAddActivityModal,
}: SidePageNavigationMobileProps) => {
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
        <div className="ml-6 mt-6 mb-2 sm:hidden">
          <Button
            id="single-page-nav-mobile-view-toggle"
            customStyle="w-32 py-2 px-4 flex items-center justify-center gap-1 text-lg bg-vryno-theme-blue rounded-md cursor-pointer text-white"
            onClick={(e) => {
              e.preventDefault();
              setSideModalClass("");
            }}
            userEventName="single-page-nav-mobile-visibility:toggle-click"
          >
            <>
              <MobileMenuIcon
                size={20}
                className="mobile-menu-button text-vryno-navbar-name-container sm:hidden cursor-pointer"
              />
              <span className="text-sm whitespace-nowrap">
                {currentModule?.label.en}
              </span>
            </>
          </Button>
          <div
            className={`sidebar w-7/12 h-screen fixed inset-y-0 left-0 sm:hidden transform transition duration-200 ease-in-out z-[2000] shadow-xl overflow-y-scroll ${sideModalClass} mobile-left-nav`}
          >
            <div className="bg-white w-full h-screen">
              <div className="flex justify-between items-center h-20 sm:h-21.5 md:h-15 sticky">
                <span>
                  <MobileApplicationLogo />
                </span>
                <Button
                  id="single-page-nav-mobile-close"
                  customStyle="sidebar-menu-button text-vryno-navbar-name-container mr-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setSideModalClass("-translate-x-full");
                  }}
                  userEventName="single-page-nav-mobile-close:action-click"
                >
                  <CloseIcon size={20} />
                </Button>
              </div>
              {modelData.relatedTo && (
                <div>
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
                    fieldsList={fieldsList}
                    genericModels={genericModels}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="ml-6 mt-6 mb-2 lg:hidden">
          <div
            className="w-36 py-2 px-4 flex items-center justify-center gap-1 text-lg bg-vryno-theme-blue rounded-md cursor-pointer text-white"
            onClick={(e) => {
              e.preventDefault();
              setSideModalClass("");
            }}
          >
            <MobileMenuIcon
              size={20}
              className="mobile-menu-button text-vryno-navbar-name-container lg:hidden cursor-pointer"
            />
            <span className="text-sm whitespace-nowrap">
              {currentModule?.label.en}
            </span>
          </div>
          <div
            className={`sidebar w-[58.33vw] sm:w-[33.33vw] h-screen fixed inset-y-0 left-0 lg:hidden transform transition duration-200 ease-in-out z-[2000] shadow-lg ${sideModalClass}`}
          >
            <div className="h-screen fixed inset-y-0 left-0 flex flex-col p-3 z-10 bg-white w-full">
              <div className="flex items-center justify-between">
                <span>
                  <MobileApplicationLogo />
                </span>
                <CloseIcon
                  size={20}
                  className="sidebar-menu-button text-vryno-navbar-name-container mr-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setSideModalClass("-translate-x-full");
                  }}
                />
              </div>
              <DetailsPageSideNav
                menuItems={cardContainerOrderSideNav}
                fieldsList={fieldsList?.filter((field) => field.visible)}
                setQuickCreateReverseLookupModal={
                  setQuickCreateReverseLookupModal
                }
                setChooseFieldModal={setChooseFieldModal}
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
          </div>
        </div>
      )}
    </>
  );
};
