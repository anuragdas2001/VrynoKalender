import React, { useContext } from "react";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import { DetailPageSizeNavItem } from "./DetailPageSizeNavItem";
import { ICustomField } from "../../../../../models/ICustomField";
import { IAttachmentModal } from "../../generic/GenericModelDetails/Attachments/attachmentHelper";
import { IGenericActivityLabel } from "../../generic/GenericModelDetails/TypesGenericModelDetails";
import { IFormActivityModalObject } from "../../generic/GenericModelDetails/ActivityRelatedTo/activityRelatedToHelper";
import { SupportedApps } from "../../../../../models/shared";
import { MessageListContext } from "../../../../../pages/_app";

export type DetailsPageSideNavProps = {
  menuItems: {
    id: string;
    label: string;
    value: string;
    name: string;
    type: string;
    order: number;
    count?: number;
  }[];
  fieldsList: ICustomField[];
  setQuickCreateReverseLookupModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  setChooseFieldModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  onModuleChange?: (name: string) => void;
  setEditSideNavigation: (value: boolean) => void;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  navActivityModuleLabels: IGenericActivityLabel;
  modelName: string;
  recordId: string;
  appName: SupportedApps;
  setAddActivityModal: React.Dispatch<
    React.SetStateAction<IFormActivityModalObject>
  >;
};

const DetailsPageSideNav = ({
  menuItems,
  fieldsList,
  setQuickCreateReverseLookupModal,
  setChooseFieldModal,
  onModuleChange = () => {},
  setEditSideNavigation,
  setQuickCreateNoteModal,
  setAddAttachmentUrlModalForm,
  setAddAttachmentModalForm,
  navActivityModuleLabels,
  modelName,
  recordId,
  appName,
  setAddActivityModal,
}: DetailsPageSideNavProps) => {
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  const [currentPageNavigation, setCurrentPageNavigation] = React.useState<any>(
    menuItems[0]
  );
  const activityDropdownOptions: any[] = [];

  if (navActivityModuleLabels["callLog"]) {
    activityDropdownOptions.push({
      label: navActivityModuleLabels["callLog"],
      value: "callLog",
    });
  }
  if (navActivityModuleLabels["meeting"]) {
    activityDropdownOptions.push({
      label: navActivityModuleLabels["meeting"],
      value: "meeting",
    });
  }
  if (navActivityModuleLabels["task"]) {
    activityDropdownOptions.push({
      label: navActivityModuleLabels["task"],
      value: "task",
    });
  }

  return (
    <>
      <span
        data-testid="related-list-button"
        className={`text-base flex items-center justify-between rounded-md py-1.5 px-1 break-all text-vryno-label-gray`}
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
      <div
        className={`hover:card-scroll hover:overflow-y-scroll ${
          appMessage?.length > 0 && instanceMessage?.length > 0
            ? "mb-[100px]"
            : appMessage?.length || instanceMessage?.length > 0
            ? "mb-20"
            : "mb-15"
        }`}
      >
        {menuItems
          ?.filter((item) => {
            if (item.type === "email") {
              if (
                fieldsList?.filter((field) => field?.dataType === "email")
                  ?.length > 0
              ) {
                return item;
              } else return null;
            } else {
              return item;
            }
          })
          ?.map((item) => item)
          .map((item, index) => (
            <DetailPageSizeNavItem
              key={index}
              item={item}
              currentPageNavigation={currentPageNavigation}
              onModuleChange={onModuleChange}
              setCurrentPageNavigation={setCurrentPageNavigation}
              setChooseFieldModal={setChooseFieldModal}
              setQuickCreateReverseLookupModal={
                setQuickCreateReverseLookupModal
              }
              setQuickCreateNoteModal={setQuickCreateNoteModal}
              setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
              setAddAttachmentModalForm={setAddAttachmentModalForm}
              activityDropdownOptions={activityDropdownOptions}
              setAddActivityModal={setAddActivityModal}
              modelName={modelName}
              recordId={recordId}
              appName={appName}
            />
          ))}
      </div>
    </>
  );
};
export default DetailsPageSideNav;
