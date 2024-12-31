import React from "react";
import AddIcon from "remixicon-react/AddLineIcon";
import ChooseFieldsIcon from "remixicon-react/ListCheckIcon";
import FileUploadIcon from "remixicon-react/FileUploadLineIcon";
import LinkIcon from "remixicon-react/LinkIcon";
import { IAttachmentModal } from "../../generic/GenericModelDetails/Attachments/attachmentHelper";
import { ButtonDropdown } from "../../../../../components/TailwindControls/Form/ButtonDropdown/ButtonDropdown";
import { IFormActivityModalObject } from "../../generic/GenericModelDetails/ActivityRelatedTo/activityRelatedToHelper";
import { SupportedApps } from "../../../../../models/shared";
import { paramCase } from "change-case";

export type DetailPageSizeNavItemProps = {
  item: {
    id: string;
    label: string;
    value: string;
    name: string;
    type: string;
    order: number;
    count?: number | undefined;
  };
  currentPageNavigation: any;
  setQuickCreateReverseLookupModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  setChooseFieldModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  onModuleChange?: (name: string) => void;
  setCurrentPageNavigation: (item: any) => void;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  activityDropdownOptions: any[];
  setAddActivityModal: React.Dispatch<
    React.SetStateAction<IFormActivityModalObject>
  >;
  modelName: string;
  recordId: string;
  appName: SupportedApps;
};

export const DetailPageSizeNavItem = ({
  item,
  currentPageNavigation,
  onModuleChange = () => {},
  setCurrentPageNavigation,
  setQuickCreateReverseLookupModal,
  setChooseFieldModal,
  setQuickCreateNoteModal,
  setAddAttachmentUrlModalForm,
  setAddAttachmentModalForm,
  activityDropdownOptions,
  setAddActivityModal,
  modelName,
  recordId,
  appName,
}: DetailPageSizeNavItemProps) => {
  const [showAddIcon, setShowAddIcon] = React.useState<boolean>(false);

  return (
    <a
      className={`text-sm rounded-md rounded-l-none block py-2 my-1 px-1 cursor-pointer hover:bg-gray-100 break-all ${
        currentPageNavigation === item
          ? "bg-gray-100 text-vryno-theme-light-blue border-l-4 border-vryno-theme-light-blue"
          : ""
      }`}
      href={`#${item.id}`}
      onPointerEnter={() => setShowAddIcon(true)}
      onPointerLeave={() => setShowAddIcon(false)}
      onClick={(e) => {
        onModuleChange(item.value);
        setCurrentPageNavigation(item);
      }}
    >
      <span className="w-full flex items-center justify-between text-xsm gap-x-2">
        <p className="flex gap-x-1.5 truncate">
          <p className="truncate">
            <span data-testid={`${item.label || item.name}-link`}>
              {item.label}
            </span>
          </p>
          {typeof item.count === "number" && (
            <span
              className={`bg-vryno-number-box-background cursor-default text-vryno-number-color text-xsm flex items-center justify-center min-w-[12px] px-1.5 h-5 rounded-md`}
              data-testid={`${item.label || item.name}-${item.count}-count`}
            >
              {item.count}
            </span>
          )}
        </p>
        <span
          className={`${
            showAddIcon ? "" : "hidden"
          } flex items-center gap-x-1 ${
            ["reverseLookup"].includes(item.type) ? "" : "hidden"
          }`}
        >
          <ChooseFieldsIcon
            id={`${item.label}-choose-fields`}
            onClick={() => {
              onModuleChange(item.value);
              setCurrentPageNavigation(item);
              setChooseFieldModal({
                reverseLookupName: item.name,
                visible: true,
              });
            }}
            className="hover:text-vryno-theme-light-blue hover:cursor-pointer"
            size={15}
          />
          <AddIcon
            id={`${item.label}-add-record`}
            onClick={() => {
              onModuleChange(item.value);
              setCurrentPageNavigation(item);
              setQuickCreateReverseLookupModal({
                reverseLookupName: item.name,
                visible: true,
              });
            }}
            className="hover:text-vryno-theme-light-blue hover:cursor-pointer"
            size={18}
          />
        </span>
        {["notes"].includes(item.type) ? (
          <span
            className={`${showAddIcon ? "" : "hidden"}`}
            id={"note"}
            data-testid={`quick-add-notes`}
          >
            <AddIcon
              onClick={() => {
                onModuleChange(item.value);
                setCurrentPageNavigation(item);
                if (item.type === "notes") setQuickCreateNoteModal(true);
              }}
              className="hover:text-vryno-theme-light-blue hover:cursor-pointer"
              size={18}
            />
          </span>
        ) : ["attachments"].includes(item.type) ? (
          <span className={`${showAddIcon ? "" : "hidden"} flex gap-x-1`}>
            {[
              {
                icon: <FileUploadIcon size={16} />,
                label: `Upload File`,
                id: "quick-add-attachments-upload-file",
                onClick: () => {
                  setAddAttachmentModalForm({
                    visible: true,
                    data: {},
                    id: null,
                  });
                },
                labelClasses: "",
              },
              {
                icon: <LinkIcon size={16} />,
                label: `Add Url`,
                id: "quick-add-attachments-add-url",
                onClick: () => {
                  setAddAttachmentUrlModalForm({
                    visible: true,
                    data: {},
                    id: null,
                  });
                },
                labelClasses: "",
              },
            ].map((menuItem, index) => (
              <span
                key={index}
                className="hover:text-vryno-theme-light-blue hover:cursor-pointer"
                onClick={menuItem.onClick}
                id={menuItem.id}
                data-testid={menuItem.id}
              >
                {menuItem.icon}
              </span>
            ))}
          </span>
        ) : ["activity"].includes(item.type) &&
          activityDropdownOptions?.length ? (
          <span className={`${showAddIcon ? "" : "hidden"} flex gap-x-1`}>
            <ButtonDropdown
              id={paramCase(item.value)}
              options={activityDropdownOptions}
              onClick={(data: { value: string; label: string }) => {
                setAddActivityModal({
                  visible: true,
                  formDetails: {
                    type: "Add",
                    parentId: recordId,
                    parentModelName: modelName,
                    id: null,
                    modelName: data.value,
                    aliasName: data.label,
                    appName: appName,
                    activityType:
                      item.value === "openActivities" ? "open" : "closed",
                  },
                });
              }}
            />
          </span>
        ) : (
          <></>
        )}
      </span>
    </a>
  );
};
