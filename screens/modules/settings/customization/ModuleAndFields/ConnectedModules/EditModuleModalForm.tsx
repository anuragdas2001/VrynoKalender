import { FormikValues } from "formik";
import React, { Dispatch, SetStateAction } from "react";
import ModuleCreationForm from "./ModuleCreationForm/ModuleCreationForm";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

type EditModuleModalProps = {
  data: IModuleMetadata | null;
  appName: string;
  editMode?: boolean;
  modulesFetched: IModuleMetadata[];
  visible?: boolean;
  setAddModuleModal: Dispatch<SetStateAction<AddModuleStateType>>;
  savingProcess: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  handleModuleCreation: (values: FormikValues) => void;
};
export const EditModuleModalForm = ({
  data,
  appName,
  editMode = false,
  visible = false,
  modulesFetched,
  setAddModuleModal,
  savingProcess,
  genericModels,
  allLayoutFetched,
  handleModuleCreation,
}: EditModuleModalProps) => {
  return visible ? (
    <>
      <GenericFormModalContainer
        formHeading={`${editMode ? "Edit" : "Add"} Module`}
        onOutsideClick={() => setAddModuleModal({ visible: false, data: null })}
        limitWidth={true}
        onCancel={() => setAddModuleModal({ visible: false, data: null })}
      >
        <ModuleCreationForm
          appName={appName}
          moduleData={data}
          modulesFetched={modulesFetched}
          saveLoading={savingProcess}
          handleSave={(values) => handleModuleCreation(values)}
          onCancel={() => setAddModuleModal({ visible: false, data: null })}
          editMode={editMode}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
        />
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => setAddModuleModal({ visible: false, data: null })}
      />
    </>
  ) : null;
};

export interface AddModuleStateType {
  visible: boolean;
  data: IModuleMetadata | null;
}
