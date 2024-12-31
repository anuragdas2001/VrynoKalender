import React, { ChangeEvent } from "react";
import * as Yup from "yup";
import { TFunction } from "i18next";
import { Formik, FormikValues } from "formik";
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

export const EditUserFormContainer = ({
  t,
  userData,
  handleUserUpdation,
  userUpdateLoader,
  roles,
  roleIds,
  handleCheckboxSelect,
  editModeValue,
  editMode,
  profileIdOptions,
}: {
  t: TFunction<("settings" | "common")[], undefined, ("settings" | "common")[]>;
  userData: IUser[];
  handleUserUpdation: (values: FormikValues) => Promise<void>;
  userUpdateLoader: boolean;
  roles: IRole[];
  roleIds: string[];
  handleCheckboxSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  editModeValue: boolean;
  editMode: boolean;
  profileIdOptions: { value: string | null; label: string }[];
}) => {
  const initialValues: Partial<IUser> = {
    ...{
      firstName: "",
      lastName: "",
      email: "",
      middleName: "",
      country: "",
      city: "",
      zipcode: "",
      address: "",
      profileId: null,
    },
    ...userData[0],
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(50, "First name must be at most 50 characters")
      .notRequired()
      .matches(
        /^([A-Za-z0-9_@./#&+-\\\/_\-]|([A-Za-z0-9_@./#&+-\\\/_\-][A-Za-z0-9_@./#&+-\\\/_\- ]{0,48}[A-Za-z0-9_@./#&+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    lastName: Yup.string()
      .max(50, "Last name must be at most 50 characters")
      .notRequired()
      .matches(
        /^([A-Za-z0-9_@./#&+-\\\/_\-]|([A-Za-z0-9_@./#&+-\\\/_\-][A-Za-z0-9_@./#&+-\\\/_\- ]{0,48}[A-Za-z0-9_@./#&+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    email: Yup.string().email(t("common:email-invalid-message")).notRequired(),
  });

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 20);
    }
  }, []);
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");

  return (
    <Formik
      initialValues={{
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        email: initialValues.email,
        roleId: initialValues.roleId,
        middleName: initialValues.middleName,
        country: initialValues.country,
        city: initialValues.city,
        zipcode: initialValues.zipcode,
        address: initialValues.address,
        profileId: initialValues.profileId,
      }}
      {...FormikFormProps}
      validationSchema={validationSchema}
      onSubmit={(values) => handleUserUpdation(values)}
      enableReinitialize
    >
      {({ handleSubmit }) => (
        <>
          <GenericBackHeader heading="Edit User" addButtonInFlexCol={false}>
            <div>
              <Button
                id="edit-user-button"
                buttonType="thin"
                kind="primary"
                onClick={() => handleSubmit()}
                userEventName="edit-user:submit-click"
                disabled={userUpdateLoader}
                loading={userUpdateLoader}
              >
                <div className="flex gap-x-1">
                  <SaveIcon size={18} />
                  <p>Update</p>
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
                    handleCheckboxSelect={handleCheckboxSelect}
                    editMode={editMode}
                    editModeValue={editModeValue}
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
                  <AdditionalInfoForm editMode={editModeValue} />
                </div>
              </GenericHeaderCardContainer>
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};
