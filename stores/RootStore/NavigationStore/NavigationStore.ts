import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { INavigation } from "../../../models/INavigation";

class NavigationStore {
  public navigations: INavigation[] = [];
  public navbarColor: string = "#FFFFFF";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public addNavigation(navigation: INavigation, addItemAtIndex?: number) {
    if (!this.navigations.find((n) => n.uniqueName === navigation.uniqueName)) {
      if (addItemAtIndex === 0) {
        this.navigations.unshift(navigation);
      } else if (addItemAtIndex && addItemAtIndex >= 0) {
        this.navigations.splice(addItemAtIndex, 0, navigation);
      } else this.navigations.push(navigation);
    }
  }

  public importNavigations(
    navigations: INavigation[],
    addItemAtIndex?: number
  ) {
    navigations.forEach((instance) => {
      this.addNavigation(instance, addItemAtIndex);
    });
  }

  public updateNavigations(navigation: INavigation) {
    let newUpdatedNavigations = [...this.navigations];
    let updatedItemIndex = newUpdatedNavigations.findIndex(
      (item) => item.uniqueName === navigation.uniqueName
    );
    newUpdatedNavigations[updatedItemIndex] = navigation;
    this.navigations = newUpdatedNavigations;
  }

  public removeNavigation(moduleName: string) {
    this.navigations = this.navigations.filter(
      (i) => i?.navTypeMetadata?.moduleName !== moduleName
    );
  }

  public removeNavigationByUniqueName(uniqueName: string) {
    this.navigations = this.navigations.filter(
      (i) => i.uniqueName !== uniqueName
    );
  }

  public setNavbarColor(navbarColor: string) {
    this.navbarColor = navbarColor;
  }
}

export const NavigationStoreContext = createContext(new NavigationStore());
