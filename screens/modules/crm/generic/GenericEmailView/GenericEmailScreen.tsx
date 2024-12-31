import React from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import { IEmailSetting, IEmailTemplate } from "../../../../../models/shared";
import { HandleEmailScreen } from "./HandleEmailScreen";
import Pagination from "../../shared/components/Pagination";

export type GenericEmailScreenProps = {
  emails: Record<string, string>[];
  allEmails: Record<string, string>[];
  itemsCount: number;
  selectedButton: string;
  emailFetchLoading: boolean;
  appName: string;
  modelName: string;
  emailTemplates: IEmailTemplate[];
  currentPageNumber: number;
  handlePageChange: (pageNumber: number) => void;
  setSelectedButton: (value: string) => void;
  setSendEmailModal: (value: boolean) => void;
  handleCancelEmail: (item: Record<string, string>) => void;
  statusChangeProcess: boolean;
  setStatusChangeProcess: (value: boolean) => void;
  handleEmailJobStatusChange: (id: string, recordStatus: "a" | "i") => void;
};

export const GenericEmailScreen = ({
  emails,
  allEmails,
  itemsCount,
  selectedButton,
  emailFetchLoading,
  appName,
  modelName,
  emailTemplates,
  currentPageNumber,
  handlePageChange = () => {},
  setSelectedButton,
  setSendEmailModal,
  handleCancelEmail,
  statusChangeProcess,
  setStatusChangeProcess,
  handleEmailJobStatusChange,
}: GenericEmailScreenProps) => {
  return (
    <>
      <GenericBackHeader heading="Mass Email">
        <div className={`${emailTemplates.length ? "block" : "hidden"}`}>
          <Button
            id="send-email"
            buttonType="thin"
            disabled={!emailTemplates?.length}
            onClick={() => setSendEmailModal(true)}
            userEventName="open-massEmail-create-modal-click"
          >
            <span className="flex items-center gap-x-2">
              <AddCircleFillIcon size={16} />
              Create Mass Email
            </span>
          </Button>
        </div>
      </GenericBackHeader>
      <div className="p-6">
        <div
          className={`flex gap-x-4 justify-between sm:max-w-md pb-6 ${
            emailTemplates.length ? "block" : "hidden"
          }`}
        >
          <Button
            id="inProcess-emails"
            buttonType="thin"
            kind={`${selectedButton === "inProcess" ? "icon" : "secondary"}`}
            onClick={() => setSelectedButton("inProcess")}
            userEventName="open-massEmail-in-process-jobs-click"
          >
            In Process
          </Button>
          <Button
            id="completed-emails"
            buttonType="thin"
            kind={`${selectedButton === "completed" ? "icon" : "secondary"}`}
            onClick={() => setSelectedButton("completed")}
            userEventName="open-massEmail-completed-jobs-click"
          >
            Completed
          </Button>
          <Button
            id="error-emails"
            buttonType="thin"
            kind={`${selectedButton === "error" ? "icon" : "secondary"}`}
            onClick={() => setSelectedButton("error")}
            userEventName="open-massEmail-error-jobs-click"
          >
            Failed
          </Button>
        </div>
        {emails.length > 0 && (
          <Pagination
            itemsCount={itemsCount}
            pageInfoLocation="between"
            currentPageNumber={currentPageNumber}
            currentPageItemCount={emails?.length}
            onPageChange={(pageNumber) => handlePageChange(pageNumber)}
          />
        )}
        <HandleEmailScreen
          appName={appName}
          modelName={modelName}
          emailTemplates={emailTemplates}
          emails={emails}
          emailFetchLoading={emailFetchLoading}
          selectedButton={selectedButton}
          setSendEmailModal={setSendEmailModal}
          handleCancelEmail={(item) => handleCancelEmail(item)}
          statusChangeProcess={statusChangeProcess}
          setStatusChangeProcess={setStatusChangeProcess}
          handleEmailJobStatusChange={handleEmailJobStatusChange}
        />
      </div>
    </>
  );
};
