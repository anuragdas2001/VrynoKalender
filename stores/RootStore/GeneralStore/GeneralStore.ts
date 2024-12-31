import { createContext } from "react";
import { GenericModalStore } from "./GenericModelStore";

export class GeneralStore {
  generalModelStore = new GenericModalStore(this);
}

export const GeneralStoreContext = createContext(new GeneralStore());
