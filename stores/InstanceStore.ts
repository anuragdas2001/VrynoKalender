import { IInstance } from "../models/Accounts";
import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class InstanceStore {
  public instances: IInstance[] = [];
  public itemsCount: number = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setItemsCount(itemsCount: number) {
    this.itemsCount = itemsCount;
  }

  public addInstance(instance: IInstance) {
    const foundAt = this.instances.findIndex((i) => i?.id === instance.id);
    if (foundAt !== -1) {
      this.instances[foundAt] = instance;
    } else {
      this.instances.push(instance);
    }
  }

  importAllInstances(
    instances: IInstance[],
    pageNumber: number,
    itemsCount: number,
    pageSize = 50
  ) {
    let updatedInstanceDataArray =
      this.instances.length > 0
        ? [...this.instances]
        : Array(itemsCount).fill(null);
    for (let index = 0; index < pageSize; index++) {
      updatedInstanceDataArray.splice(
        (pageNumber - 1) * pageSize + index,
        1,
        instances?.[index] ?? null
      );
    }
    this.instances = updatedInstanceDataArray;
  }

  importInstances(instances: IInstance[]) {
    instances.forEach((instance) => {
      this.addInstance(instance);
    });
  }

  removeInstance(id: string) {
    this.instances = this.instances.filter((i) => i?.id !== id);
  }

  resetInstances() {
    this.instances = [];
  }

  getById(id: string | string[]) {
    return this.instances.find((i) => i?.id === id);
  }
}

export const InstanceStoreContext = createContext(new InstanceStore());
