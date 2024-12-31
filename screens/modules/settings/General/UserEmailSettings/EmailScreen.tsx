import React from "react";
import {
  LinkedAccount,
  PLATFORM_SERVICE_MAP,
  Platform,
  PrimaryNavItem,
  SUPPORTED_PROVIDERS,
  UserEmailSettingsNavItem,
} from "./shared/UserEmailSettingsConstants";
import EmailConfig from "./EmailConfig";
import { UserEmailSettingsContext } from "./shared/UserEmailSettingsContext";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { SupportedDashboardViews } from "../../../../../models/shared";
import EmailProviderContainer from "./EmailProviderComponent";
import { useLazyQuery, useMutation } from "@apollo/client";
import { getGQLOperationParams } from "../../../../../graphql/helpers/operationSchemaMapper";
import {
  onAuthProviderDataComplete,
  onDeleteMailSyncJob,
  onLinkAccountComplete,
} from "./shared/emailSettingHelpers";
import { DELETE_LINKED_ACCOUNT } from "../../../../../graphql/mutations/deleteLinkedAccount";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { useTranslation } from "react-i18next";

export type EmailScreenProps = {};

export interface GenericDataFetchState<dataType> {
  type: "Array" | "Object";
  count: number;
  pageNumber: number;
  loading: boolean;
  data: dataType[];
  failed: boolean;
  permission: boolean;
}

const PRIMARY_NAV_ITEMS: UserEmailSettingsNavItem[] = [
  {
    id: "id1",
    userEvent: "event1",
    buttonType: "normal",
    key: PrimaryNavItem.emailConfiguration,
    label: "Email Configuration",
  },
];

export const EmailScreen = ({}: EmailScreenProps) => {
  const [accountsData, setAccountsData] =
    React.useState<GenericDataFetchState<LinkedAccount>>();
  const { t } = useTranslation(["common"]);
  const [accountsLoader, setAccountsLoader] = React.useState<boolean>(true);
  const [platformLoader, setPlatformLoader] = React.useState<boolean>(true);

  const [selectedPrimaryNav, setSelectedPrimaryNav] =
    React.useState<PrimaryNavItem>(PrimaryNavItem.emailConfiguration);
  const [platforms, setPlatforms] = React.useState<Platform[]>([
    PLATFORM_SERVICE_MAP["google"],
    PLATFORM_SERVICE_MAP["microsoft"],
  ]);
  const [linkedAccounts, setLinkedAccounts] = React.useState<LinkedAccount[]>(
    []
  );

  const [getAuthProviderData] = useLazyQuery(
    ...getGQLOperationParams({
      topic: "accounts",
      operation: "getAuthProviderData",
      onCompleted: onAuthProviderDataComplete({
        operation: "getAuthProviderData",
        platforms: platforms,
        setPlatforms: setPlatforms,
        setPlatformLoader: setPlatformLoader,
      }),
      onError: () => {
        setPlatforms([]);
        setPlatformLoader(false);
      },
    })
  );

  const [fetchLinkedAccount] = useLazyQuery(
    ...getGQLOperationParams({
      topic: "accounts",
      operation: "fetchLinkedAccount",
      onCompleted: onLinkAccountComplete({
        operation: "fetchLinkedAccount",
        setLinkedAccounts: setLinkedAccounts,
        setAccountsLoader: setAccountsLoader,
      }),
      onError: () => {
        setLinkedAccounts([]);
        setAccountsLoader(false);
      },
    })
  );

  const [deleteMailSynchronizationJob] = useMutation(
    ...getGQLOperationParams({
      topic: "notify",
      operation: "deleteMailSynchronizationJob",
      onCompleted: onDeleteMailSyncJob({
        operation: "deleteMailSynchronizationJob",
      }),
      onError: () => {},
    })
  );

  const [updateLinkedAccount] = useMutation(DELETE_LINKED_ACCOUNT, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion?.deleteLinkedAccount?.messageKey?.includes(
          "-success"
        )
      ) {
        setLinkedAccounts([
          ...linkedAccounts?.filter(
            (account) =>
              account?.id !==
              responseOnCompletion?.deleteLinkedAccount?.data?.id
          ),
        ]);
        setAccountsLoader(false);
        Toast.success("Account removed successfully");
        return;
      } else {
        setAccountsLoader(false);
        Toast.success(responseOnCompletion?.deleteLinkedAccount?.message);
        return;
      }
    },
    onError: (error) => {
      setLinkedAccounts([]);
      setAccountsLoader(false);
      Toast.error(t("common:unknown-message"));
    },
  });

  React.useEffect(() => {
    fetchLinkedAccount({
      variables: {
        filters: [
          { name: "platform", operator: "in", value: SUPPORTED_PROVIDERS },
        ],
      },
    });
  }, []);

  React.useEffect(() => {
    getAuthProviderData({
      variables: {
        platforms: SUPPORTED_PROVIDERS,
        redirectUri: window.location.href,
      },
    });
  }, [linkedAccounts]);

  const PRIMARY_NAV_COMPONENT_MAP: Record<PrimaryNavItem, JSX.Element> = {
    [PrimaryNavItem.emailConfiguration]: (
      <EmailConfig
        handleRemoveAccount={(account) =>
          updateLinkedAccount({
            variables: {
              id: account.id,
            },
          })
        }
        handleRemoveSynchronzation={(id) =>
          deleteMailSynchronizationJob({
            variables: {
              id: id,
            },
          })
        }
      />
    ),
  };

  return (
    <UserEmailSettingsContext.Provider
      value={{
        accounts: { records: linkedAccounts, loading: accountsLoader },
        platforms: { records: platforms, loading: platformLoader },
      }}
    >
      {accountsLoader || platformLoader ? (
        <ItemsLoader
          currentView={SupportedDashboardViews.Card}
          loadingItemCount={2}
        />
      ) : linkedAccounts?.length > 0 ? (
        PRIMARY_NAV_COMPONENT_MAP[selectedPrimaryNav]
      ) : (
        <EmailProviderContainer />
      )}
    </UserEmailSettingsContext.Provider>
  );
};
