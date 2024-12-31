import GenericList from "../../../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import { IFieldsDependencyMappingCollection } from "./FieldsDependency";
import React from "react";
import { setHeight } from "../../../../../crm/shared/utils/setHeight";
import _ from "lodash";
import { FieldsDependencyListActionWrapper } from "./FieldsDependencyListActionWrapper";

export const FieldsDependencyTable = ({
  fieldsDependencyCollectionData,
  moduleName,
  setDeleteModal,
}: {
  fieldsDependencyCollectionData: IFieldsDependencyMappingCollection[];
  moduleName: string;
  setDeleteModal: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      id: string;
    }>
  >;
}) => {
  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 20);
    }
  });

  return (
    <div className="mt-4 px-4 pt-4 bg-white rounded-xl">
      {fieldsDependencyCollectionData?.length ? (
        <div
          ref={heightRef}
          className="flex flex-col lg:flex-row overflow-y-auto bg-white"
        >
          <GenericList
            data={fieldsDependencyCollectionData}
            tableHeaders={[
              {
                columnName: "parentFieldName",
                label: "Parent Field",
                dataType: SupportedDataTypes.singleline,
              },
              {
                columnName: "childFieldName",
                label: "Child Field",
                dataType: SupportedDataTypes.singleline,
              },
              {
                columnName: "actions",
                label: "Actions",
                dataType: SupportedDataTypes.singleline,
                render: (
                  record: IFieldsDependencyMappingCollection,
                  index: number
                ) => {
                  return (
                    <FieldsDependencyListActionWrapper
                      index={index}
                      record={record}
                      recordId={record?.id}
                      moduleName={moduleName}
                      zIndexValue={
                        fieldsDependencyCollectionData?.length - index
                      }
                      setDeleteModal={setDeleteModal}
                    />
                  );
                },
              },
            ]}
            listSelector={false}
            includeUrlWithRender={false}
          />
        </div>
      ) : (
        <div className="py-40 text-center">
          <p className="text-vryno-gray text-sm font-semibold">
            Click on new to add dependencies
          </p>
        </div>
      )}
    </div>
  );
};
