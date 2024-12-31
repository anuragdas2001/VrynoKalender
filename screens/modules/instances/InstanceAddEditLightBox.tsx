import { IDeleteModalState } from "../crm/generic/GenericModelView/exportGenericModelDashboardTypes";
import { InstanceEdit } from "./InstanceEdit";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import { InstanceAdd } from "./InstanceAdd/InstanceAdd";
import React from "react";
import { useRouter } from "next/router";

export function InstanceAddEditLightBox({
  instanceLightbox,
  setInstanceLightbox,
  itemsCount = 0,
  setItemsCount = () => {},
}: {
  instanceLightbox: IDeleteModalState;
  setInstanceLightbox: (
    value:
      | ((prevState: IDeleteModalState) => IDeleteModalState)
      | IDeleteModalState
  ) => void;
  itemsCount?: number;
  setItemsCount?: (value: number) => void;
}) {
  const router = useRouter();
  if (!instanceLightbox.visible) {
    return null;
  }
  return instanceLightbox.id ? (
    <>
      <InstanceEdit
        supportOutsideClick={true}
        onOutsideClick={() => {
          setInstanceLightbox({ visible: false, id: "" });
          router.push(`/instances`);
        }}
        handleButtonClose={() => {
          setInstanceLightbox({ visible: false, id: "" });
          router.push(`/instances`);
        }}
        instanceId={instanceLightbox.id}
      />
      <Backdrop
        onClick={() => {
          setInstanceLightbox({ visible: false, id: "" });
          router.push(`/instances`);
        }}
      />
    </>
  ) : (
    <>
      <InstanceAdd
        onOutsideClick={() => setInstanceLightbox({ visible: false, id: "" })}
        handleButtonClose={() =>
          setInstanceLightbox({ visible: false, id: "" })
        }
        itemsCount={itemsCount}
        setItemsCount={(value) => setItemsCount(value)}
      />
      <Backdrop
        onClick={() => setInstanceLightbox({ visible: false, id: "" })}
      />
    </>
  );
}
