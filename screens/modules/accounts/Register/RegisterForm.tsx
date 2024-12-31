import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import {
  RegisterData,
  REGISTRATION_MUTATION,
} from "../../../../graphql/mutations/register";
import { Formik, FormikValues } from "formik";
import { useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { RegisterFormFields } from "./RegisterFormFields";
import { FormikFormProps } from "../../../../shared/constants";
import Link from "next/link";
import { Toast } from "../../../../components/TailwindControls/Toast";
import { useGoogleRecaptchaTokenGenerator } from "../shared/UseGoogleRecaptchaTokenGenerator";
import { SupportedApps } from "../../../../models/shared";
import { ICountryDetails } from "../../../../api-utils/getCountryDetails";
import { useRouter } from "next/router";
import { getTimezone } from "countries-and-timezones";

export const RegisterForm = ({
  setUserRegistered,
  countryDetails,
}: {
  setUserRegistered: Dispatch<SetStateAction<boolean>>;
  countryDetails: ICountryDetails;
}): React.ReactElement => {
  const { t } = useTranslation(["register", "common"]);
  const router = useRouter();
  const generateCaptchaToken = useGoogleRecaptchaTokenGenerator("register");
  const [registerLoading, setRegisterLoading] = React.useState(false);

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
    mobile: Yup.string()
      .required(t("phone-number-required-message"))
      .min(7, "Phone Number cannot be less than 7 digits.")
      .max(22, "Phone Number cannot exceed 22 digits")
      .notOneOf(
        [
          "000000000000000",
          "111111111111111",
          "222222222222222",
          "333333333333333",
          "444444444444444",
          "555555555555555",
          "666666666666666",
          "777777777777777",
          "888888888888888",
          "999999999999999",
          "00000000000",
          "11111111111",
          "22222222222",
          "33333333333",
          "444444444444",
          "5555555555555",
          "66666666666",
          "77777777777",
          "888888888888",
          "999999999999",
        ],
        "Please enter a valid phone number"
      )
      .label(t("common:phone-number-label")),
    password: Yup.string()
      .min(12, "Minimum 12 characters required")
      .max(50, "Password must be 50 characters long")
      .required(t("common:password-required-message"))
      .label("Password")
      .test({
        name: "validate",
        exclusive: true,
        message: "${path} must be less than ${max} characters, ",
        test: (value, ctx) => {
          let errorMessage = "";
          if (!value?.match(/^(?=.*[a-z])/)) {
            errorMessage += "One lowercase character required, ";
          }
          if (!value?.match(/^(?=.*[A-Z])/)) {
            errorMessage += "One uppercase character required, ";
          }
          if (!value?.match(/^(?=.*[0-9])/)) {
            errorMessage += "One number required, ";
          }
          if (!value?.match(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)) {
            errorMessage += "One special character required";
          }
          if (errorMessage.length)
            return ctx.createError({ message: errorMessage });
          return true;
        },
      }),
    company: Yup.string().label("Organization").optional(),
    privacypolicy: Yup.boolean(),
  });

  const [RegisterUser] = useMutation<RegisterData<Record<string, string>>>(
    REGISTRATION_MUTATION,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
    }
  );

  const handleRegistration = async (values: FormikValues) => {
    const timezone = getTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    try {
      return await RegisterUser({
        variables: {
          registerReq: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            confirmPassword: values.password,
            mobile: values.mobile,
            company: values.company,
            timezone: timezone?.aliasOf
              ? timezone?.aliasOf
              : timezone?.name
              ? timezone?.name
              : "GMT",
            country:
              timezone && timezone?.countries?.length > 0
                ? timezone?.countries[0]
                : "GB",
            token: values.token,
            source: values.source,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const OnSubmitCall = async (values: FormikValues) => {
    const payload = {
      ...values,
      token: await generateCaptchaToken(),
    };
    setRegisterLoading(true);
    const result = await handleRegistration(payload);
    if (!result) {
      Toast.error(`${t("common:unknown-message")}`);
      setRegisterLoading(false);
      return;
    }
    const { data, errors } = result;

    if (!errors && data) {
      if (data.register.messageKey === "registration-successful") {
        router.push("/register-verification");
        // setUserRegistered(true);
      } else {
        toast.error(data.register.message);
        setRegisterLoading(false);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid sm:grid-cols-2 gap-x-4"
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            company: "",
            mobile: "",
            privacypolicy: false,
            source: null,
          }}
          {...FormikFormProps}
          validationSchema={validationSchema}
          onSubmit={OnSubmitCall}
        >
          {({ handleSubmit }) => (
            <RegisterFormFields
              handleSubmit={handleSubmit}
              registerLoading={registerLoading}
              countryDetails={countryDetails}
            />
          )}
        </Formik>
      </form>
      <div className="flex flex-row justify-center items-center">
        <span className=" text-sm">{t("have-an-account-label")}&nbsp;</span>
        <Link href="/login" legacyBehavior>
          <a id="login-link">
            <span className="text-vryno-theme-blue text-sm">
              {t("common:login-label")}
            </span>
          </a>
        </Link>
      </div>
    </>
  );
};
