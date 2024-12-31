import { action, makeAutoObservable, observable } from "mobx";
import { createContext } from "react";
import { IUserPreference } from "../models/shared";
import { User } from "../models/Accounts";

class AllUsersStore {
  public users: User[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public addUser(user: User) {
    const foundAt = this.users.findIndex((i) => i.id === user.id);
    if (foundAt !== -1) {
      this.users[foundAt] = user;
    } else {
      this.users.push(user);
    }
  }

  reset() {
    this.users = [];
  }

  getById(id: string) {
    return this.users.find((i) => i.id === id);
  }
}

export const AllUserStoreContext = createContext(new AllUsersStore());
