import RoleCreationForm from "./RoleCreationForm";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IRole } from "../../../../../../models/shared";
import { Dispatch, SetStateAction } from "react";
import { FormikValues } from "formik";

export interface IAddRoleModalVisible {
  visible: boolean;
  data: IRole | null;
}

export const AddRoleModal = ({
  addRoleModalVisible,
  setAddRoleModalVisible,
  handleRoleCreation,
  userRoles,
  savingProcess,
}: {
  addRoleModalVisible: IAddRoleModalVisible;
  setAddRoleModalVisible: (value: IAddRoleModalVisible) => void;
  handleRoleCreation: (values: FormikValues) => void;
  userRoles: IRole[];
  savingProcess: boolean;
}) => {
  if (!addRoleModalVisible.visible) {
    return null;
  }

  const roleModalDataLength = Object.keys(
    addRoleModalVisible?.data || {}
  ).length;

  return (
    <>
      <GenericFormModalContainer
        formHeading={roleModalDataLength ? "Edit Role" : "Add Role"}
        onOutsideClick={() =>
          setAddRoleModalVisible({ visible: false, data: null })
        }
        limitWidth={true}
        onCancel={() => setAddRoleModalVisible({ visible: false, data: null })}
      >
        <RoleCreationForm
          userRoles={userRoles.map((obj) => {
            return { value: obj.key, label: obj.role };
          })}
          data={roleModalDataLength ? addRoleModalVisible.data : null}
          saveLoading={savingProcess}
          handleSave={(values) => handleRoleCreation(values)}
          onCancel={() =>
            setAddRoleModalVisible({ visible: false, data: null })
          }
          editMode={roleModalDataLength ? true : false}
        />
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => setAddRoleModalVisible({ visible: false, data: null })}
      />
    </>
  );
};
