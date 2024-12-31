import React from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import {
  OperationVariables,
  QueryResult,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { deleteProfileFetchHandler } from "../../utils/dataProfileHelper";
import { SupportedApps } from "../../../../../../../models/shared";
import { setHeight } from "../../../../../crm/shared/utils/setHeight";
import GenericBackHeader from "../../../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import ItemsLoader from "../../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import {
  DELETE_PROFILE,
  UPDATE_PROFILE,
} from "../../../../../../../graphql/mutations/dataSharingMutations";
import {
  IFetchProfile,
  PROFILE_DATA_QUERY,
} from "../../../../../../../graphql/queries/dataSharingQueries";
import { IProfileData } from "../../../../../../../models/DataSharingModels";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Please enter profile name")
    .max(50, "Profile name must be at most 50 characters"),
  parentId: Yup.string().required("Please select reporting profile"),
});

export const DeleteDataProfile = ({ id }: { id: string }) => {
  const { t } = useTranslation(["common"]);
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [parentIdOptions, setParentIdOptions] = React.useState<
    { value: string | null; label: string }[]
  >([]);
  const [currentProfile, setCurrentProfile] =
    React.useState<IProfileData | null>(null);
  const [profileDataDict, setProfileDataDict] = React.useState<
    Record<string, IProfileData[]>
  >({});

  const [getProfileData] = useLazyQuery<IFetchProfile>(PROFILE_DATA_QUERY, {
    nextFetchPolicy: "no-cache",
    fetchPolicy: "cache-first",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
  });

  const handleProfileDataResponse = (
    response: QueryResult<IFetchProfile, OperationVariables>
  ) => {
    if (response?.data?.fetchProfile?.messageKey?.includes("-success")) {
      const { nodesDict, currentProfileData, updatedParentOptions } =
        deleteProfileFetchHandler(response?.data?.fetchProfile?.data, id);
      setProfileDataDict(nodesDict);
      setCurrentProfile(currentProfileData);
      setParentIdOptions(updatedParentOptions);
    } else {
      toast.error(
        response?.data?.fetchProfile?.message ||
          "Error while fetching profile data"
      );
    }
    setLoading(false);
  };

  const [deleteProfile] = useMutation(DELETE_PROFILE, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  const handleDeleteResponse = (id: string) => {
    deleteProfile({
      variables: {
        id: id,
      },
    }).then((response) => {
      if (response?.data?.deleteProfile?.messageKey?.includes("-success")) {
        toast.success(response?.data?.deleteProfile?.message);
        router.push("/settings/crm/profile");
      } else if (response?.data?.deleteProfile?.message) {
        toast.error(response?.data?.deleteProfile?.message);
        setSavingProcess(false);
      } else {
        toast.error(t("common:unknown-message"));
        setSavingProcess(false);
      }
    });
  };

  const handleDeleteProfile = async (values: FormikValues) => {
    setSavingProcess(true);
    if (profileDataDict[id]?.length) {
      const fetchPromise = profileDataDict[id].map(async (data) => {
        const response = await updateProfile({
          variables: {
            id: data.id,
            input: {
              parentId: values.parentId,
              name: data.name,
            },
          },
        });
        return response;
      });
      await Promise.all(fetchPromise).then((response) => {
        let count = 0;
        for (let resp of response) {
          if (resp?.data?.updateProfile?.messageKey.includes("-success"))
            count += 1;
        }
        if (count === profileDataDict[id]?.length) {
          handleDeleteResponse(id);
        } else {
          toast.error(`Error updating data of ${currentProfile} profile`);
          setSavingProcess(false);
        }
      });
    } else {
      handleDeleteResponse(id);
    }
  };

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    getProfileData({
      variables: {
        filters: [],
      },
    }).then((response) => handleProfileDataResponse(response));
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, []);

  return loading ? (
    <>
      <GenericBackHeader heading="Delete Profile" />
      <div className="px-6 py-0">
        <ItemsLoader currentView={"List"} loadingItemCount={2} />
      </div>
    </>
  ) : (
    <Formik
      initialValues={{
        name: currentProfile?.name || null,
        parentId: null,
      }}
      onSubmit={(values: FormikValues) => handleDeleteProfile(values)}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue }) => (
        <>
          <GenericBackHeader heading="Delete Profile" addButtonInFlexCol={true}>
            <div>
              <Button
                id="delete-profile"
                buttonType="thin"
                kind="primary"
                onClick={() => handleSubmit()}
                disabled={savingProcess}
                loading={savingProcess}
                userEventName="delete-profile:save-click"
              >
                <div className="flex gap-x-1">
                  <DeleteIcon size={18} />
                  <p>Delete Profile</p>
                </div>
              </Button>
            </div>
          </GenericBackHeader>

          <div className="px-6 pt-4 sm:pt-6">
            <div className="py-4 px-6 bg-white rounded-xl">
              <div ref={heightRef} className="overflow-y-auto">
                <div>
                  <p className="text-md font-medium">Notice</p>
                  <p className="text-xsm">
                    Before deleting, you must transfer users and subordinates
                    with this profile to a new profile.
                  </p>
                </div>
                <div className="flex flex-col md:max-w-[70%] lg:max-w-[60%] mt-4">
                  <FormInputBox
                    name="name"
                    label="Profile to be Deleted"
                    required
                    disabled={true}
                  />
                  <FormDropdown
                    name="parentId"
                    label="Transfer to Profile"
                    options={
                      parentIdOptions.length
                        ? parentIdOptions
                        : [{ value: null, label: "No profile found" }]
                    }
                    onChange={(selectedOption) => {
                      parentIdOptions.length &&
                        setFieldValue(
                          "parentId",
                          selectedOption.currentTarget.value
                        );
                    }}
                    required={parentIdOptions.length ? true : false}
                    disabled={savingProcess}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};
