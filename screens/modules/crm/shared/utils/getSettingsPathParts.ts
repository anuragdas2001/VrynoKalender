import { useRouter } from "next/router";
import {
  ModuleFieldsItems,
  NavigationItems,
  SettingsMenuItem,
} from "../../../../../models/Settings";

/* Check if string is valid UUID */
export function checkIfValidUUID(str: string | Object) {
  // Regular expression to check if string is a valid UUID
  if (typeof str === "object") return false;
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
}

const idCheckerPerMenuItem: Partial<
  Record<SettingsMenuItem, (input: string) => boolean>
> = {
  "module-fields": (input: string) =>
    ![ModuleFieldsItems.fields.toString()].includes(input),
  navigation: (input: string) =>
    ![NavigationItems.navigationGroupItems.toString()].includes(input),
};

export const getSettingsPathParts = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { query } = useRouter();
  const [appName, menuItem, ...additionalParts] =
    (query?.slug as string[]) ?? [];
  const recordId = additionalParts.length > 0 ? additionalParts.pop() : "";
  let id = (recordId ? recordId : "").toLowerCase();
  const idChecker =
    idCheckerPerMenuItem[menuItem as SettingsMenuItem] || checkIfValidUUID;
  if (id && !idChecker(id)) {
    additionalParts.push(id.slice());
    id = "";
  }
  return {
    appName: appName?.toLowerCase(),
    menuItem: menuItem?.toLowerCase(),
    id,
    additionalParts: additionalParts.map((val: string) => val?.toLowerCase()),
  };
};
