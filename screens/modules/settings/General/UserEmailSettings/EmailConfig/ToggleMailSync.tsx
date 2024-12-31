import React from "react";
import { Formik } from "formik";
import { useMutation } from "@apollo/client";
import { LinkedAccount } from "../shared/UserEmailSettingsConstants";
import { MailSyncJob } from "../shared/UserEmailSettingsConstants";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { onMailSyncJobsComplete } from "../shared/emailSettingHelpers";
import { STATE_MAPPER } from "../shared/UserEmailSettingsConstants";
import { MailSyncJObStatus } from "../shared/UserEmailSettingsConstants";
import { getGQLOperationParams } from "../../../../../../graphql/helpers/operationSchemaMapper";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import _ from "lodash";

export const ToggleMailSync = ({
  account,
  mailSyncJobs,
  setMailSyncJobs,
  setMailSyncJobLoading,
}: {
  account: LinkedAccount;
  mailSyncJobs: Record<string, MailSyncJob>;
  setMailSyncJobs: (_: Record<string, MailSyncJob>) => void;
  setMailSyncJobLoading: (_: boolean) => void;
}) => {
  const [toggle, setToggle] = React.useState(false);

  const [updateMailSynchronizationJob] = useMutation(
    ...getGQLOperationParams({
      topic: "notify",
      operation: "updateMailSynchronizationJob",
      onCompleted: onMailSyncJobsComplete({
        operation: "updateMailSynchronizationJob",
        setMailSyncJobs: setMailSyncJobs,
        setMailSyncJobLoading: setMailSyncJobLoading,
      }),
      onError: () => {
        setMailSyncJobLoading(false);
      },
    })
  );

  const [createMailSynchronizationJob] = useMutation(
    ...getGQLOperationParams({
      topic: "notify",
      operation: "createMailSynchronizationJob",
      onCompleted: onMailSyncJobsComplete({
        operation: "createMailSynchronizationJob",
        setMailSyncJobs: setMailSyncJobs,
        setMailSyncJobLoading: setMailSyncJobLoading,
      }),
      onError: () => {
        setMailSyncJobLoading(false);
      },
    })
  );

  return (
    <Formik
      initialValues={{
        emailSync:
          mailSyncJobs &&
          _.get(mailSyncJobs[account.identity], "status", "") ==
            MailSyncJObStatus.pending,
      }}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <SwitchToggle
              name={"emailSync"}
              value={`${toggle}`}
              disabled={!account?.isActive}
              labelLocation="Left"
              convertToBoolean={true}
              onChange={() => {
                const response = mailSyncJobs?.[account.identity]?.id
                  ? updateMailSynchronizationJob({
                      variables: {
                        id: mailSyncJobs[account.identity].id,
                        input: {
                          status: STATE_MAPPER[`${!values["emailSync"]}`],
                        },
                      },
                    })
                  : createMailSynchronizationJob({
                      variables: {
                        input: {
                          status: STATE_MAPPER[`${!values["emailSync"]}`],
                          mailAccount: account.identity,
                        },
                      },
                    });

                response
                  .then((success) => {
                    setToggle(!toggle);
                    setFieldValue("emailSync", !values["emailSync"]);
                  })
                  .catch((error) => {});
              }}
            />
          </div>
        );
      }}
    </Formik>
  );
};
