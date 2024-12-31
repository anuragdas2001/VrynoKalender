import React from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import SaveIcon from "remixicon-react/SaveLineIcon";
import { SupportedApps } from "../../../../../../../models/shared";
import { SAVE_PROFILE } from "../../../../../../../graphql/mutations/dataSharingMutations";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormCheckBox from "../../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import FormTextAreaBox from "../../../../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import {
  createTreeInRecursion,
  profileDataGenerator,
} from "../../utils/dataProfileHelper";
import { IProfileData } from "../../../../../../../models/DataSharingModels";
import { TreeNodeClass } from "../../utils/TreeNodeClass";

export const AddDataProfile = ({
  parentId,
  allParentIdOptions,
  onCancel,
  profileData,
  setProfileData,
  setRootNode,
  setAllParentIdOptions,
  setProfileDataDict,
}: {
  parentId: string | null;
  allParentIdOptions: {
    value: string | null;
    label: string;
  }[];
  onCancel: () => void;
  profileData: IProfileData[];
  setProfileData: (value: IProfileData[]) => void;
  setRootNode: (value: TreeNodeClass | null) => void;
  setAllParentIdOptions: (
    value: {
      value: string | null;
      label: string;
    }[]
  ) => void;
  setProfileDataDict: (value: Record<string, IProfileData[]>) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const [savingProcess, setSavingProcess] = React.useState(false);

  const [addProfile] = useMutation(SAVE_PROFILE, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  const handleCreateProfile = (values: FormikValues) => {
    setSavingProcess(true);
    addProfile({
      variables: {
        input: {
          name: values.name,
          parentId: values.parentId,
          sharedPeers: values.sharedPeers,
          description: values.description,
        },
      },
    })
      .then((response) => {
        if (response?.data?.createProfile?.messageKey.includes("-success")) {
          toast.success(response?.data?.createProfile?.message);
          const updatedData = [
            response?.data?.createProfile?.data,
            ...profileData,
          ];
          setProfileData(updatedData);
          const { rootNode, nodesDict, addProfileParentOptions } =
            profileDataGenerator(updatedData);
          if (rootNode) createTreeInRecursion(rootNode, nodesDict);
          setRootNode(rootNode);
          setProfileDataDict(nodesDict);
          setAllParentIdOptions(addProfileParentOptions);
          onCancel();
          setSavingProcess(false);
        } else if (response?.data?.createProfile?.message) {
          toast.error(response?.data?.createProfile?.message);
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

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter profile name")
      .max(50, "Profile name must be at most 50 characters"),
    parentId: allParentIdOptions.length
      ? Yup.string().required("Please select reporting profile")
      : Yup.string().notRequired(),
  });

  return (
    <Formik
      initialValues={{
        name: null,
        parentId: allParentIdOptions.length && parentId ? parentId : null,
        sharedPeers: false,
        description: null,
      }}
      onSubmit={(values: FormikValues) => handleCreateProfile(values)}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue }) => (
        <>
          <div className="w-full max-h-[55vh] overflow-y-scroll pr-1.5 card-scroll mt-4">
            <div className="px-2">
              <p className="text-xsm">
                This page will allow you to create a new profile based on your
                organizational hierarchy. Create a new profile and associate it
                with a higher profile.
              </p>

              <div className="flex flex-col mt-4">
                <FormInputBox
                  name="name"
                  label="Profile Name"
                  required
                  disabled={savingProcess}
                />
                {allParentIdOptions.length ? (
                  <FormDropdown
                    name="parentId"
                    label="Reports to"
                    options={
                      allParentIdOptions.length
                        ? allParentIdOptions
                        : [{ value: null, label: "No profile found" }]
                    }
                    onChange={(selectedOption) => {
                      allParentIdOptions.length &&
                        setFieldValue(
                          "parentId",
                          selectedOption.currentTarget.value
                        );
                    }}
                    required={allParentIdOptions.length ? true : false}
                    disabled={savingProcess}
                  />
                ) : (
                  <></>
                )}
                {allParentIdOptions.length ? (
                  <FormCheckBox
                    name="sharedPeers"
                    label="Share Data with Peers"
                    required
                    disabled={!allParentIdOptions.length ? true : savingProcess}
                  />
                ) : (
                  <></>
                )}
                <FormTextAreaBox
                  name="description"
                  label="Description"
                  disabled={savingProcess}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 w-full gap-x-4 gap-y-4 sm:gap-y-0 mt-6.5">
            <Button
              id="cancel-add-profile"
              onClick={onCancel}
              kind="back"
              userEventName="form-modal:cancel-click"
              disabled={savingProcess}
            >
              {t("Cancel")}
            </Button>
            <Button
              id="submit-add-profile"
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
