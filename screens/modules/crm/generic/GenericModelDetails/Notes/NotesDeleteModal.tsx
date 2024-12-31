import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import React from "react";
import { useMutation } from "@apollo/client";
import { IDeleteModalState } from "../ActivityRelatedTo/activityRelatedToHelper";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { INote } from "../../../../../../models/INote";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function NotesDeleteModal({
  deleteModal,
  setDeleteModal,
  setNoteDeleteLoading,
  noteDeleteLoading,
  setNotesList,
  notes,
  appName,
  setNotesCount,
  notesCount,
  selectedNote,
  setClearFiles,
  setSelected,
}: {
  deleteModal: IDeleteModalState;
  setDeleteModal: (
    value:
      | ((prevState: IDeleteModalState) => IDeleteModalState)
      | IDeleteModalState
  ) => void;
  setNoteDeleteLoading: React.Dispatch<React.SetStateAction<boolean>>;
  noteDeleteLoading: boolean;
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>;
  notes: INote[];
  appName: string;
  setNotesCount: (count: number) => void;
  notesCount: number;
  selectedNote: Record<string, any> | null;
  setClearFiles: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: (value: INote | null) => void;
}) {
  const { t } = useTranslation(["common"]);
  const [serverDeleteData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.data) {
        setNotesList(
          notes.filter(
            (data: any) => data.id !== responseOnCompletion.save.data.id
          )
        );
        setNotesCount(notesCount - 1);
        if (responseOnCompletion.save.data.id === selectedNote?.id) {
          setClearFiles(true);
          setSelected(null);
        }
        toast.success(`${deleteModal.item.modelName} deleted successfully`);
        setDeleteModal({
          visible: false,
          item: { modelName: "", id: "" },
        });
        setNoteDeleteLoading(false);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion?.save?.message);
        setNoteDeleteLoading(false);
        return;
      }
      setNoteDeleteLoading(false);
      toast.error(t("common:unknown-message"));
    },
  });

  return (
    <>
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.item.id}
            modalHeader={`Delete ${deleteModal.item.modelName}`}
            modalMessage={`Are you sure you want to delete this ${deleteModal.item.modelName}?`}
            leftButton="Cancel"
            rightButton="Delete"
            loading={noteDeleteLoading}
            onCancel={() =>
              setDeleteModal({
                visible: false,
                item: { modelName: "", id: "" },
              })
            }
            onDelete={(id) => {
              setNoteDeleteLoading(true);
              serverDeleteData({
                variables: {
                  id: deleteModal.item.id,
                  modelName: deleteModal.item.modelName,
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              });
            }}
            onOutsideClick={() =>
              setDeleteModal({
                visible: false,
                item: { modelName: "", id: "" },
              })
            }
          />
          <Backdrop
            onClick={() =>
              setDeleteModal({
                visible: false,
                item: { modelName: "", id: "" },
              })
            }
          />
        </>
      )}
    </>
  );
}
