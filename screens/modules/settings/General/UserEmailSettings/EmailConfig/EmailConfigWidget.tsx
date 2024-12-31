import React from "react";
import { useLazyQuery } from "@apollo/client";
import { LinkedAccount } from "../shared/UserEmailSettingsConstants";
import { PLATFORM_SERVICE_MAP } from "../shared/UserEmailSettingsConstants";
import { MailSyncJob } from "../shared/UserEmailSettingsConstants";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { getGQLOperationParams } from "../../../../../../graphql/helpers/operationSchemaMapper";
import { onMailSyncJobsComplete } from "../shared/emailSettingHelpers";
import { SupportedDashboardViews } from "../../../../../../models/shared";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { MailSyncJobStats } from "./MailSyncJobStats";
import { EmailConfigWidgetCard } from "./EmailConfigWidgetCard";

export const EmailConfigWidgets = ({
  accounts,
  handleRemoveAccount,
  handleRemoveSynchronzation,
}: {
  accounts: LinkedAccount[];
  handleRemoveAccount: (account: LinkedAccount) => void;
  handleRemoveSynchronzation: (id: string | null) => void;
}) => {
  const [mailSyncJobLoading, setMailSyncJobLoading] = React.useState(true);
  const [mailSyncJobs, setMailSyncJobs] = React.useState<
    Record<string, MailSyncJob>
  >({});
  const [showMailSyncJobStats, setShowMailSyncJobStats] = React.useState<{
    visible: boolean;
    label: string;
  }>({ visible: false, label: "" });

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

  return mailSyncJobLoading ? (
    <ItemsLoader
      currentView={SupportedDashboardViews.Card}
      loadingItemCount={2}
    />
  ) : (
    <>
      <div className="grid sm-grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {accounts.map((account: LinkedAccount) => {
          const service = PLATFORM_SERVICE_MAP[account.platform];
          const Widget = () => {
            return (
              <EmailConfigWidgetCard
                service={service}
                account={account}
                mailSyncJobs={mailSyncJobs}
                handleRemoveAccount={handleRemoveAccount}
                handleRemoveSynchronzation={handleRemoveSynchronzation}
                setMailSyncJobLoading={setMailSyncJobLoading}
                setShowMailSyncJobStats={setShowMailSyncJobStats}
                setMailSyncJobs={setMailSyncJobs}
              />
            );
          };
          return <Widget key={account.identity} />;
        })}
      </div>
      {showMailSyncJobStats?.visible && (
        <>
          <GenericFormModalContainer
            topIconType="Close"
            formHeading={`${showMailSyncJobStats?.label}`}
            onCancel={() =>
              setShowMailSyncJobStats({ visible: false, label: "" })
            }
            onOutsideClick={() =>
              setShowMailSyncJobStats({ visible: false, label: "" })
            }
          >
            <MailSyncJobStats
              accounts={accounts}
              mailSyncJobLoading={mailSyncJobLoading}
              accountIdentity={showMailSyncJobStats?.label}
              mailSyncJobs={mailSyncJobs}
              setMailSyncJobs={setMailSyncJobs}
              setMailSyncJobLoading={setMailSyncJobLoading}
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setShowMailSyncJobStats({ visible: false, label: "" })
            }
          />
        </>
      )}
    </>
  );
};
