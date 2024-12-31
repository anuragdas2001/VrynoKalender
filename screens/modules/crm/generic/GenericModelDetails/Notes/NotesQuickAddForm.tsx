import { Formik, FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormFilePicker from "../../../../../../components/TailwindControls/Form/FileDropper/FormFilePicker";
import FormRichTextEditor from "../../../../../../components/TailwindControls/Form/RichTextEditor/FormRichTextEditor";
import { INote } from "../../../../../../models/INote";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { useMutation } from "@apollo/client";
import { SupportedApps } from "../../../../../../models/shared";
import { toast } from "react-toastify";
import { uploadFileToModule } from "./NotesList";

export const NotesQuickAddForm = ({
  selectedNote,
  setEditMode,
  editMode,
  clearFiles,
  handleEditNote,
  setClearFiles,
  resetClearFiles,
  noteSuggestions,
  noteDeleteLoading,
  setSelected,
  modelName,
  recordId,
  notesCount,
  setNotesCount,
  setNotesList,
  notes,
  showLabel,
  setQuickCreateNoteModal,
}: {
  selectedNote: Record<string, any> | null;
  setEditMode: (value: boolean) => void;
  editMode: boolean;
  clearFiles: boolean;
  handleEditNote: (value: INote | null) => void;
  setClearFiles: (value: boolean) => void;
  resetClearFiles: (value: boolean) => void;
  noteSuggestions: {
    items: ({ query }: { query: any }) => any;
    render: () => {
      onStart: (props: any) => void;
      onUpdate(props: any): void;
      onKeyDown(props: any): any;
      onExit(): void;
    };
  };
  noteDeleteLoading: boolean;
  setSelected: (value: INote | null) => void;
  modelName: string;
  recordId: string;
  notesCount: number;
  setNotesCount: (count: number) => void;
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>;
  notes: INote[];
  showLabel: boolean;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const [disabled, setDisabled] = React.useState(false);
  const [noteSaveLoading, setNoteSaveLoading] = React.useState(false);

  const [saveNote] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const handleCreateNote = async (values: FormikValues) => {
    setNoteSaveLoading(true);
    let isSuccess = false;
    const saveInput = {
      note: values?.note ? values.note : null,
      attachment: values?.attachment ? values.attachment : null,
      relatedTo: [
        {
          moduleName: modelName,
          recordId: recordId,
        },
      ],
    };
    try {
      await saveNote({
        variables: {
          id: selectedNote?.id,
          modelName: "Note",
          saveInput: saveInput,
        },
      }).then(async (resp) => {
        if (
          resp.data.save.data &&
          resp.data.save.data.id &&
          resp.data.save.messageKey.includes("success")
        ) {
          toast.success(resp.data.save.message);
          setNotesCount(notesCount + 1);
          setNotesList([
            resp.data.save.data,
            ...notes.filter((val) => val.id !== resp.data.save.data.id),
          ]);
          setClearFiles(true);
          setSelected(null);
          setEditMode(false);
          isSuccess = true;
          setQuickCreateNoteModal(false);
        } else if (resp.data.save.messageKey) {
          toast.error(resp.data.save.message);
        } else {
          toast.error(t("common:unknown-message"));
        }
        setNoteSaveLoading(false);
      });
    } catch (error) {
      console.error(error);
      setNoteSaveLoading(false);
    }
    return isSuccess;
  };

  return (
    <div
      className={`w-full h-full overflow-scroll ${
        !showLabel ? "pb-4" : "pb-8 lg:pb-0"
      }`}
    >
      <form className="mt-4 lg:mb-2" onSubmit={(e) => e.preventDefault()}>
        {
          <Formik
            enableReinitialize
            initialValues={{
              note: null,
              attachment: null,
              "quick-note": selectedNote?.note || null,
              "quick-attachment": selectedNote?.attachment || null,
            }}
            // validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              if (values["quick-note"] || values["quick-attachment"]) {
                handleCreateNote({
                  ...values,
                  note: values["quick-note"],
                  attachment: values["quick-attachment"],
                }).then((response) => {
                  if (response)
                    resetForm({
                      values: {
                        "quick-note": null,
                        note: null,
                        attachment: null,
                        "quick-attachment": null,
                      },
                    });
                });
              }
            }}
          >
            {({ handleSubmit, setFieldValue }) => (
              <>
                <FormRichTextEditor
                  data={selectedNote?.note}
                  handleNoteChange={(value) => {
                    setFieldValue("quick-note", value);
                  }}
                  name="quick-note"
                  label={!showLabel ? "" : editMode ? "Edit note" : "Add Note"}
                  showImage={false}
                  allowMargin={false}
                  editMode={editMode}
                  clearFiles={clearFiles}
                  handleClearState={resetClearFiles}
                  supportMentions={true}
                  mentionSuggestions={noteSuggestions}
                />
                <div
                  className={`md:flex md:flex-row items-center gap-x-6 ${
                    !showLabel ? "mt-4" : ""
                  }`}
                >
                  <FormFilePicker
                    allowMultiple={false}
                    name="quick-attachment"
                    label="Attachment"
                    editMode={editMode}
                    clearFiles={clearFiles}
                    modelNameToBeUsed={uploadFileToModule}
                    handleClearState={resetClearFiles}
                    setDisabled={setDisabled}
                  />
                  <div className="basis-1/4 ml-auto">
                    <Button
                      buttonType="thin"
                      id="save-form"
                      onClick={() => {
                        setFieldValue("quick-note", undefined);
                        setFieldValue("quick-attachment", undefined);
                        setClearFiles(true);
                        setSelected(null);
                        setEditMode(false);
                      }}
                      kind="back"
                      loading={false}
                      disabled={disabled}
                      userEventName="notes-clear-field-data-click"
                    >
                      {t("common:Clear")}
                    </Button>
                  </div>
                  <div className="mt-2 md:mt-0 basis-1/4">
                    <Button
                      buttonType="thin"
                      id="save-form"
                      onClick={() => {
                        handleSubmit();
                      }}
                      kind="next"
                      disabled={
                        noteSaveLoading || noteDeleteLoading || disabled
                      }
                      loading={noteSaveLoading || noteDeleteLoading}
                      userEventName="notes-save:submit-click"
                    >
                      {t("common:save")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Formik>
        }
      </form>
    </div>
  );
};
