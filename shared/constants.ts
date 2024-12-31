declare global {
  interface Window {
    IS_CLIENT_DEV_MODE: string;
  }
}

export const FormikFormProps = {
  validateOnChange: false,
  validateOnBlur: false,
};

export type IHostNameConstants = {
  appHostName: string;
  apiHostName: string;
  appSubDomain: string;
  apiSubDomain: string;
  appServiceName: string;
};

export const HostNameConstants = (): IHostNameConstants => ({
  appHostName: process.env.NEXT_PUBLIC_APP_HOSTNAME || "",
  apiHostName: process.env.NEXT_PUBLIC_API_HOSTNAME || "",
  appSubDomain: process.env.NEXT_PUBLIC_APP_SUBDOMAIN || "",
  apiSubDomain: process.env.NEXT_PUBLIC_API_SUBDOMAIN || "",
  appServiceName: process.env.NEXT_PUBLIC_APP_SERVICE_NAME || "",
});

const buildItem = new Function(
  "return `" + process.env.NEXT_PUBLIC_WEBSOCKET_URL + "`;"
);

const getWebSocketUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_WEBSOCKET_URL + "`;"
);

const getApiUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_API_URL + "`;"
);
const getFileUploadUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_FILE_UPLOAD_URL + "`;"
);

const getPublicMetaUploadUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_FILEMETA_UPLOAD_URL + "`;"
);

const getPrivateMetaUploadUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_PRIVATEFILEMETA_UPLOAD_URL + "`;"
);

const getFileFetchUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_FILE_FETCH_URL + "`;"
);

const getAttachmentFetchUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_ATTACHMENT_FETCH_URL + "`"
);

const getPublicRootUrl = new Function(
  "return `" + process.env.NEXT_PUBLIC_APP_ROOT_URL + "`;"
);

const getSupabaseUrl = new Function(
  "return `" + process.env.NEXT_SUPABASE_URL + "`"
);
// const getBulkImportUploadUrl = detail Function(
//   "return `" + process.env.NEXT_PUBLIC_BULK_IMPORT_UPLOAD_URL + "`;"
// );

export const Config = {
  systemAdminUserId:
    process.env.NEXT_PUBLIC_SYSTEM_ADMIN_USER_ID ||
    "11111111-1111-1111-1111-7672796e6f11",
  accountsRootUrl: process.env.NEXT_PUBLIC_ACCOUNTS_ROOT_URL,
  tokenExpiryTimeInMin: 5,
  tokenRenewalTimeInMin: 1,
  milliSecondsInMin: 60000,
  activeReportJSKey:
    process.env.NEXT_PUBLIC_REPORT_LICENSE_KEY ||
    "targetintegration,E111151316569921#B0epmTwJXRFZjYxBFRGhUOIp4b5I5b78WUENWc9ZDZX9EcqZFW9VkWPVWY9dkTXhUYnRFWMBlWxBTUQJmY4UlSUx4RnZ4RoR5K9Z4UwFUdFlVQhpFeix4TjxEMDdDNHF4bxBTT5tEaCJUey26bQVTb7Q7MqJ7VLF6L4wWc8tyTvoGSYhjdP5EWKNTYrh7LoFGSXhTbntmWShDTEh7Uy94K0h6S64EesJGSKl7ZnRmZ4YzMxJmbr8mT69WdNdkND5EZyg4axQ5ahVmcB3mdDZ6c6smertiaTZ4NalDNlJVO5MVbzNTVQFldzMUTj9UWFFnWKVWahFkTiojITJCLiMkQ8cTNBFTNiojIIJCLxUTN7UzN9YTN0IicfJye#4Xfd5nIPNUUKJiOiMkIsIyMWByUKRncvBXZSVmdpR7YBJiOi8kI1tlOiQmcQJCLigjM9ADNwAiMxUDMyIDMyIiOiQncDJCLiETM6AjMyAjMiojIwhXRiwiIu3Wa4FmcnVGdulGdldmchRnI0ISYONkIsUWdyRnOiwmdFJCLiEjM9kjN5YTMzETNxETMxIiOiQWSiwSfdtlOicGbmJCLlNHbhZmOiI7ckJye0ICbuFkI1pjIEJCLi4TPnRDTjtmYOVkWXl4KTF5dvomQxwkaKNHWkp6R7J6NlhlRixEZZlVZ6gFWsBXdthWTrkjQ9NTSU3iQV54VDdWb9M7Q4p5RyZGMhJXRphjT5M7KUV5UTJDR9V6Zil5aJVka",
  reCaptchaV3SiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY,
  supabaseKey:
    process.env.NEXT_SUPABASE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhubGZwZ3puaGdkdmtsYmhpbnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjUyOTksImV4cCI6MjAyNzcwMTI5OX0.SbaBat7M2Q7BmUfq3dNdEXcBn4Z1zJwFR40JgDIY9ow",
  superbaseUrl:
    process.env.NEXT_SUPABASE_URL || "https://hnlfpgznhgdvklbhinrl.supabase.co",
  websocketUrl: (params?: Partial<IHostNameConstants>) =>
    getWebSocketUrl.call(
      params ? { ...HostNameConstants(), ...params } : HostNameConstants()
    ),
  apiUrl: (params?: Partial<IHostNameConstants>) =>
    getApiUrl.call(
      params ? { ...HostNameConstants(), ...params } : HostNameConstants()
    ),
  fileUploadUrl: () => getFileUploadUrl.call(HostNameConstants()),
  cookieDomain: `${HostNameConstants().appSubDomain}.${
    HostNameConstants().appHostName
  }`,
  // bulkImportUploadUrl: () => getBulkImportUploadUrl.call(HostNameConstants()),
  cookieName: process.env.NEXT_PUBLIC_COOKIE_NAME || "",
  crmApplicationPath: process.env.NEXT_PUBLIC_CRM_APPLICATION_PATH,
  publicRootUrl: (params?: Partial<IHostNameConstants>) =>
    getPublicRootUrl.call(
      params ? { ...HostNameConstants(), ...params } : HostNameConstants()
    ),
  publicHostName: (params?: Partial<IHostNameConstants>) =>
    new URL(
      getPublicRootUrl.call(
        params ? { ...HostNameConstants(), ...params } : HostNameConstants()
      )
    ).hostname,
  getLoginUrl(from?: string) {
    return from
      ? `${Config.publicRootUrl()}${Config.loginUrl}?from=${from}`
      : `${Config.publicRootUrl()}${Config.loginUrl}`;
  },
  metaPublicUploadUrl: (
    params: Partial<IHostNameConstants> = {
      apiSubDomain: `${extractInstanceSubDomain()}.${
        HostNameConstants().apiSubDomain
      }`,
    }
  ) =>
    getPublicMetaUploadUrl.call(
      params ? { ...HostNameConstants(), ...params } : HostNameConstants()
    ),
  metaPrivateUploadUrl: (
    params: Partial<IHostNameConstants> = {
      apiSubDomain: `${extractInstanceSubDomain()}.${
        HostNameConstants().apiSubDomain
      }`,
    }
  ) =>
    getPrivateMetaUploadUrl.call(
      params ? { ...HostNameConstants(), ...params } : HostNameConstants()
    ),
  getAbsoluteLogoutUrl: (additionalParams?: string) =>
    additionalParams
      ? `${Config.publicRootUrl()}${Config.logoutUrl}${additionalParams}`
      : `${Config.publicRootUrl()}${Config.logoutUrl}`,
  getFederatedLogoutUrl: () =>
    `${Config.publicRootUrl()}${Config.federatedSignOutUrl}`,
  fileFetchUrl: () => getFileFetchUrl.call(HostNameConstants()),
  attachmentFetchUrl: () => getAttachmentFetchUrl.call(HostNameConstants()),
  ...HostNameConstants(),
  isClientDevMode: () =>
    process.env.NEXT_PUBLIC_IS_CLIENT_DEV_MODE === "true" ||
    (window && window.IS_CLIENT_DEV_MODE === "true"),
  loginUrl: "login",
  logoutUrl: "logout",
  registerUrl: "register",
  instancesUrl: "instances",
  federatedSignOutUrl: "api/federated/sign-out",
  accountClientsUrl: "clients",
  instancesAddUrl: "instances/add",
  forgotPasswordUrl: "forgot-password",
  resetPasswordUrl: "reset-password",
  acceptInviteUrl: "accept-invite",
};

export enum ActivitiesModule {
  "task",
  "meeting",
  "callLog",
}

export const extractInstanceSubDomain = () => {
  return window.location.hostname.split(".")[0];
};

export enum LeadConversionAllowedValues {
  contact = "contact",
  organization = "organization",
  deal = "deal",
}

export const BlockedPermissionModules = [
  "lookup",
  "bulkImportJob",
  "bulkImportJobItem",
  "leadConversionMapping",
  "permission",
  "rolePermission",
  "operation",
  "customModuleData",
  "navigationItem",
  "activityRelatedRecord",
  "inAppNotification",
  "emailJob",
  "emailJobItem",
  "emailRecipient",
  "notification",
];

export const BlockedTogglePermission = [
  "module",
  "layout",
  "field",
  "dealPipeline",
  "dealPipelineStage",
  "moduleView",
  "condition",
  "ruleAction",
];

export const BlockedPermissions = [
  "view-module",
  "view-layout",
  "update-field",
  "delete-field",
  "view-field",
  "view-deal_pipeline",
  "view-deal_pipeline_stage",
  "view-module_view",
  "view-condition",
  "delete-condition",
  "update-condition",
  "create-condition",
  "view-rule_action",
  "delete-rule_action",
  "update-rule_action",
  "create-rule_action",
];
