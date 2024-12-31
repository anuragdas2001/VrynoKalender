import React, { useContext, useEffect } from "react";
import { ProfileMenu } from "./ProfileMenu";
import { BaseUser, IInstance, IUser } from "../../../models/Accounts";
import { IRole, SupportedApps } from "../../../models/shared";
import { UserStoreContext } from "../../../stores/UserStore";
import { cookieUserStore } from "../../../shared/CookieUserStore";
import { checkRoleAdmin } from "../../../shared/checkRoleAdmin";
import { observer } from "mobx-react-lite";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../graphql/queries/fetchQuery";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { ClickOutsideToClose } from "../../../components/TailwindControls/shared/ClickOutsideToClose";
import _ from "lodash";
import { DetailRecordImageControl } from "../../modules/crm/shared/components/ReadOnly/DetailRecordImageControl";

export const InitialAndProfileMenu = observer(
  ({
    navbarColor,
    navbarTextColor,
    currentInstance,
    instances = [],
    handleUserAvailable,
    appName,
  }: {
    navbarColor?: string;
    navbarTextColor: string;
    currentInstance: IInstance | null;
    instances?: IInstance[];
    handleUserAvailable: (isAvailable: boolean) => void;
    appName: SupportedApps;
  }) => {
    const cookieUser = cookieUserStore.getUserDetails();
    const userContext = useContext(UserStoreContext);
    const { user, setUser } = userContext;
    const [dropDownListVisible, setDropDownListVisible] = React.useState(false);
    const [cookieUserState, setCookieUserState] =
      React.useState<BaseUser | null>(null);

    React.useEffect(() => {
      setCookieUserState(cookieUser);
    }, []);

    const [getUser] = useLazyQuery<FetchData<IUser>, FetchVars>(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "accounts",
        },
      },
    });
    const [getRoles] = useLazyQuery<FetchData<IRole>, FetchVars>(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "accounts",
        },
      },
    });

    const postUserRoleFetch = (
      user: IUser,
      isInstanceAdmin: boolean = false,
      roleKeys: string[] = []
    ) => {
      if (!cookieUserState) {
        return;
      }
      setUser({
        userId: cookieUserState.userId,
        email: cookieUserState.email,
        issuedAt: cookieUserState.issuedAt,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        phoneNumber: user.phoneNumber,
        roleIds: user.roleId,
        roleKeys: roleKeys,
        isActive: user.isActive,
        isInstanceAdmin,
        id: cookieUserState.userId,
        timeFormat: user.timeFormat,
        timezone: user.timezone,
        dateFormat: user.dateFormat,
        recordImage: user.recordImage,
        signature: user.signature,
      });
    };

    const getUserDetailsAndRoles = async () => {
      if (!cookieUserState) {
        return;
      }
      try {
        const { data: userDetails } = await getUser({
          variables: {
            modelName: "User",
            fields: [
              "id",
              "firstName",
              "lastName",
              "middleName",
              "roleId",
              "isActive",
              "phoneNumber",
              "mobileNumber",
              "timezone",
              "timeFormat",
              "dateFormat",
              "recordImage",
              "signature",
            ],
            filters: [
              {
                name: "id",
                operator: "eq",
                value: cookieUserState?.userId ?? "",
              },
            ],
          },
        });

        if (!userDetails?.fetch?.data) {
          handleUserAvailable(false);
          throw Error("User not found");
        }
        const users = userDetails.fetch.data;
        if (users.length < 0 || users.length > 1) {
          throw Error("More than one user found for the user id");
        }
        const user = users[0];
        const userRoleIds = user.roleId;
        if (userRoleIds.length === 0) {
          postUserRoleFetch(user);
        }

        const { data: roleDetails } = await getRoles({
          variables: {
            modelName: "Role",
            fields: ["role", "key", "createdBy", "createdAt"],
            filters: [{ operator: "in", name: "id", value: user.roleId }], //remove this filter to add every single role onto user (included unrelated ones too!)
          },
        });

        if (!roleDetails?.fetch?.data)
          throw Error("Error while getting roleDetails");

        const roles = roleDetails?.fetch?.data;
        postUserRoleFetch(
          user,
          checkRoleAdmin(userRoleIds, roles),
          roles.map((r) => r.key)
        );
        handleUserAvailable(true);
      } catch (error) {
        toast.error(`${error}`);
      }
    };

    useEffect(() => {
      if (cookieUserState && !user) {
        getUserDetailsAndRoles().then();
      }
    }, [cookieUserState]);

    const wrapperRef = React.useRef(null);
    ClickOutsideToClose(wrapperRef, (value: boolean) =>
      setDropDownListVisible(value)
    );

    return (
      <div className="relative inline-block text-left" ref={wrapperRef}>
        <Button
          id="profile-menu"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDropDownListVisible(!dropDownListVisible);
          }}
          customStyle="flex flex-row cursor-pointer justify-center items-center rounded-full bg-vryno-theme-blue-secondary w-12 h-12 md:w-10 md:h-10 lg:w-12 lg:h-12"
          renderChildrenOnly={true}
          userEventName="profile-menu:action-click"
        >
          <span className="text-white text-md">
            {user?.recordImage ? (
              <DetailRecordImageControl
                onDetail={false}
                data={{ recordImage: user?.recordImage }}
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
                // customOpacity={customOpacity}
              />
            ) : (
              userContext.userInitials
            )}
          </span>
          {/* userContext.userInitials */}
        </Button>
        <ProfileMenu
          navbarColor={navbarColor}
          navbarTextColor={navbarTextColor}
          dropDownListVisible={dropDownListVisible}
          setDropDownListVisible={setDropDownListVisible}
          appName={appName}
          hideItemsFromDropdownMenu={
            instances?.length <= 1 &&
            _.get(currentInstance, "created_by", "") !== user?.id
              ? ["instances"]
              : []
          }
        />
      </div>
    );
  }
);
