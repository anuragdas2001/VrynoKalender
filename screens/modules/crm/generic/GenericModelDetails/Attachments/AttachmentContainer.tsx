import { IDeleteModalState } from "../../GenericModelView/GenericModalCardItems";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import AttachmentForm from "./AttachmentForm";
import LinkForm from "./LinkForm";
import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import React from "react";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { useMutation } from "@apollo/client";
import { IFile } from "../../../../../../models/IFile";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FormikValues } from "formik";
import { AttachmentContent } from "./AttachmentContent";
import { IUserPreference } from "../../../../../../models/shared";
import { IAttachmentModal } from "./attachmentHelper";

export const AttachmentContainer = ({
  setAttachmentMenuVisible,
  attachmentMenuVisible,
  cardHeading,
  setAddAttachmentModalForm,
  setAttachmentsCount,
  attachmentsCount,
  appName,
  modelName,
  id,
  setAttachments,
  attachments,
  setAddAttachmentUrlModalForm,
  attachmentFieldList,
  addAttachmentUrlModalForm,
  userPreferences,
  handleFormSave,
  savingProcess,
  addAttachmentModalForm,
  handleOpenCollapseCardContainer = () => {},
  attachmentDataLoading,
  handleAttachmentLoadMoreClicked,
}: {
  attachmentMenuVisible: boolean;
  cardHeading: string;
  attachmentsCount: number;
  appName: string;
  modelName: string;
  id: string;
  attachments: IFile[];
  attachmentFieldList: ICustomField[];
  addAttachmentUrlModalForm: IAttachmentModal;
  savingProcess: boolean;
  addAttachmentModalForm: IAttachmentModal;
  userPreferences: IUserPreference[];
  setAttachmentMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAttachmentsCount: (count: number) => void;
  setAttachments: React.Dispatch<React.SetStateAction<IFile[]>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  handleFormSave: (values: FormikValues, id: string | null) => Promise<void>;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  attachmentDataLoading: boolean;
  handleAttachmentLoadMoreClicked: () => void;
}) => {
  const { t } = useTranslation(["common"]);
  const [deleteModal, setDeleteModal] = React.useState<IDeleteModalState>({
    visible: false,
    id: "",
  });

  const [
    serverDeleteData,
    { loading: deleteProcessing, error: deleteError, data: deleteData },
  ] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.data) {
        setDeleteModal({ visible: false, id: "" });
        setAttachmentsCount(attachmentsCount - 1);
        setAttachments(
          attachments.filter(
            (attachment: IFile) =>
              attachment.id !== responseOnCompletion.save.data.id
          )
        );
        toast.success(responseOnCompletion?.save?.message);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion?.save?.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });
  return (
    <>
      <AttachmentContent
        cardHeading={cardHeading}
        modelName={modelName}
        id={id}
        attachmentMenuVisible={attachmentMenuVisible}
        setAttachmentMenuVisible={setAttachmentMenuVisible}
        setAddAttachmentModalForm={setAddAttachmentModalForm}
        setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
        attachmentFieldList={attachmentFieldList}
        attachments={attachments}
        userPreferences={userPreferences}
        setDeleteModal={setDeleteModal}
        handleOpenCollapseCardContainer={(id, showDetails) =>
          handleOpenCollapseCardContainer(id, showDetails)
        }
        attachmentDataLoading={attachmentDataLoading}
        attachmentsCount={attachmentsCount}
        handleAttachmentLoadMoreClicked={handleAttachmentLoadMoreClicked}
      />
      {addAttachmentUrlModalForm.visible && (
        <>
          <GenericFormModalContainer
            formHeading={
              Object.keys(addAttachmentUrlModalForm.data).length
                ? "Edit Link"
                : "Add Link"
            }
            onOutsideClick={() =>
              setAddAttachmentUrlModalForm({
                visible: false,
                data: {},
                id: null,
              })
            }
            limitWidth={true}
            onCancel={() =>
              setAddAttachmentUrlModalForm({
                visible: false,
                data: {},
                id: null,
              })
            }
          >
            <LinkForm
              data={
                Object.keys(addAttachmentUrlModalForm.data).length
                  ? addAttachmentUrlModalForm.data
                  : {}
              }
              saveLoading={savingProcess}
              handleSave={(values) =>
                handleFormSave(values, addAttachmentUrlModalForm.id)
              }
              onCancel={() =>
                setAddAttachmentUrlModalForm({
                  visible: false,
                  data: {},
                  id: null,
                })
              }
              editMode={
                Object.keys(addAttachmentUrlModalForm.data).length
                  ? true
                  : false
              }
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setAddAttachmentUrlModalForm({
                visible: false,
                data: {},
                id: null,
              })
            }
          />
        </>
      )}
      {addAttachmentModalForm.visible && (
        <>
          <GenericFormModalContainer
            formHeading={
              Object.keys(addAttachmentModalForm.data).length
                ? "Edit File"
                : "Upload File"
            }
            onOutsideClick={() =>
              setAddAttachmentModalForm({ visible: false, data: {}, id: null })
            }
            limitWidth={true}
            onCancel={() =>
              setAddAttachmentModalForm({ visible: false, data: {}, id: null })
            }
          >
            <AttachmentForm
              data={
                Object.keys(addAttachmentModalForm.data).length
                  ? addAttachmentModalForm.data
                  : {}
              }
              saveLoading={savingProcess}
              handleSave={(values) =>
                handleFormSave(values, addAttachmentModalForm.id)
              }
              onCancel={() =>
                setAddAttachmentModalForm({
                  visible: false,
                  data: {},
                  id: null,
                })
              }
              editMode={
                Object.keys(addAttachmentModalForm.data).length ? true : false
              }
              modelName={modelName}
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setAddAttachmentModalForm({ visible: false, data: {}, id: null })
            }
          />
        </>
      )}
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader={`Delete Attachment`}
            modalMessage={`Are you sure you want to delete this Attachment?`}
            leftButton="Cancel"
            rightButton="Delete"
            loading={deleteProcessing}
            onCancel={() => setDeleteModal({ visible: false, id: "" })}
            onDelete={(id) => {
              serverDeleteData({
                variables: {
                  id: deleteModal.id,
                  modelName: "Attachment",
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              }).then();
            }}
            onOutsideClick={() => setDeleteModal({ visible: false, id: "" })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: "" })}
          />
        </>
      )}
    </>
  );
};
