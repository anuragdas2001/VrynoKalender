import { User } from "../../models/Accounts";

export const getFullUserName = (user: Partial<User> | null) => {
  let fullName = "";
  if (user?.firstName) {
    fullName += user?.firstName;
    if (user?.middleName) {
      fullName += " " + user?.middleName;
      if (user?.lastName) {
        fullName += " " + user?.lastName;
      }
    } else {
      if (user?.lastName) {
        fullName += " " + user?.lastName;
      }
    }
  } else if (user?.middleName) {
    fullName += user?.middleName;
    if (user?.lastName) {
      fullName += " " + user?.lastName;
    }
  } else {
    fullName += user?.lastName;
  }
  return fullName;
};
