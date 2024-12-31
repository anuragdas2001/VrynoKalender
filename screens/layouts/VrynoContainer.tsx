import React, { useContext, useRef } from "react";
import { getInitialsFromEmail } from "../../components/TailwindControls/Extras/getInitialFromEmail";
import router from "next/router";
import { ClickOutsideToClose } from "../../components/TailwindControls/shared/ClickOutsideToClose";
import LogoutIcon from "remixicon-react/LogoutBoxRLineIcon";
import AccountPinBoxLineIcon from "remixicon-react/AccountPinBoxLineIcon";
import { cookieUserStore } from "../../shared/CookieUserStore";
import { Config } from "../../shared/constants";
import Button from "../../components/TailwindControls/Form/Button/Button";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../stores/RootStore/GeneralStore/GeneralStore";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../graphql/queries/fetchQuery";
import { IUserPreference, SupportedApps } from "../../models/shared";
import { AccountModels } from "../../models/Accounts";
import { PageLoader } from "../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { DetailRecordImageControl } from "../modules/crm/shared/components/ReadOnly/DetailRecordImageControl";
import { GET_SELF } from "../../graphql/queries/getSelf";

function InstanceMenuItems({
  dropdownList,
  setDropdownListVisible,
}: {
  dropdownList: {
    onClick?: () => Promise<void>;
    icon: JSX.Element;
    label: string;
    id: string;
    url?: string;
  }[];
  setDropdownListVisible: (value: boolean) => void;
}) {
  return (
    <>
      {dropdownList.map((item, index) => {
        if (item.onClick) {
          return (
            <Button
              id={`instance-menu-items-${item.id}`}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setDropdownListVisible(false);
                if (item.onClick) {
                  item.onClick();
                }
              }}
              customStyle="p-2 w-full cursor-pointer flex flex-row items-center border border-t-0 border-gray-100 hover:bg-vryno-theme-blue-disable text-gray-400 hover:text-white"
              userEventName={`instance-menu-items-${item.id}:action-click`}
              renderChildrenOnly={true}
            >
              <>
                {item.icon}
                <span className="text-sm text-gray-600">{item.label}</span>
              </>
            </Button>
          );
        }
        return (
          <a
            id={item.id}
            key={index}
            // href={item.url}
            href=""
            className={`p-2 w-full cursor-pointer flex flex-row items-center border border-t-0 border-gray-100 hover:bg-vryno-theme-blue-disable text-gray-400 hover:text-white`}
            onClick={(e) => {
              e.preventDefault();
              router.push(item.url || "");
              setDropdownListVisible(false);
            }}
          >
            {item.icon}
            <span className="text-sm text-gray-600">{item.label}</span>
          </a>
        );
      })}
    </>
  );
}

export const VrynoContainer = observer(
  ({
    fetchPreference = false,
    children,
  }: {
    fetchPreference?: boolean;
    children: React.ReactNode;
  }) => {
    const [mounted, setMounted] = React.useState(false);

    const { email } = cookieUserStore.getUserDetails() || {};
    const [dropdownListVisible, setDropdownListVisible] = React.useState(false);
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { importUserPreferences } = generalModelStore;
    const [userPreferenceLoading, setUserPreferenceLoading] =
      React.useState<boolean>(fetchPreference);
    const [recordImage, setRecordImage] = React.useState<string | null>(null);
    const [getSelfLoading, setGetSelfLoading] = React.useState<boolean>(true);

    const dropdownList = [
      {
        label: "Clients",
        id: "profile-menu-clients",
        icon: <AccountPinBoxLineIcon size={16} className="mr-2" />,
        url: Config.accountsRootUrl + Config.accountClientsUrl,
      },
      {
        label: "Logout",
        id: "profile-menu-logout",
        icon: <LogoutIcon size={16} className="mr-2" />,
        url: "/logout",
      },
    ];

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
          importUserPreferences(responseOnCompletion?.fetch?.data);
        }
        setUserPreferenceLoading(false);
      },
    });

    const [getSelf] = useLazyQuery(GET_SELF, {
      fetchPolicy: "no-cache",
    });

    React.useEffect(() => {
      if (fetchPreference) {
        setUserPreferenceLoading(true);
        getUserPreferences({
          variables: {
            modelName: AccountModels.Preference,
            fields: ["id", "serviceName", "defaultPreferences"],
            filters: [{ name: "serviceName", operator: "eq", value: ["crm"] }],
          },
        });
      }
      getSelf().then((response) => {
        if (response?.data?.getSelf?.data) {
          setRecordImage(response?.data?.getSelf?.data?.recordImage ?? null);
        }
        setGetSelfLoading(false);
      });

      setMounted(true);
    }, []);

    const wrapperRef = useRef(null);
    ClickOutsideToClose(wrapperRef, (value: boolean) =>
      setDropdownListVisible(value)
    );
    return mounted ? (
      <>
        <div
          className={`origin-top-right sticky top-0 right-0 z-[2000] w-full shadow-sm h-20 sm:h-21.5 md:h-15 bg-white flex flex-row items-center ${
            router.route.includes("add") || router.route.includes("edit")
              ? "z-[3000]"
              : "z-[2000]"
          }`}
        >
          <div className="w-full flex flex-row items-center justify-between pl-5 pr-4">
            <img src={"/vryno_new_logo.svg"} alt="vryno logo" />
            <div className="flex flex-row">
              <div className="hidden sm:flex sm:flex-col pr-4 justify-center">
                <span className="text-right text-vryno-label-gray text-sm">
                  Welcome
                </span>
              </div>
              <div className="relative inline-block text-left" ref={wrapperRef}>
                <a
                  id="profile-menu"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownListVisible(!dropdownListVisible);
                  }}
                  className="flex flex-row cursor-pointer justify-center items-center rounded-full bg-vryno-theme-blue-secondary w-12 h-12 md:w-10 md:h-10 lg:w-12 lg:h-12"
                >
                  {getSelfLoading ? (
                    <></>
                  ) : recordImage ? (
                    <DetailRecordImageControl
                      onDetail={false}
                      data={{ recordImage: recordImage }}
                      field={{
                        label: "Profile Picture",
                        value: "recordImage",
                        dataType: "recordImage",
                        field: undefined,
                      }}
                      isSample={false}
                      modelName={"user"}
                      imageSize={"w-12 h-12"}
                      imageServiceName={SupportedApps.accounts}
                    />
                  ) : (
                    <span className="text-white text-md">
                      {email && getInitialsFromEmail(email).toUpperCase()}
                    </span>
                  )}
                </a>
                {dropdownListVisible && (
                  <div
                    className="origin-top-right absolute right-0 mt-1 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    id="navbarMenu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <InstanceMenuItems
                      dropdownList={dropdownList}
                      setDropdownListVisible={(value: boolean) =>
                        setDropdownListVisible(value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full">
          {userPreferenceLoading ? (
            <div className="w-full h-screen flex items-center justify-center">
              <PageLoader />
            </div>
          ) : (
            children
          )}
        </div>
      </>
    ) : null;
  }
);
