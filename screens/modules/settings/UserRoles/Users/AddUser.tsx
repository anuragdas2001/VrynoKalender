import _ from "lodash";
import React, { ChangeEvent } from "react";
import router from "next/router";
import { toast } from "react-toastify";
import { FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import { getTimezone } from "countries-and-timezones";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AccountModels, IUser } from "../../../../../models/Accounts";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { useAccountsFetchQuery } from "../../../crm/shared/utils/operations";
import { PROFILE_DATA_QUERY } from "../../../../../graphql/queries/dataSharingQueries";
import {
  IInstanceUser,
  IRole,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { AddUserFormContainer } from "./AddUserFormContainer";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";

export const AddUser = ({ editMode }: { editMode: boolean }) => {
  const { t } = useTranslation(["settings", "common"]);
  const userId = cookieUserStore.getUserId() || "";
  const [roles, setRoles] = React.useState<IRole[]>([]);
  const [userSaveProcessing, setUserSaveUserProcessing] =
    React.useState<boolean>(false);
  const [localInformation, setLocalInformation] =
    React.useState<Record<string, string>>();
  const [userInformation, setUserInformation] = React.useState<IUser | null>(
    null
  );
  const [roleIds, setRoleIds] = React.useState<string[]>([]);
  const [profileIdOptions, setProfileIdOptions] = React.useState<
    { value: string | null; label: string }[]
  >([]);
  const [profileDataLoading, setProfileDataLoading] =
    React.useState<boolean>(true);

  const [getProfileData] = useLazyQuery(PROFILE_DATA_QUERY, {
    nextFetchPolicy: "no-cache",
    fetchPolicy: "cache-first",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  React.useEffect(() => {
    getProfileData({
      variables: {
        filters: [],
      },
    }).then((response) => {
      if (response?.data?.fetchProfile?.messageKey?.includes("-success")) {
        const addProfileParentOptions: { value: string; label: string }[] = [];
        for (const data of response?.data?.fetchProfile?.data) {
          addProfileParentOptions.push({ value: data.id, label: data.name });
        }
        setProfileIdOptions([
          { label: "--no profile--", value: "null" },
          ...addProfileParentOptions,
        ]);
      } else if (response?.data?.fetchProfile?.message) {
        toast.error(response?.data?.fetchProfile?.message);
      } else {
        toast.error(t("common:unknown-message"));
      }
      setProfileDataLoading(false);
    });
  }, []);

  const [getUserPreferences] = useLazyQuery<
    FetchData<IUserPreference>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
        if (
          responseOnCompletion?.fetch?.data?.length > 0 &&
          responseOnCompletion?.fetch?.data[0]?.defaultPreferences
        )
          setLocalInformation(
            _.get(
              responseOnCompletion?.fetch?.data[0]?.defaultPreferences,
              "localInformation",
              {}
            )
          );
      }
    },
  });

  React.useEffect(() => {
    getUserPreferences({
      variables: {
        modelName: AccountModels.Preference,
        fields: ["id", "serviceName", "defaultPreferences"],
        filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
      },
    });
  }, []);

  useAccountsFetchQuery<IRole>({
    variables: {
      modelName: "Role",
      fields: ["id", "role", "key"],
      filters: [],
    },
    onDataRecd: (data) => {
      const filteredData = data.filter((val) => val.key !== "instance-owner");
      setRoles(filteredData);
    },
  });

  useAccountsFetchQuery<IUser>({
    variables: {
      modelName: "User",
      fields: ["id", "country", "timezone"],
      filters: [{ name: "id", operator: "eq", value: [userId] }],
    },
    onDataRecd: (data) => {
      setUserInformation(data[0]);
    },
  });

  const internalContact: Partial<IUser> = {
    ...{
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      roleIds: "",
    },
  };

  const [createUser] = useMutation<
    SaveData<IInstanceUser>,
    SaveVars<IInstanceUser>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
    onCompleted: async (data) => {
      if (data.save.data && data.save.messageKey.includes("-success")) {
        toast.success(data.save.message);
        router.push("/settings/crm/users");
        setUserSaveUserProcessing(false);
        return;
      }
      setUserSaveUserProcessing(false);
      if (data.save.messageKey) {
        Toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleUserCreation = async (values: FormikValues) => {
    const timezone = getTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    if (roleIds.length === 0) {
      toast.error("Please assign a role to the user");
      return;
    }
    try {
      setUserSaveUserProcessing(true);
      await createUser({
        variables: {
          id: null,
          modelName: "User",
          saveInput: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            roleIds: roleIds,
            middleName: values.middleName,
            country: values.country
              ? values.country
              : _.get(localInformation, "country", null)
              ? _.get(localInformation, "country", null)
              : userInformation?.country
              ? userInformation?.country
              : timezone && timezone?.countries?.length > 0
              ? timezone?.countries[0]
              : "GB",
            city: values.city,
            zipcode: values.zipcode,
            address: values.address,
            signature: values.signature,
            timezone: _.get(localInformation, "timezone", null)
              ? _.get(localInformation, "timezone", null)
              : userInformation?.timezone
              ? userInformation?.timezone
              : timezone?.aliasOf
              ? timezone?.aliasOf
              : timezone?.name,
            profileId:
              values.profileId === "null" || !values.profileId
                ? null
                : values.profileId,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onCheckboxSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (roleIds.length === 0) {
      setRoleIds([value]);
      return;
    }
    if (roleIds.includes(value)) {
      setRoleIds(roleIds.filter((val) => val !== value));
    } else {
      setRoleIds(roleIds.concat(value));
    }
  };

  return (
    <AddUserFormContainer
      internalContact={internalContact}
      handleUserCreation={handleUserCreation}
      userSaveProcessing={userSaveProcessing}
      roles={roles}
      roleIds={roleIds}
      onCheckboxSelect={onCheckboxSelect}
      editMode={editMode}
      profileIdOptions={profileIdOptions}
      profileDataLoading={profileDataLoading}
    />
  );
};
