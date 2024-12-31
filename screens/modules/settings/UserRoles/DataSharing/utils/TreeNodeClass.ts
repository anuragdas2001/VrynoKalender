import { IProfileData } from "../../../../../../models/DataSharingModels";

export class TreeNodeClass {
  data: IProfileData;
  parentNode: TreeNodeClass | null;
  childNodes: TreeNodeClass[];

  constructor(data: IProfileData) {
    this.data = data;
    this.parentNode = null;
    this.childNodes = [];
  }

  addParentNode(parentNode: TreeNodeClass) {
    this.parentNode = parentNode;
  }

  addChildNode(childNode: TreeNodeClass) {
    this.childNodes.push(childNode);
  }
}
