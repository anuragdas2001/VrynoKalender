import React from "react";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { IUser } from "../../../../../models/Accounts";
import { IRole } from "../../../../../models/shared";
import { getSettingsPathParts } from "../../../crm/shared/utils/getSettingsPathParts";
import { UsersListContainer } from "./UsersListContainer";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";

const userListFields = [
  "id",
  "firstName",
  "middleName",
  "lastName",
  "email",
  "roleId",
  "isActive",
  "isInstanceAdmin",
  "mfaEnabled",
  "signature",
];

export const ConnectedUserList = () => {
  const { menuItem } = getSettingsPathParts();
  const [userList, setUserList] = React.useState<IUser[]>([]);
  const [rolesList, setRolesList] = React.useState<IRole[]>([]);
  const heightRef = React.useRef<HTMLDivElement>(null);

  const [itemsCount, setItemsCount] = React.useState(0);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(0);

  const [user, setUser] = React.useState();
  React.useEffect(() => {
    setUser(JSON.parse(window.localStorage.getItem("user") || "{}"));
  }, []);

  const [loading, setLoading] = React.useState(true);

  const [getUsersListData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
  });

  const [getRolesListData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setRolesList(responseOnCompletion?.fetch?.data);
      }
    },
  });

  React.useEffect(() => {
    (async () => {
      await getUsersListData({
        variables: {
          modelName: "User",
          fields: userListFields,
          filters: [{ name: "recordStatus", operator: "in", value: ["a"] }],
          pageNumber: 1,
        },
      }).then((response) => {
        if (response?.data?.fetch?.data) {
          setUserList(response?.data?.fetch?.data);
          setItemsCount(response?.data?.fetch?.count);
          setCurrentPageNumber(1);
        }
      });
      await getRolesListData({
        variables: {
          modelName: "Role",
          fields: ["role", "key", "createdBy", "createdAt"],
          filters: [],
        },
      });

      setLoading(false);
    })();
    //use pagination to fetch all users
  }, [user]);

  const handlePageChange = (pageNumber: number) => {
    getUsersListData({
      variables: {
        modelName: "User",
        fields: userListFields,
        filters: [{ name: "recordStatus", operator: "in", value: ["a"] }],
        pageNumber: pageNumber,
      },
    }).then((response) => {
      if (response?.data?.fetch?.messageKey.includes("success")) {
        setUserList(response?.data?.fetch?.data);
        setItemsCount(response?.data?.fetch?.count);
        setCurrentPageNumber(pageNumber);
      }
    });
  };

  if (loading || !user || !rolesList?.length) {
    return (
      <>
        <GenericBackHeader heading="Users" />
        <div className="px-6 py-0">
          <ItemsLoader currentView={"List"} loadingItemCount={2} />
        </div>
      </>
    );
  } else {
    return (
      <UsersListContainer
        currentUser={user}
        menuItem={menuItem}
        heightRef={heightRef}
        userList={userList}
        rolesList={rolesList}
        setUserList={(items) => setUserList(items)}
        onPageChange={handlePageChange}
        itemsCount={itemsCount}
        currentPageNumber={currentPageNumber}
        setItemsCount={setItemsCount}
      />
    );
  }
};
