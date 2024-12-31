import { IFile } from "../../../../../../models/IFile";
import { IUserPreference } from "../../../../../../models/shared";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export interface IAttachmentModal {
  visible: boolean;
  data: IFile | {};
  id: string | null;
}

export type ConnectedAttachmentProps = {
  cardHeading: string;
  appName: string;
  recordId: string;
  id: string;
  modelName: string;
  attachmentsCount?: number;
  userPreferences: IUserPreference[];
  setAttachmentsCount?: (count: number) => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  addAttachmentUrlModalForm: IAttachmentModal;
  addAttachmentModalForm: IAttachmentModal;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};
