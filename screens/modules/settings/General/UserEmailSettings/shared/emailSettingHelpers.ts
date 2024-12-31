/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { MailSyncJob } from "./UserEmailSettingsConstants";
import { LinkedAccount } from "./UserEmailSettingsConstants";
import { Platform } from "./UserEmailSettingsConstants";

export const onMailSyncJobsComplete = ({
  operation,
  setMailSyncJobs = () => {},
  setMailSyncJobLoading = () => {},
}: {
  operation: string;
  setMailSyncJobs?: (_: Record<string, MailSyncJob>) => void;
  setMailSyncJobLoading?: (_: boolean) => void;
}) => {
  return (response: any) => {
    if (response?.[operation]?.data) {
      const data = Array.isArray(response[operation].data)
        ? response[operation].data
        : [response[operation].data];
      setMailSyncJobs(
        data.reduce((res: {}, item: MailSyncJob) => {
          if (item.recordStatus === "a") {
            return { ...res, [item.mailAccount]: item };
          }
        }, {})
      );
      if (response?.[operation]?.messageKey.includes("updation-success")) {
        Toast.success("Mail sync updated successfully");
      }
      if (response?.[operation]?.messageKey.includes("creation-success")) {
        Toast.success("Mail sync created successfully");
      }
    }
    setMailSyncJobLoading(false);
  };
};

export const onAuthProviderDataComplete = ({
  operation,
  platforms,
  setPlatforms,
  setPlatformLoader,
}: {
  operation: string;
  platforms: Platform[];
  setPlatforms: (_: Platform[]) => void;
  setPlatformLoader: (_: boolean) => void;
}) => {
  return (response: any) => {
    if (response?.[operation]?.data) {
      const data = Array.isArray(response[operation].data)
        ? response[operation].data
        : [response[operation].data];

      const updatedPlatformData = platforms.map((platform: Platform) => {
        const matched = data.find(
          (item: Platform) => item.platform == platform.platform
        );
        return {
          ...platform,
          ...(matched ? matched : {}),
        };
      });
      setPlatforms(updatedPlatformData);
      setPlatformLoader(false);
    }
  };
};

export const onLinkAccountComplete = ({
  operation,
  setLinkedAccounts,
  setAccountsLoader,
}: {
  operation: string;
  setLinkedAccounts: (_: LinkedAccount[]) => void;
  setAccountsLoader: (_: boolean) => void;
}) => {
  return (response: any) => {
    if (response?.[operation]?.data) {
      const data = Array.isArray(response[operation].data)
        ? response[operation].data
        : [response[operation].data];
      setLinkedAccounts(data);
    }
    setAccountsLoader(false);
  };
};

export const onLinkedAccountRemoval = ({
  operation,
  linkedAccounts,
  setLinkedAccounts,
  setAccountsLoader,
}: {
  operation: string;
  linkedAccounts: LinkedAccount[];
  setLinkedAccounts: (_: LinkedAccount[]) => void;
  setAccountsLoader: (_: boolean) => void;
}) => {
  return (response: any) => {
    if (
      response?.[operation]?.data &&
      response?.[operation]?.messageKey.includes("success")
    ) {
      setLinkedAccounts(
        [...linkedAccounts]?.filter(
          (account) => account.id !== response?.[operation]?.data[0]?.id
        )
      );
    }
    setAccountsLoader(false);
  };
};

export const onDeleteMailSyncJob = ({ operation }: { operation: string }) => {
  return (response: any) => {
    if (
      response?.[operation]?.data &&
      response?.[operation]?.messageKey.includes("success")
    ) {
      Toast.success("Mail sync job removed successfully.");
    }
  };
};
