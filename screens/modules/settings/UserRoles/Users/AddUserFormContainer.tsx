import React, { ChangeEvent } from "react";
import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import SaveIcon from "remixicon-react/SaveLineIcon";
import { IRole } from "../../../../../models/shared";
import { IUser } from "../../../../../models/Accounts";
import { SettingsSideBar } from "../../SettingsSidebar";
import { BasicUserInfoForm } from "./BasicUserInfoForm";
import { AdditionalInfoForm } from "./AdditionalInfoForm";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { FormikFormProps } from "../../../../../shared/constants";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";

export const AddUserFormContainer = ({
  internalContact,
  handleUserCreation,
  userSaveProcessing,
  roles,
  roleIds,
  onCheckboxSelect,
  editMode,
  profileIdOptions,
  profileDataLoading,
}: {
  internalContact: Partial<IUser>;
  handleUserCreation: (values: FormikValues) => Promise<void>;
  userSaveProcessing: boolean;
  roles: IRole[];
  roleIds: string[];
  onCheckboxSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  profileIdOptions: {
    value: string | null;
    label: string;
  }[];
  profileDataLoading: boolean;
}) => {
  const { t } = useTranslation(["settings", "common"]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(t("first-name-required-message"))
      .max(50, "First Name must be at most 50 characters")
      .matches(
        /^([A-Za-z0-9_@.\/#&+-\\\/_\-]|([A-Za-z0-9_@.\/#&+-\\\/_\-][A-Za-z0-9_@.\/#&+-\\\/_\- ]{0,48}[A-Za-z0-9_@.\/#&+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    lastName: Yup.string()
      .required(t("last-name-required-message"))
      .max(50, "Last Name must be at most 50 characters")
      .matches(
        /^([A-Za-z0-9_@./#&+-\\\/_\-]|([A-Za-z0-9_@./#&+-\\\/_\-][A-Za-z0-9_@./#&+-\\\/_\- ]{0,48}[A-Za-z0-9_@./#&+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    email: Yup.string()
      .email(t("common:email-invalid-message"))
      .max(254, "Email must be at most 254 characters")
      .required(t("common:email-required-message")),
  });

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 20);
    }
  }, []);
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");

  return profileDataLoading ? (
    <>
      <GenericBackHeader heading="Add User" />
      <div className="px-6 py-0">
        <ItemsLoader currentView="List" loadingItemCount={2} />
      </div>
    </>
  ) : (
    <form onSubmit={(e) => e.preventDefault()}>
      <Formik
        initialValues={{
          firstName: internalContact.firstName,
          lastName: internalContact.lastName,
          email: internalContact.email,
          roleIds: internalContact.roleIds,
          profileId: null,
        }}
        {...FormikFormProps}
        validationSchema={validationSchema}
        onSubmit={(values) => handleUserCreation(values)}
      >
        {({ handleSubmit }) => (
          <>
            <GenericBackHeader heading="Add User" addButtonInFlexCol={false}>
              <div>
                <Button
                  id="save-user-button"
                  buttonType="thin"
                  kind="primary"
                  onClick={() => handleSubmit()}
                  userEventName="add-user:submit-click"
                  disabled={userSaveProcessing}
                  loading={userSaveProcessing}
                >
                  <div className="flex gap-x-1">
                    <SaveIcon size={18} />
                    <p>Save</p>
                  </div>
                </Button>
              </div>
            </GenericBackHeader>
            <div className="sm:hidden w-40 mt-6 mb-5">
              <SideDrawer
                sideMenuClass={sideMenuClass}
                setSideMenuClass={setSideMeuClass}
                buttonType={"thin"}
              >
                <SettingsSideBar />
              </SideDrawer>
            </div>
            <div ref={heightRef} className="overflow-y-auto">
              <div className="px-6 sm:pt-6">
                <GenericHeaderCardContainer
                  cardHeading={"Basic Information"}
                  extended={true}
                >
                  <div className="mt-5 pr-1 lg:pr-0 flex flex-wrap gap-x-4 max-h-96 overflow-y-scroll">
                    <BasicUserInfoForm
                      roles={roles}
                      roleIds={roleIds}
                      handleCheckboxSelect={onCheckboxSelect}
                      editMode={editMode}
                      editModeValue={false}
                      profileIdOptions={profileIdOptions}
                      t={t}
                    />
                  </div>
                </GenericHeaderCardContainer>
              </div>

              <div className="px-6 pt-6">
                <GenericHeaderCardContainer
                  cardHeading={"Additional Information"}
                  extended={true}
                  marginBottom={"mb-0"}
                >
                  <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 max-h-96 overflow-y-scroll">
                    <AdditionalInfoForm editMode={editMode} />
                  </div>
                </GenericHeaderCardContainer>
              </div>
            </div>
          </>
        )}
      </Formik>
    </form>
  );
};
