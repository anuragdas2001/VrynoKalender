import React from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import SaveIcon from "remixicon-react/SaveLineIcon";
import { SupportedApps } from "../../../../../../../models/shared";
import { UPDATE_PROFILE } from "../../../../../../../graphql/mutations/dataSharingMutations";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormCheckBox from "../../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormTextAreaBox from "../../../../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import {
  createTreeInRecursion,
  profileDataGenerator,
  recursiveChildExtractor,
} from "../../utils/dataProfileHelper";
import { IProfileData } from "../../../../../../../models/DataSharingModels";
import { TreeNodeClass } from "../../utils/TreeNodeClass";

export const EditDataProfile = ({
  id,
  onCancel,
  isRootNode,
  parentIdOptions,
  currentProfile,
  profileData,
  setProfileData,
  setRootNode,
  setAllParentIdOptions,
  profileDataDict,
  setProfileDataDict,
}: {
  id: string | null;
  onCancel: () => void;
  isRootNode: boolean;
  parentIdOptions: { value: string | null; label: string }[];
  currentProfile: IProfileData;
  profileData: IProfileData[];
  setProfileData: (value: IProfileData[]) => void;
  setRootNode: (value: TreeNodeClass | null) => void;
  setAllParentIdOptions: (
    value: {
      value: string | null;
      label: string;
    }[]
  ) => void;
  profileDataDict: Record<string, IProfileData[]>;
  setProfileDataDict: (value: Record<string, IProfileData[]>) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const [savingProcess, setSavingProcess] = React.useState(false);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  const handleEditProfile = (values: FormikValues) => {
    setSavingProcess(true);
    updateProfile({
      variables: {
        id: id,
        input: {
          name: values.name,
          parentId: values.parentId,
          sharedPeers: values.sharedPeers,
          description: values.description,
        },
      },
    })
      .then((response) => {
        if (response?.data?.updateProfile?.messageKey.includes("-success")) {
          toast.success(response?.data?.updateProfile?.message);
          // router.push("/settings/crm/profile");
          const editedProfile = response?.data?.updateProfile?.data;
          const updatedData = profileData.map((val) => {
            if (val.id === editedProfile.id) return editedProfile;
            return val;
          });

          setProfileData(updatedData);
          const { rootNode, nodesDict, addProfileParentOptions } =
            profileDataGenerator(updatedData);
          if (rootNode) createTreeInRecursion(rootNode, nodesDict);
          setRootNode(rootNode);
          setProfileDataDict(nodesDict);
          setAllParentIdOptions(addProfileParentOptions);
          onCancel();
          setSavingProcess(false);
        } else if (response?.data?.updateProfile?.message) {
          toast.error(response?.data?.updateProfile?.message);
          setSavingProcess(false);
        } else {
          toast.error(t("common:unknown-message"));
          setSavingProcess(false);
        }
      })
      .catch((error) => {
        console.error("error", error);
        toast.error(t("common:unknown-message"));
        setSavingProcess(false);
      });
  };

  React.useEffect(() => {
    let toBeUpdatedProfileList: IProfileData[] = [];
    if (profileDataDict[currentProfile.id]?.length) {
      recursiveChildExtractor(
        currentProfile,
        profileDataDict,
        toBeUpdatedProfileList
      );
    }

    if (toBeUpdatedProfileList?.length) {
      let updatedParentOptions = [];
      for (const option of parentIdOptions) {
        let flag = true;
        for (const rejectedOption of toBeUpdatedProfileList) {
          if (option.value === rejectedOption.id) {
            flag = false;
            break;
          }
        }
        if (flag) updatedParentOptions.push(option);
      }
      parentIdOptions = updatedParentOptions;
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter role name")
      .max(50, "Profile name must be at most 50 characters"),
    parentId:
      parentIdOptions.length && !isRootNode
        ? Yup.string().required("Please select reporting profile")
        : Yup.string().notRequired(),
  });

  return (
    <Formik
      initialValues={{
        name: currentProfile?.name || null,
        parentId: currentProfile?.parentId || null,
        sharedPeers: currentProfile?.sharedPeers || false,
        description: currentProfile?.description || null,
      }}
      onSubmit={(values: FormikValues) => handleEditProfile(values)}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue }) => (
        <>
          <div className="w-full max-h-[55vh] overflow-y-scroll pr-1.5 card-scroll mt-4">
            <div className="px-2">
              <div className="flex flex-col">
                <FormInputBox
                  name="name"
                  label="Profile Name"
                  required
                  disabled={savingProcess}
                />
                {!isRootNode && (
                  <FormDropdown
                    name="parentId"
                    label="Reports to"
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
                )}
                {!isRootNode && (
                  <FormCheckBox
                    name="sharedPeers"
                    label="Share Data with Peers"
                    required
                    disabled={savingProcess}
                  />
                )}
                <FormTextAreaBox
                  name="description"
                  label="Description"
                  disabled={savingProcess}
                  rows={2}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-x-4 gap-y-4 sm:gap-y-0 mt-6.5">
            <Button
              id="cancel-edit-profile"
              onClick={onCancel}
              kind="back"
              userEventName="form-modal:cancel-click"
              disabled={savingProcess}
            >
              <>{t("Cancel")}</>
            </Button>
            <Button
              id="submit-edit-profile"
              buttonType="thin"
              kind="primary"
              onClick={() => handleSubmit()}
              disabled={savingProcess}
              loading={savingProcess}
              userEventName="add-profile:save-click"
            >
              <div className="flex gap-x-1">
                <SaveIcon size={18} />
                <p>Save Profile</p>
              </div>
            </Button>
          </div>
        </>
      )}
    </Formik>
  );
};
