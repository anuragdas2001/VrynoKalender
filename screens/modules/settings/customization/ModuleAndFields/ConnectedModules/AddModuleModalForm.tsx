import React, { Dispatch, SetStateAction } from "react";
import ModuleCreationForm from "./ModuleCreationForm/ModuleCreationForm";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

type AddModuleFormProps = {
  visible?: boolean;
  modulesFetched: IModuleMetadata[];
  setAddModuleModal: Dispatch<SetStateAction<AddModuleStateType>>;
  savingProcess: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  handleModuleCreation: (values: Record<string, string>) => Promise<void>;
};
export const AddModuleModalForm = ({
  visible = false,
  setAddModuleModal,
  modulesFetched,
  savingProcess,
  genericModels,
  allLayoutFetched,
  handleModuleCreation,
}: AddModuleFormProps) => {
  return visible ? (
    <>
      <GenericFormModalContainer
        formHeading="Add Module"
        onOutsideClick={() => setAddModuleModal({ visible: false, data: {} })}
        limitWidth={true}
        onCancel={() => setAddModuleModal({ visible: false, data: {} })}
      >
        <ModuleCreationForm
          saveLoading={savingProcess}
          handleSave={(values) => handleModuleCreation(values)}
          onCancel={() => setAddModuleModal({ visible: false, data: {} })}
          editMode={false}
          modulesFetched={modulesFetched}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
        />
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => setAddModuleModal({ visible: false, data: {} })}
      />
    </>
  ) : null;
};

export interface AddModuleStateType {
  visible: boolean;
  data: Record<string, string>;
}
