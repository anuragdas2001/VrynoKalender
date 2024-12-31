import React from "react";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import { useLazyQuery } from "@apollo/client";
import { getGQLOperationParams } from "../../../../../../graphql/helpers/operationSchemaMapper";
import { onMailSyncJobsComplete } from "../shared/emailSettingHelpers";
import {
  LinkedAccount,
  MailSyncJob,
} from "../shared/UserEmailSettingsConstants";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import _ from "lodash";

export type MailSyncJobStatsProps = {
  accounts: LinkedAccount[];
  accountIdentity: string;
  mailSyncJobLoading: boolean;
  mailSyncJobs: Record<string, MailSyncJob>;
  setMailSyncJobs: (value: Record<string, MailSyncJob>) => void;
  setMailSyncJobLoading: (value: boolean) => void;
};

export const MailSyncJobStats = ({
  accounts,
  accountIdentity,
  mailSyncJobs,
  mailSyncJobLoading,
  setMailSyncJobs,
  setMailSyncJobLoading,
}: MailSyncJobStatsProps) => {
  const [fetchMailSynchronizationJob] = useLazyQuery(
    ...getGQLOperationParams({
      topic: "notify",
      operation: "fetchMailSynchronizationJob",
      onCompleted: onMailSyncJobsComplete({
        operation: "fetchMailSynchronizationJob",
        setMailSyncJobs: setMailSyncJobs,
        setMailSyncJobLoading: setMailSyncJobLoading,
      }),
      onError: () => {
        setMailSyncJobLoading(false);
      },
    })
  );

  React.useEffect(() => {
    fetchMailSynchronizationJob({
      variables: {
        filters: [
          {
            name: "mailAccount",
            operator: "in",
            value: accounts.map((account) => account.identity),
          },
        ],
      },
    });
  }, []);

  return (
    <>
      {!mailSyncJobLoading ? (
        _.get(mailSyncJobs[accountIdentity], "stats", "") &&
        JSON.parse(_.get(mailSyncJobs[accountIdentity], "stats", ""))?.length >
          0 ? (
          <div className={`w-full h-full`}>
            <GenericList
              listSelector={false}
              tableHeaders={[
                {
                  columnName: "mailboxName",
                  label: "Folder Name",
                  dataType: "singleline",
                },
                {
                  columnName: "exists",
                  label: "Mail synced",
                  dataType: "number",
                },
                {
                  columnName: "syncedFromDate",
                  label: "from date",
                  dataType: "datetime",
                },
                {
                  columnName: "syncedToDate",
                  label: "till date",
                  dataType: "datetime",
                },
              ]}
              data={JSON.parse(
                _.get(mailSyncJobs[accountIdentity], "stats", "")
              )}
              oldGenericListUI={true}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            No Stats at the moment
          </div>
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loading color="Blue" />
        </div>
      )}
    </>
  );
};
