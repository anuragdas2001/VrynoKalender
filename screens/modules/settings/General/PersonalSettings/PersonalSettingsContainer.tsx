import { LazyQueryExecFunction, useMutation } from "@apollo/client";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { PersonalSettingsForm } from "./PersonalSettingsForm";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { AccountModels, BaseUser, IUser } from "../../../../../models/Accounts";
import { UserStoreContext } from "../../../../../stores/UserStore";
import React from "react";
import { getSettingsPathParts } from "../../../crm/shared/utils/getSettingsPathParts";
import { useTranslation } from "react-i18next";
import {
  IInstanceUser,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { FormikValues } from "formik";
import {
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";

export const PersonalSettingsContainer = ({
  loader,
  getUserPreferences,
  userPreferences,
  cookieUserState,
  internalContact,
  valuesAvailable,
  navbarColor,
  userInitials,
}: {
  loader: boolean;
  getUserPreferences: LazyQueryExecFunction<
    FetchData<IUserPreference>,
    FetchVars
  >;
  userPreferences: IUserPreference[];
  cookieUserState: BaseUser | null;
  internalContact: Partial<IUser>;
  valuesAvailable: boolean;
  navbarColor: string;
  userInitials: string;
}) => {
  const { t } = useTranslation(["register", "common"]);
  const { menuItem } = getSettingsPathParts();
  const currentTab = menuItem as string;
  let headerLabel = "";
  if (currentTab) {
    headerLabel = currentTab.split("-").join(" ");
  }

  const userContext = React.useContext(UserStoreContext);
  const { user, updateUserInfo } = userContext;
  const [savingUserInfoProcess, setSavingUserInfoProcess] =
    React.useState<boolean>(false);

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
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("success")
      ) {
        updateUserInfo({
          email: data.save.data.email,
          firstName: data.save.data.firstName,
          lastName: data.save.data.lastName,
          middleName: data.save.data.middleName,
          phoneNumber: data.save.data.phoneNumber,
          mobileNumber: data.save.data.mobileNumber,
          timeFormat: data.save.data.timeFormat,
          dateFormat: data.save.data.dateFormat,
          userId: cookieUserState?.userId,
          issuedAt: cookieUserState?.issuedAt,
          id: cookieUserState?.userId,
          timezone: data.save.data.timezone,
          country: data.save.data.country,
          recordImage: data.save.data.recordImage,
          signature: data.save.data.signature,
        });
        setSavingUserInfoProcess(false);
        toast.success(data.save.message);
        return;
      }
      if (data.save.messageKey) {
        toast.error(data.save.messageKey);
        setSavingUserInfoProcess(false);
        return;
      }
      setSavingUserInfoProcess(false);
      toast.error(t("common:unknown-message"));
    },
  });

  const [saveUserPreference] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        getUserPreferences({
          variables: {
            modelName: AccountModels.Preference,
            fields: ["id", "serviceName", "defaultPreferences"],
            filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
          },
        });
        return;
      }
    },
  });
  const handlePreferencesChange = (
    navbarColor: string,
    localInformation: Record<string, string>
  ) => {
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    saveUserPreference({
      variables: {
        id: updatedUserPreferences ? updatedUserPreferences.id : null,
        modelName: AccountModels.Preference,
        saveInput: {
          defaultPreferences: {
            ...defaultPreferences,
            navbarColor,
            localInformation,
          },
          serviceName: SupportedApps.crm,
        },
      },
    });
  };

  const handleUserCreation = async (values: FormikValues) => {
    setSavingUserInfoProcess(true);
    const dateFormatted = values.dateOfBirth
      ? format(new Date(values.dateOfBirth), "yyyy-MM-dd")
      : null;
    try {
      handlePreferencesChange(values["navbarcolor"], {
        language: values.language,
        country: values.country,
        dateFormat: values.dateFormat,
        timeFormat: values.timeFormat,
        timezone: values.timezone,
      });
      await createUser({
        variables: {
          id: internalContact.id,
          modelName: "User",
          saveInput: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            mobileNumber: values.mobileNumber,
            phoneNumber: values.phoneNumber
              ? `${values.phoneNumber}`
              : values.phoneNumber,
            dateOfBirth: dateFormatted,
            street: values.street,
            city: values.city,
            state: values.state,
            zipcode: values.zipcode,
            language: values.language,
            country: values.country,
            dateFormat: values.dateFormat,
            timeFormat: values.timeFormat,
            timezone: values.timezone,
            recordImage: values.recordImage,
            signature: values.signature,
          },
        },
      });
    } catch (error) {
      setSavingUserInfoProcess(false);
    }
  };
  return loader ? (
    <>
      <GenericBackHeader heading="Personal Settings" />
      <div className="px-6">
        <ItemsLoader currentView="List" loadingItemCount={2} />
      </div>
    </>
  ) : (
    <PersonalSettingsForm
      valuesAvailable={valuesAvailable}
      internalContact={{
        ...internalContact,
        navbarcolor: navbarColor ?? "#FFFFFF",
      }}
      handleUserCreation={handleUserCreation}
      headerLabel={headerLabel}
      savingUserInfoProcess={savingUserInfoProcess}
      userInitials={userInitials}
      user={user}
      loader={loader}
      userPreferences={userPreferences}
    />
  );
};
