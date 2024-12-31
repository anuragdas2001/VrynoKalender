import React from "react";
import { useAccountsSaveMutation } from "../../../crm/shared/utils/operations";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { FormikValues } from "formik";
import { getSettingsPathParts } from "../../../crm/shared/utils/getSettingsPathParts";
import { paramCase } from "change-case";
import { IRole } from "../../../../../models/shared";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { ConnectedRolesList } from "./ConnectedRolesList";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { IAddRoleModalVisible } from "./RoleCreationForm/AddRoleModal";

export const Roles = () => {
  const { t } = useTranslation(["settings", "common"]);
  const { menuItem } = getSettingsPathParts();
  const servicesToSetup = ["crm", "workflow", "notify"];

  const [userRoles, setRoleList] = React.useState<IRole[]>([]);
  const [itemsCount, setItemsCount] = React.useState(0);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(0);

  const [loading, setLoading] = React.useState(true);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [addRoleModalVisible, setAddRoleModalVisible] =
    React.useState<IAddRoleModalVisible>({
      visible: false,
      data: null,
    });

  const [getUsersListData] = useLazyQuery(FETCH_QUERY, {
    nextFetchPolicy: "standby",
    fetchPolicy: "cache-first",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setRoleList(
          responseOnCompletion.fetch?.data.filter(
            (val: { key: string }) => val.key !== "instance-owner"
          )
        );
        setItemsCount(responseOnCompletion.fetch?.count - 1);
      }
      setLoading(false);
    },
  });

  const [createRole] = useAccountsSaveMutation<IRole>();
  const [createRoleInApp] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
  });

  const resetRoleHandler = () => {
    setSavingProcess(false);
    setAddRoleModalVisible({ visible: false, data: null });
  };

  const handleRoleCreation = async (values: FormikValues) => {
    //Future Note: User regex
    if (
      [
        "instance owner",
        "instance-owner",
        "instance_owner",
        "instance admin",
        "instance-admin",
        "instance_admin",
        "instance-user",
        "instance-user",
        "instance_user",
      ].includes(values.role.toLowerCase())
    ) {
      toast.error("System Defined Variable: Please use different name");
      return;
    }
    let id = values.id ? values.id : null;
    if (values.copyFrom === "") {
      toast.error("Please select copy-permission-from");
      return;
    }
    setSavingProcess(true);
    try {
      await createRole({
        variables: {
          id: id,
          modelName: "Role",
          saveInput: {
            role: values.role,
            key: values.key ? values.key : paramCase(values.role), //Note: Remove later after BE remove this
            copyFrom: values.copyFrom,
          },
        },
      }).then(async (response) => {
        if (
          response?.data?.save.data &&
          response?.data?.save.messageKey.includes("success")
        ) {
          await Promise.all(
            servicesToSetup.map((oneService) => {
              return createRoleInApp({
                context: {
                  headers: {
                    vrynopath: oneService,
                  },
                },
                variables: {
                  id: null,
                  modelName: "RolePermission",
                  saveInput: {
                    roleKey: response?.data?.save.data.key,
                    permissionKey: "",
                    copyFrom: values.copyFrom,
                  },
                },
              });
            })
          );
          resetRoleHandler();
          toast.success("Role successfully created.");
          let updatedList = userRoles.filter((val) => {
            return val.id !== response?.data?.save.data.id;
          });
          setRoleList([response?.data?.save.data, ...updatedList]);
          setItemsCount(itemsCount + 1);
          return;
        }
        if (response?.data?.save.messageKey) {
          resetRoleHandler();
          toast.error(response?.data?.save.messageKey);
          return;
        }
        resetRoleHandler();
        toast.error(t("common:unknown-message"));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setLoading(true);
    getUsersListData({
      variables: {
        modelName: "Role",
        fields: ["role", "key", "createdBy", "createdAt", "updatedAt"],
        filters: [],
        pageNumber: pageNumber,
      },
    }).then((response) => {
      if (response?.data?.fetch?.messageKey.includes("success"))
        setCurrentPageNumber(pageNumber);
    });
  };

  React.useEffect(() => {
    getUsersListData({
      variables: {
        modelName: "Role",
        fields: ["role", "key", "createdBy", "createdAt", "updatedAt"],
        filters: [],
        pageNumber: 1,
      },
    }).then((response) => {
      if (response?.data?.fetch?.data) setCurrentPageNumber(1);
    });
  }, []);

  return loading ? (
    <>
      <GenericBackHeader heading="Roles & Permissions" />
      <div className="px-6 py-0">
        <ItemsLoader currentView={"List"} loadingItemCount={2} />
      </div>
    </>
  ) : (
    <ConnectedRolesList
      userRoles={userRoles}
      savingProcess={savingProcess}
      menuItem={menuItem}
      addRoleModalVisible={addRoleModalVisible}
      handleRoleCreation={handleRoleCreation}
      setAddRoleModalVisible={(value: {
        visible: boolean;
        data: IRole | null;
      }) => setAddRoleModalVisible(value)}
      setRoleList={setRoleList}
      itemsCount={itemsCount}
      currentPageNumber={currentPageNumber}
      onPageChange={handlePageChange}
      setItemsCount={setItemsCount}
    />
  );
};
