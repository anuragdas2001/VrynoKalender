import { Config } from "../../../../shared/constants";
import * as Yup from "yup";
import { TFunction } from "next-i18next";

export function getLaunchUrl(
  currentSubdomain: string,
  locale: string | undefined
) {
  const launchUrl = `${Config.publicRootUrl({
    appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
    appSubDomain: currentSubdomain,
  })}${locale}/${Config.crmApplicationPath}`;
  return launchUrl;
}

export const loadingArray = [
  "Setting up instance...",
  "Installing applications...",
  "Configuring Roles and Permissions...",
];
export const formStepperArray = [
  { label: "Create Instance" },
  { label: "Fill Details" },
  { label: "Select Apps" },
];
export const detailsValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    subdomain: Yup.string()
      .required(t("sub-domain-error"))
      .matches(
        /^([A-Za-z0-9_@./#&$+-\\\/_\-]|([A-Za-z0-9_@./#&$+-\\\/_\-][A-Za-z0-9_@./#&$+-\\\/_\- ]{0,50}[A-Za-z0-9_@./#&$+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      )
      .max(10),
    description: Yup.string()
      .optional()
      .max(300, `Cannot exceed 300 characters`),
  });
