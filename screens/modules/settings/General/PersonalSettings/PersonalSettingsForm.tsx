import { Formik, FormikValues } from "formik";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { countryList } from "../../../../../shared/CountryList";
import { LanguageList } from "../../../../../shared/LanguageList";
import { DateFormatList } from "../../../../../shared/DateFormatList";
import { TimezoneList } from "../../../../../shared/TimezoneList";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { FormikFormProps } from "../../../../../shared/constants";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { SettingsSideBar } from "../../SettingsSidebar";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import SaveIcon from "remixicon-react/SaveLineIcon";
import * as Yup from "yup";
import React from "react";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { useTranslation } from "next-i18next";
import { IUser, User } from "../../../../../models/Accounts";
import { PersonalDetails } from "./PersonalDetails";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { SupportedLabelLocations } from "../../../../../components/TailwindControls/SupportedLabelLocations";
import moment from "moment";
import { getTimezone } from "countries-and-timezones";
import FormImagePicker from "../../../../../components/TailwindControls/Form/ImagePicker/FormImagePicker";
import { IUserPreference, SupportedApps } from "../../../../../models/shared";

export const PersonalSettingsForm = ({
  valuesAvailable,
  internalContact,
  handleUserCreation,
  headerLabel,
  savingUserInfoProcess,
  userInitials,
  user,
  loader,
  userPreferences,
}: {
  valuesAvailable: boolean;
  internalContact: Partial<IUser>;
  handleUserCreation: (values: FormikValues) => Promise<void>;
  headerLabel: string;
  savingUserInfoProcess: boolean;
  userInitials: string;
  user: User | null;
  loader: boolean;
  userPreferences: IUserPreference[];
}) => {
  const { t } = useTranslation(["register", "common"]);
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(50, "First name must be at most 50 characters")
      .matches(
        /^([A-Za-z0-9_@./#&+-\\\/_\-]|([A-Za-z0-9_@./#&+-\\\/_\-][A-Za-z0-9_@./#&+-\\\/_\- ]{0,48}[A-Za-z0-9_@./#&+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    lastName: Yup.string()
      .required(t("Last Name is required"))
      .max(50, "Last name must be at most 50 characters")
      .matches(
        /^([A-Za-z0-9_@./#&+-\\\/_\-]|([A-Za-z0-9_@./#&+-\\\/_\-][A-Za-z0-9_@./#&+-\\\/_\- ]{0,48}[A-Za-z0-9_@./#&+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    email: Yup.string().email(t("common:email-invalid-message")),
    dateOfBirth: Yup.date()
      .notRequired()
      .max(
        moment(),
        `Date of Birth cannot be greater than ${moment().format("DD/MM/YYYY")}`
      ),
  });

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {valuesAvailable && (
        <Formik
          enableReinitialize={true}
          initialValues={{
            firstName: internalContact.firstName,
            lastName: internalContact.lastName,
            email: internalContact.email,
            mobileNumber: internalContact.mobileNumber,
            phoneNumber: internalContact.phoneNumber,
            dateOfBirth: internalContact.dateOfBirth,
            street: internalContact.street,
            city: internalContact.city,
            state: internalContact.state,
            zipcode: internalContact.zipcode,
            language: internalContact.language,
            country: internalContact.country,
            dateFormat: internalContact.dateFormat,
            timeFormat: internalContact.timeFormat,
            timezone: internalContact.timezone,
            navbarcolor: internalContact?.navbarcolor,
            recordImage: internalContact?.recordImage,
            signature: internalContact?.signature,
          }}
          {...FormikFormProps}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleUserCreation(values);
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <>
              <GenericBackHeader heading="Personal Settings">
                <div>
                  <Button
                    id={`add-${headerLabel}`}
                    buttonType="thin"
                    kind="primary"
                    loading={savingUserInfoProcess}
                    disabled={loader || savingUserInfoProcess}
                    onClick={() => {
                      if (!values.country || !values.timezone) {
                        const timezone = getTimezone(
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                        );
                        if (!values.timezone) {
                          setFieldValue("timezone", timezone?.aliasOf);
                        }
                        if (!values.country) {
                          setFieldValue(
                            "country",
                            timezone && timezone?.countries?.length > 0
                              ? timezone?.countries[0]
                              : ""
                          );
                        }
                      }
                      handleSubmit();
                    }}
                    userEventName="personalSetting-update:submit-click"
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

              <div ref={heightRef} className={`px-6 sm:pt-6 overflow-y-auto`}>
                <GenericHeaderCardContainer
                  cardHeading={"Details"}
                  extended={true}
                  allowOverflow={true}
                >
                  <div className="flex flex-col">
                    <FormImagePicker
                      required={false}
                      name={"recordImage"}
                      label={"Profile Picture"}
                      isSample={false}
                      modelName="user"
                      imageServiceName={SupportedApps.accounts}
                      disabled={savingUserInfoProcess}
                      isRounded={true}
                      showEditOption={false}
                      editPosition={"top-0 right-2.5"}
                      itemsCenter={true}
                      compressionWidth={284}
                      resolutionMessage="For better resolution, use an image with dimensions of 284px by 284px."
                    />
                    <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 overflow-visible">
                      <PersonalDetails
                        user={user ? user : undefined}
                        userPreferences={userPreferences}
                        savingUserInfoProcess={savingUserInfoProcess}
                      />
                    </div>
                  </div>
                </GenericHeaderCardContainer>

                <GenericHeaderCardContainer
                  cardHeading={"Local Information"}
                  extended={true}
                >
                  <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4">
                    <FormDropdown
                      name="language"
                      label={t("Language")}
                      options={LanguageList}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "language",
                          selectedOption.currentTarget.value
                        );
                      }}
                      disabled={savingUserInfoProcess}
                    />
                    <FormDropdown
                      name="country"
                      label={t("Country")}
                      options={countryList}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "country",
                          selectedOption.currentTarget.value
                        );
                      }}
                      disabled={savingUserInfoProcess}
                    />
                    <FormDropdown
                      name="dateFormat"
                      label={t("Date Format")}
                      options={DateFormatList}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "dateFormat",
                          selectedOption.currentTarget.value
                        );
                      }}
                      disabled={savingUserInfoProcess}
                    />
                    <FormDropdown
                      name="timeFormat"
                      label={t("Time Format")}
                      options={[
                        { label: "12 Hours", value: "12" },
                        { label: "24 Hours", value: "24" },
                      ]}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "timeFormat",
                          selectedOption.currentTarget.value
                        );
                      }}
                      disabled={savingUserInfoProcess}
                    />
                    <FormDropdown
                      name="timezone"
                      label={t("Time Zone")}
                      options={TimezoneList}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "timezone",
                          selectedOption.currentTarget.value
                        );
                      }}
                      disabled={savingUserInfoProcess}
                    />
                  </div>
                </GenericHeaderCardContainer>
                <GenericHeaderCardContainer
                  cardHeading={"Additional Information"}
                  extended={true}
                >
                  <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
                    <FormInputBox
                      name="navbarcolor"
                      label={t("Navigation Bar Color")}
                      type="color"
                      disabled={savingUserInfoProcess}
                      labelLocation={SupportedLabelLocations.OnLeftSide}
                    />
                  </div>
                </GenericHeaderCardContainer>
              </div>
            </>
          )}
        </Formik>
      )}
    </form>
  );
};
