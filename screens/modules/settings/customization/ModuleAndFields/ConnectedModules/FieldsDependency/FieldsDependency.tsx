import { camelCase } from "change-case";
import React, { useContext } from "react";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { FETCH_QUERY } from "../../../../../../../graphql/queries/fetchQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import ItemsLoader from "../../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { SAVE_MUTATION } from "../../../../../../../graphql/mutations/saveMutation";
import DeleteModal from "../../../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../../../components/TailwindControls/Backdrop";
import { getSettingsPathParts } from "../../../../../crm/shared/utils/getSettingsPathParts";
import { toast } from "react-toastify";
import { FieldsDependencyTable } from "./FieldsDependencyTable";
import Pagination from "../../../../../crm/shared/components/Pagination";
import { FieldsDependencyHeader } from "./FieldsDependencyHeader";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../../stores/RootStore/GeneralStore/GeneralStore";

export interface IFieldsDependencyMappingCollection {
  id: string;
  moduleName: string;
  name: string;
  parentFieldUniqueName: string;
  childFieldUniqueName: string;
}

export const FieldsDependency = observer(({ id }: { id: string }) => {
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched, allModulesFetched } =
    generalModelStore;
  const moduleName = camelCase(id);
  const { appName } = getSettingsPathParts();

  const [fieldsDependencyCollectionData, setFieldsDependencyCollectionData] =
    React.useState<IFieldsDependencyMappingCollection[]>([]);
  const [itemsCount, setItemsCount] = React.useState(0);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(0);
  const [dataLoading, setDataLoading] = React.useState(true);

  const [deleteModal, setDeleteModal] = React.useState({
    visible: false,
    id: "",
  });

  const [layoutLookupData, setLayoutLookupData] = React.useState<
    ICustomField[]
  >([]);
  const [layoutDataProcessing, setLayoutDataProcessing] =
    React.useState<boolean>(true);

  const dependencyCollectionFetchVariables = {
    modelName: "fieldDependencyMappingCollection",
    fields: ["id", "name", "moduleName"],
    filters: [
      {
        name: "moduleName",
        operator: "eq",
        value: [moduleName],
      },
    ],
  };

  React.useEffect(() => {
    if (moduleName && allLayoutFetched) {
      let fieldsListFromStore = genericModels[moduleName]?.fieldsList ?? [];
      const fieldsData = fieldsListFromStore.filter(
        (field) =>
          field.dataType == "lookup" &&
          !["dealPipelineId", "dealStageId"].includes(field.name)
      );
      setLayoutLookupData(fieldsData);
      setLayoutDataProcessing(false);
    }
  }, [moduleName, allLayoutFetched]);

  const [getFieldDependencyMappingCollection] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        let labelDict: Record<string, string> = {};
        responseOnCompletion?.fetch?.data.map((fieldData: { name: string }) => {
          const [parentFieldName, childFieldName] = fieldData.name.split("-");
          if (!labelDict[parentFieldName]) {
            labelDict = {
              ...labelDict,
              [parentFieldName]: layoutLookupData.filter(
                (lookup) =>
                  lookup.uniqueName.split(".").pop() === parentFieldName
              )[0].label.en,
            };
          }
          if (!labelDict[childFieldName]) {
            labelDict = {
              ...labelDict,
              [childFieldName]: layoutLookupData.filter(
                (lookup) =>
                  lookup.uniqueName.split(".").pop() === childFieldName
              )[0].label.en,
            };
          }
        });

        setFieldsDependencyCollectionData(
          responseOnCompletion?.fetch?.data.map(
            (fieldData: { name: string }) => {
              const [parentFieldName, childFieldName] =
                fieldData.name.split("-");

              return {
                ...fieldData,
                parentFieldName: labelDict[parentFieldName] || "",
                childFieldName: labelDict[childFieldName] || "",
              };
            }
          )
        );
        setItemsCount(responseOnCompletion?.fetch?.count);
      }
    },
  });

  const handlePageChange = (pageNumber: number) => {
    getFieldDependencyMappingCollection({
      variables: {
        ...dependencyCollectionFetchVariables,
        pageNumber: pageNumber,
      },
    }).then((response) => {
      if (response?.data?.fetch?.data?.length) setCurrentPageNumber(pageNumber);
    });
  };

  React.useEffect(() => {
    if (!layoutDataProcessing && appName) {
      getFieldDependencyMappingCollection({
        variables: { ...dependencyCollectionFetchVariables, pageNumber: 1 },
      }).then((response) => {
        if (response?.data?.fetch?.data?.length) setCurrentPageNumber(1);
        setDataLoading(false);
      });
    }
  }, [layoutDataProcessing, appName]);

  const [deleteFieldsDependencyCollection] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const deleteDependencyMapping = () => {
    deleteFieldsDependencyCollection({
      variables: {
        id: deleteModal.id,
        modelName: "fieldDependencyMappingCollection",
        saveInput: {
          recordStatus: "d",
        },
      },
    }).then((response) => {
      if (response?.data?.save?.messageKey.includes("-success")) {
        const updatedData = fieldsDependencyCollectionData.filter(
          (data) => data.id !== response.data.save?.data?.id
        );
        setFieldsDependencyCollectionData(updatedData);
        setItemsCount(updatedData.length);
        resetDeleteModalProp();
        toast.success(response?.data?.save?.message);
      } else {
        toast.error(response?.data?.save?.message);
      }
    });
  };

  const resetDeleteModalProp = () => {
    setDeleteModal({
      visible: false,
      id: "",
    });
  };

  return (
    <>
      <FieldsDependencyHeader
        moduleName={moduleName}
        showButtons={!dataLoading}
      />
      {dataLoading ? (
        <div className="p-6">
          <ItemsLoader currentView="List" loadingItemCount={4} />
        </div>
      ) : (
        <div className="px-6 pt-4">
          {fieldsDependencyCollectionData.length ? (
            <>
              <div className="hidden sm:flex">
                <Pagination
                  itemsCount={itemsCount}
                  currentPageItemCount={fieldsDependencyCollectionData.length}
                  pageSize={50}
                  onPageChange={(pageNumber) => handlePageChange(pageNumber)}
                  currentPageNumber={currentPageNumber}
                  pageInfoLocation="between"
                />
              </div>
              <div className="sm:hidden flex flex-col">
                <Pagination
                  itemsCount={itemsCount}
                  currentPageItemCount={fieldsDependencyCollectionData.length}
                  pageSize={50}
                  onPageChange={(pageNumber) => handlePageChange(pageNumber)}
                  currentPageNumber={currentPageNumber}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <FieldsDependencyTable
            fieldsDependencyCollectionData={fieldsDependencyCollectionData}
            moduleName={moduleName}
            setDeleteModal={setDeleteModal}
          />
        </div>
      )}

      {deleteModal.visible && (
        <>
          <DeleteModal
            id={"delete_role_modal"}
            modalHeader={"Delete Dependency"}
            modalMessage={"Are you sure you want to delete dependency?"}
            leftButton={"Cancel"}
            rightButton={"Delete"}
            loading={false}
            onCancel={() => resetDeleteModalProp()}
            onDelete={() => deleteDependencyMapping()}
            onOutsideClick={() => resetDeleteModalProp()}
          />
          <Backdrop onClick={() => resetDeleteModalProp()} />
        </>
      )}
    </>
  );
});
