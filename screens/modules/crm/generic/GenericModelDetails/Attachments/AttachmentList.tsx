import React from "react";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import { downloadFile } from "../../../shared/utils/downloadFile";
import { Config } from "../../../../../../shared/constants";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import { IFile } from "../../../../../../models/IFile";
import { getAppPathParts } from "../../../shared/utils/getAppPathParts";
import { ActionWrapper } from "../../../shared/components/ActionWrapper";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { IUserPreference } from "../../../../../../models/shared";
import { LoadMoreDataComponent } from "../../../../../../components/TailwindControls/LoadMoreDataComponent";

export type AttachmentListProps = {
  attachments: IFile[];
  attachmentFieldList: ICustomField[];
  deleteItem: (item: IFile) => void;
  editAttachment: (item: IFile) => void;
  userPreferences: IUserPreference[];
  modelName: string;
  attachmentsCount: number;
  handleAttachmentLoadMoreClicked: () => void;
  attachmentDataLoading: boolean;
};

const AttachmentList = ({
  attachments,
  attachmentFieldList,
  deleteItem,
  editAttachment,
  userPreferences,
  modelName,
  attachmentsCount,
  handleAttachmentLoadMoreClicked,
  attachmentDataLoading,
}: AttachmentListProps) => {
  const { appName } = getAppPathParts();
  const attachmentRowClick = (value: IFile) => {
    if (value.fileType === "attachment_link") {
      window.open(value.fileName, "_blank")?.focus();
      return;
    }
    downloadFile(
      `${Config.metaPrivateUploadUrl()}${appName}/${"attachment"}/${
        value.fileKey
      }`,
      value.fileName
    );
  };
  return (
    <div
      className={`${
        userPreferences?.[0]?.defaultPreferences?.[modelName]
          ?.selectedSizeView === "noLimit"
          ? ""
          : // : "max-h-80 overflow-scroll"
            "overflow-y-auto max-h-80 max-w-[inherit]"
      }`}
    >
      <GenericList
        listSelector={false}
        data={attachments}
        tableHeaders={[
          {
            columnName: "name",
            label: "File Name",
            dataType: "singleline",
          },
          {
            columnName: "createdBy",
            label: "Attachment By",
            dataType: "recordLookup",
          },
          {
            columnName: "createdAt",
            label: "Date Added",
            dataType: "date",
          },
          {
            label: "Actions",
            columnName: "actions",
            dataType: SupportedDataTypes.singleline,
            render: (record: any, index: number) => {
              return (
                <ActionWrapper
                  index={index}
                  content={
                    <tbody className="w-full">
                      <tr className={`text-sm text-left`}>
                        <td
                          className={`py-5 max-w-table-column truncate flex gap-x-4 text-vryno-theme-light-blue`}
                        >
                          <Button
                            id={`edit-attachment-${index}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              editAttachment(record);
                            }}
                            customStyle="cursor-pointer"
                            userEventName="attachment-edit:action-click"
                          >
                            <EditBoxIcon size={20} />
                          </Button>
                          <Button
                            id={`delete-attachment-${index}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteItem(record);
                            }}
                            customStyle="cursor-pointer"
                            userEventName="attachment-delete:action-click"
                          >
                            <DeleteBinIcon size={20} />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  }
                />
              );
            },
          },
        ]}
        fieldsList={attachmentFieldList}
        handleRowClick={attachmentRowClick}
        oldGenericListUI={true}
      />
      <LoadMoreDataComponent
        itemsCount={attachmentsCount}
        currentDataCount={attachments?.length ?? 0}
        loading={attachmentDataLoading}
        handleLoadMoreClicked={handleAttachmentLoadMoreClicked}
      />
    </div>
  );
};

export default AttachmentList;
