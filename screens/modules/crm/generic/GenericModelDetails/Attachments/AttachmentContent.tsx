import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import Link from "next/link";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import FileUploadIcon from "remixicon-react/FileUploadLineIcon";
import LinkIcon from "remixicon-react/LinkIcon";
import AttachmentList from "./AttachmentList";
import { ClickOutsideToClose } from "../../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import React from "react";
import { IFile } from "../../../../../../models/IFile";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IDeleteModalState } from "../../GenericModelView/GenericModalCardItems";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { IUserPreference } from "../../../../../../models/shared";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { IAttachmentModal } from "./attachmentHelper";

export const AttachmentContent = ({
  cardHeading,
  modelName,
  id,
  attachmentMenuVisible,
  attachmentFieldList,
  attachments,
  userPreferences,
  setDeleteModal,
  handleOpenCollapseCardContainer = () => {},
  setAttachmentMenuVisible,
  setAddAttachmentModalForm,
  setAddAttachmentUrlModalForm,
  attachmentDataLoading,
  attachmentsCount,
  handleAttachmentLoadMoreClicked,
}: {
  cardHeading: string;
  modelName: string;
  id: string;
  attachmentMenuVisible: boolean;
  attachmentFieldList: ICustomField[];
  attachments: IFile[];
  userPreferences: IUserPreference[];
  setDeleteModal: React.Dispatch<React.SetStateAction<IDeleteModalState>>;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  setAttachmentMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  attachmentDataLoading: boolean;
  attachmentsCount: number;
  handleAttachmentLoadMoreClicked: () => void;
}) => {
  const wrapperRef = React.useRef(null);
  ClickOutsideToClose(wrapperRef, (value) => setAttachmentMenuVisible(value));

  const attachmentButtonAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setAttachmentMenuVisible(!attachmentMenuVisible);
  };

  return (
    <GenericHeaderCardContainer
      id={id}
      modelName={modelName}
      cardHeading={cardHeading}
      allowOverflow={true}
      userPreferences={userPreferences}
      headerButton={
        <div
          className="h-9 relative z-[200] w-28 rounded-md grid grid-cols-10 border border-vryno-button-border cursor-pointer"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
          }}
        >
          <Button
            id={"attachment-action-button-text"}
            customStyle="col-span-8 flex flex-row items-center justify-center pr-1"
            onClick={(e) => attachmentButtonAction(e)}
            userEventName="add-attachment:action-click"
          >
            <span
              className="text-xsm font-medium text-gray-500"
              data-testid="attachment-button"
            >
              Attach
            </span>
          </Button>
          <Button
            id={"attachment-action-button-icon"}
            customStyle="col-span-2 flex h-full w-full items-center justify-center pr-2"
            onClick={(e) => attachmentButtonAction(e)}
            userEventName="attachment-detail-view-toggle:action-click"
          >
            {attachmentMenuVisible ? (
              <ChevronUpIcon size={15} className="text-gray-500" />
            ) : (
              <ChevronDownIcon size={15} className="text-gray-500" />
            )}
          </Button>
          {attachmentMenuVisible && (
            <div
              className="origin-top-right z-10 absolute -right-0 top-10 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              ref={wrapperRef}
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {[
                {
                  icon: (
                    <FileUploadIcon
                      size={16}
                      className="mr-2 text-vryno-dropdown-icon"
                    />
                  ),
                  label: `Upload File`,
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
                  icon: (
                    <LinkIcon
                      size={16}
                      className="mr-2 text-vryno-dropdown-icon"
                    />
                  ),
                  label: `Add Url`,
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
                <Link href="" key={index} legacyBehavior>
                  <a
                    data-testid={`attachment-link-${menuItem.label}`}
                    onClick={(e) => {
                      e.preventDefault();
                      menuItem.onClick();
                    }}
                    id={`attachment-action-link-${menuItem.label
                      .toLowerCase()
                      .split(" ")
                      .join("-")}`}
                    className={`p-2 flex flex-row items-center border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover ${menuItem.labelClasses}`}
                  >
                    {menuItem.icon} {menuItem.label}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      }
      extended={true}
      handleOpenCollapseCardContainer={(id, showDetails) =>
        handleOpenCollapseCardContainer(id, showDetails)
      }
      renderHtmlNextToOpenCloseButton={
        attachments?.length > 0 ? (
          <p>aaa</p>
        ) : (
          // <Pagination
          //   containerName={containerName}
          //   itemsCount={emailCount}
          //   currentPageNumber={currentPageNumber}
          //   disabledLastPage={actualPageNumber === lastPageNumber}
          //   // showTotalCount={false}
          //   // showPageCount={false}
          //   hideFirstLastPageButtons={true}
          //   currentPageItemCount={
          //     emails?.slice(
          //       (currentPageNumber - 1) * 50,
          //       currentPageNumber * 50
          //     )?.length
          //   }
          //   pageInfoLocation="between"
          //   onPageChange={(
          //     pageNumber: number,
          //     pageType?: "first" | "back" | "next" | "last"
          //   ) => {
          //     if (emails?.length < 50 * pageNumber) {
          //       setLoading(true);
          //       fetchMail({
          //         variables: {
          //           expression: "( a )",
          //           orderBy: [{ name: "date", order: ["DESC"] }],
          //           filters: [
          //             {
          //               name: "participants",
          //               operator: "any",
          //               value: emailAddresses,
          //             },
          //           ],
          //           pageNumber:
          //             pageType === "first"
          //               ? 1
          //               : pageType === "back"
          //               ? pageNumber
          //               : pageType === "last"
          //               ? pageNumber
          //               : actualPageNumber + 1,
          //         },
          //       });
          //     }
          //     setCurrentPageNumber(pageNumber);
          //     setActualPageNumber(
          //       pageType === "first"
          //         ? 1
          //         : pageType === "back"
          //         ? pageNumber
          //         : pageType === "last"
          //         ? pageNumber
          //         : actualPageNumber + 1
          //     );
          //   }}
          // />
          <></>
        )
      }
    >
      {attachmentDataLoading ? (
        <ItemsLoader
          currentView={"List"}
          listTypeMarginTop="mt-0"
          loadingItemCount={1}
        />
      ) : attachments?.length === 0 ? (
        <div className="w-full flex items-center justify-center">
          <span className="text-sm text-gray-600">No Attachment Found</span>
        </div>
      ) : (
        <AttachmentList
          attachmentFieldList={attachmentFieldList}
          attachments={attachments}
          deleteItem={(item) => setDeleteModal({ visible: true, id: item.id })}
          editAttachment={(item) => {
            const payload = {
              visible: true,
              data: {
                name: item.name,
                fileType: item.fileType,
                fileName: item.fileName,
                fileKey: item.fileKey,
              },
              id: item.id,
            };
            item.fileType === "attachment_link"
              ? setAddAttachmentUrlModalForm(payload)
              : setAddAttachmentModalForm(payload);
          }}
          userPreferences={userPreferences}
          modelName={modelName}
          attachmentsCount={attachmentsCount}
          handleAttachmentLoadMoreClicked={handleAttachmentLoadMoreClicked}
          attachmentDataLoading={attachmentDataLoading}
        />
      )}
    </GenericHeaderCardContainer>
  );
};
