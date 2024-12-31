import React from "react";
import Image from "next/image";
import { ToggleMailSync } from "./ToggleMailSync";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import _ from "lodash";
import {
  LinkedAccount,
  MailSyncJob,
  Platform,
} from "../shared/UserEmailSettingsConstants";
import AlertIcon from "remixicon-react/AlertFillIcon";

export type EmailConfigWidgetCardProps = {
  service: Platform;
  account: LinkedAccount;
  mailSyncJobs: Record<string, MailSyncJob>;
  setMailSyncJobs: (value: Record<string, MailSyncJob>) => void;
  setMailSyncJobLoading: (value: boolean) => void;
  handleRemoveAccount: (account: LinkedAccount) => void;
  handleRemoveSynchronzation: (id: string | null) => void;
  setShowMailSyncJobStats: (value: { visible: boolean; label: string }) => void;
};

export const EmailConfigWidgetCard = ({
  service,
  account,
  mailSyncJobs,
  setMailSyncJobs,
  setMailSyncJobLoading,
  handleRemoveAccount,
  handleRemoveSynchronzation,
  setShowMailSyncJobStats,
}: EmailConfigWidgetCardProps) => {
  return (
    <div className={`w-full bg-white rounded-lg drop-shadow-lg p-4`}>
      {!account.isActive && (
        <p className="w-full text-xsm grid grid-cols-6 p-2 bg-gray-100 rounded-lg my-2">
          <p className="w-full h-full flex items-center justify-center">
            <AlertIcon color="orange" size="24" className="mr-2" />
          </p>
          <p className="col-span-5">
            {`There was some issue with your account, please remove your account and try reconnecting`}
          </p>
        </p>
      )}
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center gap-x-2">
          <Image
            height={40}
            width={40}
            src={service.logo}
            alt={service.service}
          />
          {service.service}
        </div>
        <ToggleMailSync
          account={account}
          setMailSyncJobs={setMailSyncJobs}
          mailSyncJobs={mailSyncJobs}
          setMailSyncJobLoading={setMailSyncJobLoading}
        />
      </div>
      <div className="flex flex-col gap-y-1 mt-2">
        <p className="bg-gray-100 text-gray-600 px-2 my-2">Basic Information</p>
        <p className="text-sm text-gray-400 px-2 inline-block">
          Protocol :{" "}
          <p className="text-sm text-vryno-label-gray-secondary inline-block">
            IMAP Integration
          </p>
        </p>
        <p className="text-sm text-gray-400 px-2 inline-block">
          Email Address :{" "}
          <p className="text-sm text-vryno-label-gray-secondary inline-block">
            {account.identity}
          </p>
        </p>
        <div className="w-full grid grid-cols-2 gap-x-4 mt-2 items-center">
          <Button
            id="delete-imap-integration"
            userEventName="delete-imap-integration"
            onClick={() => {
              handleRemoveAccount(account);
              handleRemoveSynchronzation(
                _.get(mailSyncJobs[account.identity], "id", null)
              );
            }}
            kind={"back"}
            buttonType="thin"
          >
            Remove
          </Button>
          <Button
            id="check-mail-sync-job-stats"
            userEventName="check-mail-sync-job-stats"
            onClick={async () => {
              setShowMailSyncJobStats({
                visible: true,
                label: account.identity,
              });
            }}
            kind={"next"}
            buttonType="thin"
          >
            Detail
          </Button>
        </div>
      </div>
    </div>
  );
};
