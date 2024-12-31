import React from "react";
import { ActionWrapper } from "../crm/shared/components/ActionWrapper";
import { InstanceListActionComponent } from "./InstanceListActionComponent";
import { IInstance } from "../../../models/Accounts";
import { IDeleteModalState } from "../crm/generic/GenericModelView/GenericModalCardItems";
import { SampleModalType } from "./InstanceDashboard";

export type InstanceActionWrapperProps = {
  index: number;
  record: IInstance;
  instances: IInstance[];
  setInstanceLightbox: (value: IDeleteModalState) => void;
  setDeleteModal: (value: IDeleteModalState) => void;
  setRemoveSampleDataModal: (value: SampleModalType) => void;
};

export const InstanceActionWrapper = ({
  index,
  record,
  instances,
  setInstanceLightbox,
  setDeleteModal,
  setRemoveSampleDataModal,
}: InstanceActionWrapperProps) => {
  const [isDropdownUpward, setIsDropdownUpward] = React.useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });
  return (
    <ActionWrapper
      index={index}
      key={record.id}
      recordId={record?.id}
      content={
        <InstanceListActionComponent
          activeId={record.id}
          data={instances}
          setEditModal={(value) => setInstanceLightbox(value)}
          setDeleteModal={(value) => setDeleteModal(value)}
          setRemoveSampleDataModal={(value) => {
            setRemoveSampleDataModal(value);
          }}
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
        />
      }
      zIndexValue={
        isDropdownUpward.id === record?.id ? instances.length - index : 1
      }
    />
  );
};
