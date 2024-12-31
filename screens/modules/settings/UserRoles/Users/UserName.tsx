import { useContext, useEffect } from "react";
import { AllUserStoreContext } from "../../../../../stores/AllUsersStore";
import { User } from "../../../../../models/Accounts";
import { observer } from "mobx-react-lite";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";

export const UserName = observer(({ id }: { id: string }) => {
  const [getUser] = useLazyQuery<FetchData<User>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
  });

  const { addUser, getById } = useContext(AllUserStoreContext);
  const user = getById(id);

  useEffect(() => {
    if (id && !user) {
      getUser({
        variables: {
          modelName: "User",
          fields: ["id", "firstName", "lastName", "email"],
          filters: [
            {
              name: "id",
              operator: "eq",
              value: id,
            },
          ],
        },
      }).then((res) => {
        const rest = res.data?.fetch?.data;
        const finalData = rest && rest.length > 0 ? rest[0] : null;
        addUser({
          id,
          userId: id,
          firstName: finalData ? finalData.firstName : "",
          lastName: finalData ? finalData.lastName : "",
          email: finalData ? finalData.email : "",
        });
      });
    }
  }, [id]);

  const userNotFound = <div>User Not Found</div>;
  if (!user) {
    return <div>Loading...</div>;
  }
  if (!user.email) {
    return userNotFound;
  }
  return (
    <>
      {user?.firstName} {user?.lastName}
    </>
  );
});
