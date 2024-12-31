import { ICustomField } from "../../../../../../models/ICustomField";
import { IUserPreference } from "../../../../../../models/shared";

export type ConnectedNotesProps = {
  appName: string;
  modelName: string;
  recordId: string;
  status: string;
  fieldsList: ICustomField[];
  id: string;
  notesCount?: number;
  userPreferences: IUserPreference[];
  setNotesCount?: (count: number) => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  quickCreateNoteModal: boolean;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
};
