import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { IUserPreference } from "../models/shared";
import { User } from "../models/Accounts";
import { MixpanelActions } from "../screens/Shared/MixPanel";

const mixPanelUserStoreAction = (user: User) => {
  if (user.userId) {
    MixpanelActions.identify(user.userId);
    MixpanelActions.people.set({ userId: user.userId });
    MixpanelActions.registerOnce({ userId: user.userId });
  }
  let foundAtTheRate = false;
  MixpanelActions.register({
    userEmail:
      user.email
        ?.split("")
        ?.map((value, index) => {
          if (value === "@") foundAtTheRate = true;
          return foundAtTheRate || index == 0 || index == 1 ? value : "*";
        })
        .join("") || "",
  });
};
class UserStore {
  public userPreference: IUserPreference | null = null;
  public user: User | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUser(user: User) {
    this.user = user;
    window.localStorage.setItem("user", JSON.stringify(user));
    mixPanelUserStoreAction(user);
  }

  updateUserInfo(user: User) {
    const updatedUser = { ...this.user, ...user };
    this.user = updatedUser;
    window.localStorage.setItem("user", JSON.stringify(this.user));
  }

  get formattedUserName(): string {
    if (this.user) {
      return `${this.user.firstName || ""} ${this.user.middleName || ""} ${
        this.user.lastName || ""
      }`;
    }
    return "";
  }

  get userInitials(): string {
    const firstName = this.user?.firstName;
    const lastName = this.user?.lastName;
    return `${firstName ? firstName[0] : ""}${
      lastName ? lastName[0] : ""
    }`.toUpperCase();
  }

  get userId(): string | undefined {
    return this.user?.id;
  }

  public setPreference(userPreference: IUserPreference) {
    this.userPreference = userPreference;
  }
}

export const UserStoreContext = createContext(new UserStore());
