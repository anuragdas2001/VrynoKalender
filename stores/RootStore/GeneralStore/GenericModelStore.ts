import { ICustomField } from "./../../../models/ICustomField";
import { ICustomView, IUserPreference } from "../../../models/shared";
import { makeAutoObservable } from "mobx";
import { GeneralStore } from "./GeneralStore";
import { ILayout } from "../../../models/ILayout";
import { IModuleMetadata } from "../../../models/IModuleMetadata";
import { ICustomViewFilter } from "../../../screens/modules/crm/generic/GenericAddCustomView/customViewHelpers/customFilterHelper";
import _ from "lodash";

interface GenericModel {
  customViews: ICustomView[];
  moduleInfo: IModuleMetadata;
  moduleData: { [customViewId: string]: any[] };
  itemsCount: { [customViewId: string]: number };
  layouts: ILayout[];
  initialLoad: boolean;
  pageDataLoaded: { [customViewId: string]: { [pageNumber: number]: boolean } };
  currentPageNumber: number;
  pageSize: number;
  currentCustomViewId: string | undefined;
  currentCustomViewFilter: {
    filters: ICustomViewFilter[];
    expression: string | null;
  };
  defaultCustomViewId: string | undefined;
  currentCustomView: ICustomView | undefined;
  customViewsLoaded: boolean;
  customViewPermission: boolean;
  moduleViewPermission: boolean;
  fieldsList: ICustomField[];
}

export interface IGenericModel {
  [moduleName: string]: GenericModel;
}
export class GenericModalStore {
  public genericModels: IGenericModel = {};
  public userPreferences: IUserPreference[] = [];
  public allLayoutFetched: boolean = false;
  public allModulesFetched: boolean = false;
  public moduleViewPermission: boolean = true;
  // pageSize = Number(process.env.NEXT_PUBLIC_PAGESIZE);
  generalStore: GeneralStore;
  constructor(generalStore: GeneralStore) {
    this.generalStore = generalStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public importUserPreferences(userPreferences: IUserPreference[]) {
    this.userPreferences = userPreferences;
  }

  //Method to update allLayoutFetched property
  public setAllLayoutFetchStatus(value: boolean) {
    this.allLayoutFetched = value;
  }

  public setAllModulesFetchedStatus(value: boolean) {
    this.allModulesFetched = value;
  }

  public setAllModuleViewPermission(value: boolean) {
    this.moduleViewPermission = value;
  }

  // Method to help remove module data completely
  public deleteModule(moduleName: string) {
    delete this.genericModels[moduleName];
  }

  // Methods to help add, update, delete layouts
  public importModuleLayouts(layouts: ILayout[], moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].layouts = layouts;
  }

  // Methods to help add, update, delete module info
  public importModuleInfo(moduleInfo: IModuleMetadata, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    let updatedModuleInfo = { ...this.genericModels[moduleName].moduleInfo };
    updatedModuleInfo = { ...updatedModuleInfo, ...moduleInfo };
    this.genericModels[moduleName].moduleInfo = updatedModuleInfo;
  }

  // Methods to manipulate fields list of a module
  public importFields(fieldsList: ICustomField[], moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].fieldsList = [...fieldsList];
  }

  // Check for View Permission in module view
  public setModuleViewPermission(permission: boolean, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].moduleViewPermission = permission;
  }

  // Check for Custom View Permission in custom view permission
  public setCustomViewPermission(permission: boolean, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].customViewPermission = permission;
  }

  // set custom views loading
  public setCustomViewsLoaded(loading: boolean, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].customViewsLoaded = loading;
  }

  // set current custom view Id
  public setCurrentCustomViewId(
    customViewId: string | undefined,
    moduleName: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].currentCustomViewId = customViewId;
  }

  // set current custom view Filter
  public setCurrentCustomViewFilter(
    customViewFilterData: {
      filters: ICustomViewFilter[];
      expression: string | null;
    },
    moduleName: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].currentCustomViewFilter =
      customViewFilterData;
  }

  // set default custom view Id
  public setDefaultCustomViewId(
    customViewId: string | undefined,
    moduleName: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].defaultCustomViewId = customViewId;
  }

  // Set current custom View in module
  public setCurrentCustomView(
    customView: ICustomView | undefined,
    moduleName: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].currentCustomView = customView;
  }

  // setCurrent custom view by Id in module
  public setCurrentCustomViewById(customViewId: string, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    let customViews = this.genericModels[moduleName].customViews
      ? [...this.genericModels[moduleName].customViews]
      : [];
    for (let index = 0; index < customViews.length; index++) {
      if (customViews[index].id === customViewId) {
        this.setCurrentCustomView(customViews[index], moduleName);
      }
    }
  }

  // Check for initial Load of module data
  public setInitialModuleLoading(initialLoad: boolean, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].initialLoad = initialLoad;
  }

  // Import custom views list for module
  public importCustomViews(customViews: ICustomView[], moduleName: string) {
    customViews.forEach((customView) => {
      this.addCustomView(customView, moduleName);
    });
  }

  // Add Custom view to module
  public addCustomView(customView: ICustomView, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    let customViews = this.genericModels[moduleName].customViews
      ? [...this.genericModels[moduleName].customViews]
      : [];
    const foundAt = customViews.findIndex((i) => i.id === customView.id);
    if (foundAt !== -1) {
      customViews[foundAt] = customView;
    } else {
      customViews.unshift(customView);
    }
    this.genericModels[moduleName].customViews = customViews;
  }

  // Remove custom view to module
  public removeCustomView(customView: ICustomView, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    let customViews = this.genericModels[moduleName].customViews
      ? [...this.genericModels[moduleName].customViews]
      : [];
    customViews = customViews.filter((view) => view.id !== customView.id);
    this.genericModels[moduleName].customViews = customViews;
  }

  // Update current Page Number
  public setCurrentModulePageNumber(pageNumber: number, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].currentPageNumber = pageNumber;
  }

  // Update current Page Size
  public setCurrentModulePageSize(pageSize: number, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].pageSize = pageSize;
  }

  public resetCurrentModuleData(moduleName: string) {
    this.genericModels[moduleName].moduleData[
      this.genericModels[moduleName]?.currentCustomViewId ?? "default-view"
    ] = [];
  }

  // Update Items count
  public setItemsCount(
    itemsCount: number,
    moduleName: string,
    customViewId: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].itemsCount = {
      ...this.genericModels[moduleName].itemsCount,
    };
    this.genericModels[moduleName].itemsCount[customViewId] = itemsCount;
  }

  // Check for pageDataLoaded of module data
  public setCurrentPageDataLoading(
    initialLoad: boolean,
    moduleName: string,
    pageNumber: number,
    customViewId: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].pageDataLoaded = {
      ...this.genericModels[moduleName].pageDataLoaded,
    };
    this.genericModels[moduleName].pageDataLoaded[customViewId] = {
      ...this.genericModels[moduleName].pageDataLoaded[customViewId],
    };
    this.genericModels[moduleName].pageDataLoaded[customViewId][pageNumber] =
      initialLoad;
  }

  // Methods to handle model data per custom view Id
  public importModuleDataByCustomViewId(
    moduleData: any[],
    pageNumber: number,
    moduleName: string,
    itemsCount: number,
    currentViewId: string
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].moduleData = {
      ...this.genericModels[moduleName].moduleData,
    };
    this.genericModels[moduleName].moduleData[currentViewId] = this
      .genericModels[moduleName].moduleData[currentViewId]
      ? [...this.genericModels[moduleName].moduleData[currentViewId]]
      : [];
    let updatedModuleDataArray =
      this.genericModels[moduleName].moduleData[currentViewId].length > 0
        ? [...this.genericModels[moduleName].moduleData[currentViewId]]
        : Array(itemsCount).fill(null);

    const pageSizeOfModule =
      this.genericModels?.[moduleName]?.pageSize ||
      Number(process.env.NEXT_PUBLIC_PAGESIZE);
    for (let index = 0; index < pageSizeOfModule; index++) {
      updatedModuleDataArray.splice(
        (pageNumber - 1) * pageSizeOfModule + index,
        1,
        moduleData[index] ?? null
      );
    }
    this.genericModels[moduleName].moduleData[currentViewId] =
      updatedModuleDataArray;
  }

  public addModuleData(moduleData: any, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].moduleData = {
      ...this.genericModels[moduleName].moduleData,
    };
    this.genericModels[moduleName].itemsCount = {
      ...this.genericModels[moduleName].itemsCount,
    };
    let allModuleData = { ...this.genericModels[moduleName].moduleData };

    for (let customViewId in this.genericModels[moduleName].moduleData) {
      allModuleData[customViewId] = allModuleData[customViewId] ?? [];
      allModuleData[customViewId] = [moduleData].concat(
        allModuleData[customViewId]
      );
      this.genericModels[moduleName].itemsCount[customViewId] =
        this.genericModels[moduleName].itemsCount[customViewId] + 1;
    }
    this.genericModels[moduleName].moduleData = { ...allModuleData };
  }

  public updateModuleData(
    moduleData: any,
    moduleName: string,
    fieldNameToUpdate?: string[]
  ) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].moduleData = {
      ...this.genericModels[moduleName].moduleData,
    };

    let allModuleData = { ...this.genericModels[moduleName].moduleData };
    for (let customViewId in this.genericModels[moduleName].moduleData) {
      allModuleData[customViewId] = allModuleData[customViewId] ?? [];
      for (
        let index = 0;
        index < this.genericModels[moduleName].moduleData[customViewId].length;
        index++
      ) {
        let foundAt = allModuleData[customViewId].findIndex(
          (data) => data?.id === moduleData.id
        );
        if (typeof foundAt === "number" && foundAt !== -1) {
          if (fieldNameToUpdate && fieldNameToUpdate?.length > 0) {
            for (let fieldName of [
              ...fieldNameToUpdate?.filter((field) => field),
            ]) {
              allModuleData[customViewId][foundAt][fieldName] =
                moduleData[fieldName];
            }
          } else {
            allModuleData[customViewId][foundAt] = moduleData;
          }
        }
      }
    }
    this.genericModels[moduleName].moduleData = { ...allModuleData };
  }

  public removeModuleDataById(moduleDataById: any, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].moduleData = {
      ...this.genericModels[moduleName].moduleData,
    };
    this.genericModels[moduleName].itemsCount = {
      ...this.genericModels[moduleName].itemsCount,
    };

    let allModuleData = { ...this.genericModels[moduleName].moduleData };
    for (let customViewId in this.genericModels[moduleName].moduleData) {
      for (
        let index = 0;
        index < this.genericModels[moduleName].moduleData[customViewId].length;
        index++
      ) {
        let foundAt = allModuleData[customViewId].findIndex(
          (data) => data?.id === moduleDataById
        );
        allModuleData[customViewId] = allModuleData[customViewId].filter(
          (data) => data?.id !== moduleDataById
        );
        if (foundAt !== -1) {
          this.genericModels[moduleName].itemsCount[customViewId] =
            this.genericModels[moduleName].itemsCount[customViewId] - 1;
        }
      }
    }
    this.genericModels[moduleName].moduleData = { ...allModuleData };
  }

  public fetchModuleDataById(id: string | undefined, moduleName: string) {
    this.genericModels[moduleName] = { ...this.genericModels[moduleName] };
    this.genericModels[moduleName].moduleData = {
      ...this.genericModels[moduleName].moduleData,
    };
    let customViewId = this.genericModels[moduleName].currentCustomViewId;

    if (customViewId) {
      let moduleData =
        this.genericModels[moduleName].moduleData[customViewId] &&
        this.genericModels[moduleName].moduleData[customViewId].length > 0
          ? [...this.genericModels[moduleName].moduleData[customViewId]]
          : [];
      const foundAt = moduleData.findIndex((data) => data?.id === id);
      if (foundAt !== -1) {
        return moduleData[foundAt];
      } else {
        return {};
      }
    } else {
      return {};
    }
  }
}
