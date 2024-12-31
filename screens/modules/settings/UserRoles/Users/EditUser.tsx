import React, { ChangeEvent } from "react";
import router from "next/router";
import { FormikValues } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { IUser } from "../../../../../models/Accounts";
import { useLazyQuery, useMutation } from "@apollo/client";
import { EditUserFormContainer } from "./EditUserFormContainer";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { useAccountsFetchQuery } from "../../../crm/shared/utils/operations";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { PROFILE_DATA_QUERY } from "../../../../../graphql/queries/dataSharingQueries";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import {
  IInstanceUser,
  IRole,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { get } from "lodash";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { getTimezone } from "countries-and-timezones";

export const EditUser = ({
  id,
  editMode,
}: {
  id: string;
  editMode: boolean;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const userContext = React.useContext(UserStoreContext);
  const { user, userId } = userContext;
  const [roles, setRoles] = React.useState<IRole[]>([]);
  const [userData, setUserData] = React.useState<IUser[]>([]);
  const [roleIds, setRoleIds] = React.useState<string[]>([]);
  const [instanceOwnerData, setInstanceOwnerData] = React.useState<IRole>();
  const [editModeValue, setEditModeValue] = React.useState(editMode);
  const [userDataLoading, setUserDataLoading] = React.useState(true);
  const [userUpdateLoader, setUserUpdateLoader] = React.useState(false);
  const [localInformation, setLocalInformation] =
    React.useState<Record<string, string>>();

  useAccountsFetchQuery<IRole>({
    variables: {
      modelName: "Role",
      fields: ["id", "role", "key"],
      filters: [],
    },
    onDataRecd: (data) => {
      const filteredData = data.filter((val) => {
        if (val.key === "instance-owner") {
          setInstanceOwnerData(val);
        } else {
          return val;
        }
      });
      setRoles(filteredData);
    },
  });

  const [profileIdOptions, setProfileIdOptions] = React.useState<
    { value: string | null; label: string }[]
  >([]);
  const [profileDataLoading, setProfileDataLoading] =
    React.useState<boolean>(true);

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
            get(
              responseOnCompletion?.fetch?.data[0]?.defaultPreferences,
              "localInformation",
              {}
            )
          );
      }
    },
  });

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

  useAccountsFetchQuery<IUser>({
    variables: {
      modelName: "User",
      fields: [
        "id",
        "firstName",
        "middleName",
        "lastName",
        "email",
        "roleId",
        "isActive",
        "country",
        "city",
        "zipcode",
        "address",
        "profileId",
        "timezone",
        "signature",
      ],
      filters: [{ name: "id", operator: "eq", value: id }],
    },
    onDataRecd: (data) => {
      setRoleIds(data[0].roleId);
      setUserData(data);
    },
  });

  React.useEffect(() => {
    if (userDataLoading && roles?.length && userData?.length)
      setUserDataLoading(false);
  }, [roles, userData]);

  React.useEffect(() => {
    if (user && userData && user?.id === userData?.[0]?.id) {
      setEditModeValue(false);
    }
  }, [userDataLoading, user?.id, userId]);

  const [updateUser] = useMutation<
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
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey === "user-updation-success"
      ) {
        toast.success(data.save.message);
        router.push("/settings/crm/users");
        return;
      }
      if (data.save.messageKey) {
        toast.error(data.save.messageKey);
        setUserUpdateLoader(false);
        return;
      }
      toast.error(t("common:unknown-message"));
      setUserUpdateLoader(false);
    },
  });

  const handleUserUpdation = async (values: FormikValues) => {
    const timezone = getTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    setUserUpdateLoader(true);
    let roleIdArray = [];
    if (instanceOwnerData) {
      roleIdArray = roleIds.filter((val) => val !== instanceOwnerData.id);
    } else {
      roleIdArray = roleIds;
    }
    if (roleIdArray.length === 0) {
      toast.error("Please assign a role to the user");
      setUserUpdateLoader(false);
      return;
    }
    try {
      await updateUser({
        variables: {
          id: id,
          modelName: "User",
          saveInput: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            roleIds: roleIds,
            middleName: values.middleName,
            country: values.country
              ? values.country
              : get(localInformation, "country", null)
              ? get(localInformation, "country", null)
              : timezone && timezone?.countries?.length > 0
              ? timezone?.countries[0]
              : "",
            city: values.city,
            zipcode: values.zipcode,
            address: values.address,
            signature: values.signature,
            profileId: values.profileId === "null" ? null : values.profileId,
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

  return userDataLoading || profileDataLoading ? (
    <>
      <GenericBackHeader heading="Edit User" />
      <div className="px-6">
        <ItemsLoader currentView="List" loadingItemCount={4} />
      </div>
    </>
  ) : (
    <EditUserFormContainer
      t={t}
      userData={userData}
      handleUserUpdation={handleUserUpdation}
      userUpdateLoader={userUpdateLoader}
      roles={roles}
      roleIds={roleIds}
      handleCheckboxSelect={onCheckboxSelect}
      editModeValue={editModeValue}
      editMode={editMode}
      profileIdOptions={profileIdOptions}
    />
  );
};
