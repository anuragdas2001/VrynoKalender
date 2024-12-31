import React, { useContext } from "react";
import { useAccountsFetchQuery } from "../../../crm/shared/utils/operations";
import { useLazyQuery } from "@apollo/client";
import { getInitialsFromName } from "../../../../../components/TailwindControls/Extras/getInitialFromName";
import { AccountModels, BaseUser, IUser } from "../../../../../models/Accounts";
import { IUserPreference } from "../../../../../models/shared";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { PersonalSettingsContainer } from "./PersonalSettingsContainer";
import { observer } from "mobx-react-lite";

export const ConnectedPersonalSettings = observer(() => {
  const userId = cookieUserStore.getUserId() || "";
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { userPreferences, importUserPreferences } = generalModelStore;
  const { navbarColor, setNavbarColor } = useContext(NavigationStoreContext);
  const cookieUser = cookieUserStore.getUserDetails();
  const [cookieUserState, setCookieUserState] = React.useState<BaseUser | null>(
    null
  );
  const [userInformation, setUserInformation] = React.useState<IUser | null>(
    null
  );
  const [valuesAvailable, setValuesAvailable] = React.useState(false);
  const [loader, setLoader] = React.useState(true);
  const [userInitials, setUserInitials] = React.useState("");

  const internalContact: Partial<IUser> = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    phoneNumber: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    language: "",
    country: "",
    dateFormat: "",
    timeFormat: "",
    signature: null,
    ...(typeof userInformation === "object" ? userInformation : {}),
    timezone: userInformation?.timezone ? userInformation.timezone : "GMT",
  };

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
          responseOnCompletion.fetch.data &&
          responseOnCompletion.fetch.data.length > 0
        ) {
          let userPreferences = responseOnCompletion.fetch.data[0];
          if (userPreferences) {
            setNavbarColor(userPreferences?.defaultPreferences?.navbarColor);
          }
        }
        importUserPreferences(responseOnCompletion.fetch.data);
      }
    },
  });

  useAccountsFetchQuery<IUser>({
    variables: {
      modelName: "User",
      fields: [
        "id",
        "firstName",
        "lastName",
        "email",
        "mobileNumber",
        "phoneNumber",
        "dateOfBirth",
        "street",
        "city",
        "state",
        "zipcode",
        "language",
        "country",
        "dateFormat",
        "timeFormat",
        "timezone",
        "recordImage",
        "signature",
      ],
      filters: [{ name: "id", operator: "eq", value: [userId] }],
    },
    onDataRecd: (data) => {
      setLoader(false);
      setUserInformation(data[0]);
      setValuesAvailable(true);
    },
  });

  React.useEffect(() => {
    setCookieUserState(cookieUser);
    getUserPreferences({
      variables: {
        modelName: AccountModels.Preference,
        fields: ["id", "serviceName", "defaultPreferences"],
        filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
      },
    });
  }, []);

  React.useEffect(() => {
    const initials = () => {
      const userName =
        internalContact.firstName + " " + internalContact.lastName;
      setUserInitials(getInitialsFromName(userName));
    };
    initials();
  }, [internalContact.firstName, internalContact.lastName]);

  return (
    <PersonalSettingsContainer
      loader={loader}
      getUserPreferences={getUserPreferences}
      userPreferences={userPreferences}
      cookieUserState={cookieUserState}
      internalContact={internalContact}
      valuesAvailable={valuesAvailable}
      navbarColor={navbarColor}
      userInitials={userInitials}
    />
  );
});
