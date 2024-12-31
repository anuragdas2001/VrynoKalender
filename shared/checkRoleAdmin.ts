import { IRole } from "../models/shared";

export const checkRoleAdmin = (userRoleIds: string[], rolesList: IRole[]) => {
  if (!userRoleIds?.length || !rolesList?.length) return false;
  const adminRole = rolesList.filter((val) => {
    if (val.key === "instance-admin") {
      return val;
    }
  });
  if (adminRole.length === 0) {
    return false;
  }
  if (adminRole.length > 1) {
    throw Error("Admin role should only be one");
  }
  if (userRoleIds.includes(adminRole[0].id)) {
    return true;
  } else {
    return false;
  }
};
