import React from "react";
import { useFormikContext } from "formik";
import FormRadioButton from "../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";
import FormSearchBox from "../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import { AccountModels } from "../../../../../models/Accounts";
import { ISharingRuleData, SupportedApps } from "../../../../../models/shared";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { observer } from "mobx-react-lite";

const UserSelectionForSharingCriteria = ({
  editMode,
  fieldName,
}: {
  editMode: boolean;
  fieldName: string;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <div className="flex items-center gap-x-1">
      {/* <div
        className={
          "w-1/4 appearance-none bg-clip-padding border border-vryno-form-border-gray  rounded-md text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none p-2 bg-white"
        }
      >
        Users
      </div> */}
      <div className="w-full">
        <FormSearchBox
          name={`${fieldName}-userNames`}
          appName={SupportedApps.accounts}
          modelName={AccountModels.User}
          editMode={editMode}
          multiple={true}
          searchBy={["first_name", "last_name"]}
          fieldDisplayExpression={["first_name", "last_name"]}
          placeholder={`Please enter here to search`}
          allowMargin={false}
          handleItemSelect={(data) => {
            if (data?.length)
              setFieldValue(
                fieldName,
                data
                  .map((item: any) => item?.id ?? item?.values?.id)
                  .filter((val) => val)
              );
            else setFieldValue(fieldName, []);
          }}
        />
      </div>
    </div>
  );
};

export const RecordSharingCriteriaContainer = observer(
  ({
    recordCreatedById,
    editMode,
    fieldName = "sharedUsers",
    moduleViewSharingData,
    showLabel = true,
    showNoPermissionMessage = false,
  }: {
    recordCreatedById: string | null;
    editMode: boolean;
    fieldName?: string;
    moduleViewSharingData: ISharingRuleData | null;
    showLabel?: boolean;
    showNoPermissionMessage?: boolean;
  }) => {
    const userContext = React.useContext(UserStoreContext);
    const { user } = userContext;
    // const [userList, setUserList] = React.useState<IUser[]>([]);
    // const [userDataLoading, setUserDataLoading] = React.useState<boolean>(true);
    const { values, setFieldValue } =
      useFormikContext<Record<string, string>>();

    // const [getUsersListData] = useLazyQuery(FETCH_QUERY, {
    //   fetchPolicy: "no-cache",
    //   context: {
    //     headers: {
    //       vrynopath: "accounts",
    //     },
    //   },
    // });

    // const fetchUserDataInRecursion = async (
    //   pageNumber: number,
    //   fetchedUserData: IUser[]
    // ) => {
    //   await getUsersListData({
    //     variables: {
    //       modelName: "User",
    //       fields: ["id", "email", "isActive"],
    //       filters: [{ name: "recordStatus", operator: "in", value: ["a"] }],
    //       pageNumber: 1,
    //     },
    //   }).then(async (response) => {
    //     if (
    //       response?.data?.fetch?.messageKey.includes("-success") &&
    //       response?.data?.fetch?.data?.length
    //     ) {
    //       const responseData = response?.data?.fetch?.data;
    //       responseData?.forEach((data: IUser) => {
    //         fetchedUserData.push(data);
    //       });
    //       if (responseData?.length === 50) {
    //         await fetchUserDataInRecursion(++pageNumber, fetchedUserData);
    //       }
    //     }
    //   });
    //   return { fetchedUserData };
    // };

    React.useEffect(() => {
      (async () => {
        // if (user?.id !== recordCreatedById || editMode) {
        //   const { fetchedUserData } = await fetchUserDataInRecursion(1, []);
        //   setUserDataLoading(false);
        //   setUserList(fetchedUserData);
        // }
        if (!editMode) {
          // setUserDataLoading(false);
          setFieldValue("sharedType", "onlyMe");
          setFieldValue(fieldName, []);
        }
      })();
    }, []);

    React.useEffect(() => {
      if (moduleViewSharingData && editMode) {
        setFieldValue("sharedType", moduleViewSharingData.sharedType);
        setFieldValue(fieldName, moduleViewSharingData.sharedUsers);
        if (moduleViewSharingData.sharedType === "selectedUsers") {
          setFieldValue(
            `${fieldName}-userNames`,
            moduleViewSharingData.sharedUsers
          );
        }
      }
    }, [moduleViewSharingData]);

    if (editMode && user?.id !== recordCreatedById)
      return showNoPermissionMessage ? (
        <p>Created user can see the details</p>
      ) : (
        <></>
      );
    // if (userDataLoading)
    //   return (
    //     <div className="px-6 py-0">
    //       <ItemsLoader currentView={"List"} loadingItemCount={0} />
    //     </div>
    //   );
    return (
      <div className="">
        {showLabel && (
          <p className="font-medium text-sm mt-6 mb-2">Share this with</p>
        )}
        <FormRadioButton
          name={"sharedType"}
          allowMargin={false}
          //   disabled={!values["moduleName"]}
          options={[
            {
              value: "onlyMe",
              label: "Only Me",
              render: undefined,
            },
            {
              value: "everyone",
              label: "Everyone",
              render: undefined,
            },
            {
              value: "selectedUsers",
              label: "Selected Users",
              render: (
                <UserSelectionForSharingCriteria
                  editMode={true}
                  fieldName={fieldName}
                />
              ),
            },
          ]}
          onChange={(e) => {
            setFieldValue("sharedType", e.target.value);
            if (["onlyMe", "everyone"].includes(e.target.value)) {
              setFieldValue(fieldName, []);
            }
            // if (e.target.value === "everyone") {
            //   setFieldValue(
            //     fieldName,
            //     userList?.map((item) => item.id)
            //   );
            // }
            if (e.target.value === "selectedUsers") {
              setFieldValue(
                fieldName,
                values[`${fieldName}-userNames`]?.length
                  ? values[`${fieldName}-userNames`]
                  : []
              );
            }
          }}
        />
      </div>
    );
  }
);
