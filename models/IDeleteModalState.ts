export interface IDeleteModalState {
  visible: boolean;
  id: string | null | undefined;
  modalHeader: string;
  modalMessage: string;
  leftButton: string;
  rightButton: string;
}
