export type Platform = {
  logo: string;
  service: string;
  platform: string;
  authCodeRequestUri: string;
  [key: string]: string | string[] | number;
};

export type LinkedAccount = {
  id: string;
  identity: string;
  isActive: boolean;
  platform: string;
  recordStatus: string;
  [key: string]: string | string[] | number | boolean;
};

export type MailSyncJob = {
  id: string;
  status: string;
  mailAccount: string;
  stats: string;
  [key: string]: string;
};

export enum MailSyncJObStatus {
  pending = "pending",
  hold = "hold",
}

export enum PrimaryNavItem {
  emailConfiguration = "emailConfiguration",
}

export type UserEmailSettingsNavItem = {
  id: string;
  key: PrimaryNavItem;
  label: string;
  userEvent: string;
  buttonType: "normal";
  [key: string]: string;
};

export const SUPPORTED_PROVIDERS: string[] = ["google", "microsoft"];

export const STATE_MAPPER = {
  true: MailSyncJObStatus.pending,
  false: MailSyncJObStatus.hold,
};

export const PLATFORM_SERVICE_MAP: Record<string, Platform> = {
  google: {
    platform: "google",
    service: "Gmail",
    logo: "/gmail.svg",
    authCodeRequestUri: "",
  },
  microsoft: {
    platform: "microsoft",
    service: "Outlook",
    logo: "/outlook.svg",
    authCodeRequestUri: "",
  },
};
