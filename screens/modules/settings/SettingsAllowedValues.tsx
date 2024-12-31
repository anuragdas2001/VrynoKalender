import { User } from "../../../models/Accounts";
import { SettingsMenuItem } from "../../../models/Settings";

export const SettingsPermissionsMapper: Partial<
  Record<SettingsMenuItem, (user: User) => boolean | undefined>
> = {
  "personal-settings": (user) => true,
  "email-settings": (user) => true,
  "email-campaign": (user) => user.isInstanceAdmin,
  "module-fields": (user) => user.isInstanceAdmin,
  templates: (user) => true,
  users: (user) => user.isInstanceAdmin,
  "role-permission": (user) => user.isInstanceAdmin,
  profile: (user) => user.isInstanceAdmin,
  navigation: (user) => user.isInstanceAdmin,
  workflows: (user) => user.isInstanceAdmin,
  actions: (user) => user.isInstanceAdmin,
};
