import { camelCase, pascalCase } from "change-case";
import React, { useContext } from "react";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { Formik } from "formik";
import GenericBackHeader from "../../../../../crm/shared/components/GenericBackHeader";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import { toast } from "react-toastify";
import router from "next/router";
import { DependencyStepOne } from "./DependencyStepOne";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../../graphql/mutations/saveMutation";
import { getSettingsPathParts } from "../../../../../crm/shared/utils/getSettingsPathParts";
import { DependencyStepTwo } from "./DependencyStepTwo";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../../graphql/queries/fetchQuery";
import ItemsLoader from "../../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { IFieldsDependencyMappingCollection } from "./FieldsDependency";
import SaveIcon from "remixicon-react/SaveLineIcon";
import { getNavigationLabel } from "../../../../../crm/shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { ILayout } from "../../../../../../../models/ILayout";
import { getSortedFieldList } from "../../../../../crm/shared/utils/getOrderedFieldsList";

export interface IFieldsDependency {
  id: string;
  moduleName: string;
  parentFieldUniqueName: string;
  childFieldUniqueName: string;
  parentRecordId: string;
  childRecordIds: string[];
  collectionId: string;
}

export interface IFieldDependencyFieldType {
  value: string;
  label: string;
  fieldData: ICustomField;
  fieldVisible: boolean;
}

export const ConnectedCreateDependency = observer(({ id }: { id: string }) => {
  const { navigations } = useContext(NavigationStoreContext);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    allLayoutFetched,
    allModulesFetched,
    importModuleLayouts,
    importFields,
  } = generalModelStore;

  const moduleName = camelCase(id);
  let { appName, additionalParts } = getSettingsPathParts();
  const dependencyCollectionId =
    additionalParts?.length > 1 ? additionalParts[1] : null;

  const [stepCount, setStepCount] = React.useState<number>(1);
  const [parentFields, setParentFields] = React.useState<
    IFieldDependencyFieldType[]
  >([]);
  const [childFields, setChildFields] = React.useState<
    IFieldDependencyFieldType[]
  >([]);

  const [selectedParentField, setSelectedParentField] =
    React.useState<IFieldDependencyFieldType>();
  const [selectedChildField, setSelectedChildField] =
    React.useState<IFieldDependencyFieldType>();

  const [selectedLookups, setSelectedLookups] = React.useState<{
    [key: string]: string[];
  }>({});

  const [fieldsDependencyData, setFieldsDependencyData] = React.useState<
    IFieldsDependency[]
  >([]);
  const [pageNoDependency, setPageNoDependency] = React.useState(1);

  const [pageNoDependencyCollection, setPageNoDependencyCollection] =
    React.useState(1);
  const [fieldsDependencyCollectionData, setFieldsDependencyCollectionData] =
    React.useState<IFieldsDependencyMappingCollection[]>([]);

  const [initialData, setInitialData] = React.useState({
    parentField: "",
    childField: "",
  });

  //Loaders - start
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [moduleFieldsLoading, setModuleFieldsLoading] = React.useState(true);
  const [fieldsLoading, setFieldsLoading] = React.useState(true);
  const [dependencyDataLoading, setDependencyDataLoading] =
    React.useState(true);
  const [dependencyCollectionDataLoading, setDependencyCollectionDataLoading] =
    React.useState(true);
  //Loaders - end

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  React.useEffect(() => {
    if (moduleName && allLayoutFetched) {
      let fieldsListFromStore = genericModels[moduleName]?.fieldsList ?? [];
      const fieldsData = fieldsListFromStore
        .filter(
          (field) =>
            field.dataType == "lookup" &&
            !["dealPipelineId", "dealStageId"].includes(field.name)
        )
        .map((fieldData) => {
          const filteredLookupOptions =
            fieldData.dataTypeMetadata.lookupOptions.filter(
              (option: { recordStatus: string }) => option.recordStatus === "a"
            );
          return {
            value: fieldData.uniqueName,
            label: fieldData.label.en,
            fieldData: {
              ...fieldData,
              dataTypeMetadata: {
                ...fieldData.dataTypeMetadata,
                lookupOptions: filteredLookupOptions,
              },
            },
            fieldVisible: fieldData.visible,
          };
        });
      setParentFields(fieldsData);
      setChildFields(fieldsData);
      setModuleFieldsLoading(false);
    }
  }, [moduleName, allLayoutFetched]);

  //------------------------------------------- fetch data - start -------------------------------------------
  const [getFieldDependencyMappingCollection] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setFieldsDependencyCollectionData([
          ...fieldsDependencyCollectionData,
          ...responseOnCompletion.fetch.data,
        ]);
        setPageNoDependencyCollection(pageNoDependencyCollection + 1);
        recursionFetchDependencyCollectionCall(pageNoDependencyCollection + 1);
        return;
      }
      setDependencyCollectionDataLoading(false);
    },
  });

  const recursionFetchDependencyCollectionCall = (pageNumber: number) => {
    getFieldDependencyMappingCollection({
      variables: {
        modelName: "fieldDependencyMappingCollection",
        fields: ["id", "name", "moduleName"],
        filters: [
          {
            name: "moduleName",
            operator: "eq",
            value: [moduleName],
          },
        ],
        pageNumber: pageNumber,
      },
    });
  };

  const [getFieldDependencyData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setFieldsDependencyData(
          responseOnCompletion?.fetch?.data.map(
            (fieldData: {
              parentFieldUniqueName: string;
              childFieldUniqueName: string;
            }) => {
              const parentFieldName = fieldData.parentFieldUniqueName
                .split(".")
                .pop();
              const childFieldName = fieldData.childFieldUniqueName
                .split(".")
                .pop();
              return {
                ...fieldData,
                parentFieldName: parentFieldName?.length
                  ? pascalCase(parentFieldName)
                  : "",
                childFieldName: childFieldName?.length
                  ? pascalCase(childFieldName)
                  : "",
              };
            }
          )
        );
        setPageNoDependency(pageNoDependency + 1);
        recursionFetchDependencyCall(pageNoDependency + 1);
        return;
      }
      setDependencyDataLoading(false);
    },
  });

  const recursionFetchDependencyCall = (pageNumber: number) => {
    getFieldDependencyData({
      variables: {
        modelName: "fieldDependencyMapping",
        fields: [
          "id",
          "moduleName",
          "parentFieldUniqueName",
          "childFieldUniqueName",
          "parentRecordId",
          "childRecordIds",
          "collectionId",
        ],
        filters: [
          {
            name: "collectionId",
            operator: "eq",
            value: [dependencyCollectionId],
          },
        ],
        pageNumber: pageNumber,
      },
    });
  };
  //------------------------------------------- fetch data - end -------------------------------------------

  React.useEffect(() => {
    if (!moduleFieldsLoading && appName) {
      if (dependencyCollectionId) {
        recursionFetchDependencyCall(1);
        setDependencyCollectionDataLoading(false);
      } else {
        recursionFetchDependencyCollectionCall(1);
      }
    }
  }, [moduleFieldsLoading, appName]);

  React.useEffect(() => {
    if (!dependencyCollectionDataLoading) {
      if (fieldsDependencyCollectionData.length) {
        const fieldsDataArray: string[] = [];
        const updatedFieldData: IFieldDependencyFieldType[] = [];
        fieldsDependencyCollectionData.forEach((dependencyData) => {
          fieldsDataArray.push(...dependencyData.name.split("-"));
        });
        [...parentFields].forEach((fieldData) => {
          const name = fieldData.value.split(".").pop() || "";
          if (!fieldsDataArray.includes(name)) {
            updatedFieldData.push(fieldData);
          }
        });
        setParentFields(updatedFieldData);
        setChildFields(updatedFieldData);
      }
      setFieldsLoading(false);
    }
  }, [dependencyCollectionDataLoading]);

  React.useEffect(() => {
    if (!fieldsLoading && !dependencyCollectionId) {
      setLoading(false);
    } else if (!fieldsLoading && !dependencyDataLoading) {
      if (fieldsDependencyData?.length) {
        setInitialData({
          parentField: fieldsDependencyData[0].parentFieldUniqueName,
          childField: fieldsDependencyData[0].childFieldUniqueName,
        });
        setSelectedParentField(
          parentFields?.filter(
            (field) =>
              field.value === fieldsDependencyData[0].parentFieldUniqueName
          )[0]
        );
        setSelectedChildField(
          childFields?.filter(
            (field) =>
              field.value === fieldsDependencyData[0].childFieldUniqueName
          )[0]
        );
        let updatedSelectedLookups = { ...selectedLookups };
        fieldsDependencyData.forEach((data) => {
          updatedSelectedLookups = {
            ...updatedSelectedLookups,
            [data.parentRecordId]: data.childRecordIds,
          };
        });
        setSelectedLookups(updatedSelectedLookups);
        setStepCount(2);
        setLoading(false);
      } else {
        setStepCount(2);
        setLoading(false);
      }
    }
  }, [fieldsLoading, dependencyDataLoading]);

  const handleLookupSelect = (
    parentLookupId: string,
    childLookupId: string
  ) => {
    let updatedSelectedLookups = { ...selectedLookups };
    if (!updatedSelectedLookups[parentLookupId]) {
      updatedSelectedLookups = {
        ...updatedSelectedLookups,
        [parentLookupId]: [childLookupId],
      };
    } else if (updatedSelectedLookups[parentLookupId]) {
      if (
        updatedSelectedLookups[parentLookupId]?.length == 0 ||
        !updatedSelectedLookups[parentLookupId].includes(childLookupId)
      ) {
        updatedSelectedLookups = {
          ...updatedSelectedLookups,
          [parentLookupId]: [
            ...updatedSelectedLookups[parentLookupId],
            childLookupId,
          ],
        };
      } else if (
        updatedSelectedLookups[parentLookupId].includes(childLookupId)
      ) {
        updatedSelectedLookups = {
          ...updatedSelectedLookups,
          [parentLookupId]: updatedSelectedLookups[parentLookupId].filter(
            (id) => id !== childLookupId
          ),
        };
      }
    }
    setSelectedLookups(updatedSelectedLookups);
  };

  const [saveFieldsDependency] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [createFieldsDependencyCollection] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  //code refactoring
  const saveDependencyRequestHandler = async (collectionId: string) => {
    const promiseArray: any[] = [];
    const asyncLoop = async () => {
      for (const key in selectedLookups) {
        if (!dependencyCollectionId && !selectedLookups[key]?.length) {
        } else {
          const id =
            fieldsDependencyData?.filter(
              (dependencyData) => dependencyData.parentRecordId == key
            )[0]?.id || null;
          const result = await saveFieldsDependency({
            variables: {
              id: id,
              modelName: "fieldDependencyMapping",
              saveInput: {
                moduleName: moduleName,
                parentFieldUniqueName: selectedParentField?.value,
                childFieldUniqueName: selectedChildField?.value,
                parentRecordId: key,
                childRecordIds: selectedLookups[key],
                collectionId: collectionId,
              },
            },
          });
          promiseArray.push(result);
        }
      }
      return promiseArray;
    };
    return await asyncLoop();
  };

  const handleFieldsDependencySave = async () => {
    setSaveProcessing(true);
    let promiseArray: any[] = [];
    if (dependencyCollectionId) {
      promiseArray = await saveDependencyRequestHandler(dependencyCollectionId);
    } else {
      await createFieldsDependencyCollection({
        variables: {
          id: null,
          modelName: "fieldDependencyMappingCollection",
          saveInput: {
            moduleName: moduleName,
            name: `${selectedParentField?.value
              .split(".")
              .pop()}-${selectedChildField?.value.split(".").pop()}`,
          },
        },
      }).then(async (response) => {
        if (
          response?.data?.save?.messageKey.includes("-success") &&
          response?.data?.save?.data
        ) {
          promiseArray = await saveDependencyRequestHandler(
            response?.data?.save?.data.id
          );
          toast.success(response?.data?.save?.message);
        } else {
          toast.error(response?.data?.save?.message);
          setSaveProcessing(false);
        }
      });
    }
    if (promiseArray.length) {
      await getLayout({
        variables: {
          modelName: "Layout",
          fields: ["id", "name", "moduleName", "layout", "config", "type"],
          filters: [
            {
              name: "moduleName",
              operator: "eq",
              value: moduleName,
            },
          ],
        },
      })
        .then((responseOnCompletion) => {
          if (
            responseOnCompletion?.data?.fetch?.data &&
            responseOnCompletion?.data?.fetch?.data?.length > 0
          ) {
            responseOnCompletion?.data?.fetch?.data?.forEach(
              (layout: ILayout) => {
                importModuleLayouts([layout], layout.moduleName);
                importFields(
                  getSortedFieldList(layout.config.fields),
                  layout.moduleName
                );
              }
            );
          }
        })
        .catch((error) => {});

      Promise.all(promiseArray).then((result) => {
        let successCount = 0;
        let errorMessage: string | null = null;
        result.forEach((response) => {
          if (response?.data?.save?.messageKey.includes("-success")) {
            ++successCount;
          } else {
            errorMessage = response?.data?.save?.message;
          }
        });
        if (result.length && successCount === result.length) {
          toast.success(result[0]?.data?.save?.message);
          router.back();
          return;
        }
        if (errorMessage) {
          toast.error(errorMessage);
          setSaveProcessing(false);
        }
      });
    }
  };

  const currentModuleLabel = getNavigationLabel({
    navigations: navigations,
    currentModuleName: moduleName,
    currentModuleLabel: pascalCase(moduleName),
    defaultLabel: pascalCase(moduleName),
  });

  return loading ? (
    <div className="">
      <GenericBackHeader
        heading="Map Dependency Fields"
        subHeading={currentModuleLabel}
      />
      <div className="p-6">
        <ItemsLoader currentView="List" loadingItemCount={4} />
      </div>
    </div>
  ) : (
    <Formik initialValues={initialData} onSubmit={(values) => {}}>
      {({ values }) => (
        <>
          <GenericBackHeader
            heading="Map Dependency Fields"
            subHeading={currentModuleLabel}
            addButtonInFlexCol={true}
          >
            <div className="flex gap-x-6 justify-between mt-2 sm:mt-0">
              <Button
                id="import-items"
                buttonType="thin"
                kind="back"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (stepCount == 1 || dependencyCollectionId) router.back();
                  else if (stepCount > 1) setStepCount(stepCount - 1);
                }}
                disabled={saveProcessing}
                userEventName={`fieldsDependency-${
                  stepCount == 1 || dependencyCollectionId ? "cancel" : "back"
                }-click`}
              >
                <p>
                  {stepCount == 1 || dependencyCollectionId ? "Cancel" : "Back"}
                </p>
              </Button>
              <Button
                id="import-items"
                buttonType="thin"
                kind="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (stepCount === 1) {
                    if (
                      !values["parentField"] ||
                      values["parentField"] === "None" ||
                      !values["childField"] ||
                      values["childField"] === "None"
                    ) {
                      toast.error("Please select parent and child fields");
                      return;
                    }
                    if (values["parentField"] === values["childField"]) {
                      toast.error(
                        "The parent field and child field cannot be the same."
                      );
                      return;
                    }
                    if (values["parentField"] && values["childField"])
                      setStepCount(stepCount + 1);
                  }
                  if (stepCount === 2) {
                    handleFieldsDependencySave();
                  }
                }}
                disabled={saveProcessing}
                loading={saveProcessing}
                userEventName={`fieldsDependency-${
                  stepCount == 1 ? "next" : "save"
                }-click`}
              >
                <span>
                  {stepCount == 1 ? (
                    <p>Next</p>
                  ) : (
                    <span className="flex items-center justify-center gap-x-1">
                      <SaveIcon size={18} />
                      <span className="text-sm">Save</span>
                    </span>
                  )}
                </span>
              </Button>
            </div>
          </GenericBackHeader>

          {
            <div className="px-6 mt-4">
              {stepCount === 1 && (
                <DependencyStepOne
                  parentFields={parentFields.filter(
                    (field) => field.fieldVisible
                  )}
                  childFields={childFields.filter(
                    (field) => field.fieldVisible
                  )}
                  setSelectedParentField={setSelectedParentField}
                  setSelectedChildField={setSelectedChildField}
                  saveProcessing={saveProcessing}
                />
              )}
              {stepCount === 2 && (
                <DependencyStepTwo
                  selectedParentField={selectedParentField}
                  selectedChildField={selectedChildField}
                  handleLookupSelect={handleLookupSelect}
                  selectedLookups={selectedLookups}
                  saveProcessing={saveProcessing}
                />
              )}
            </div>
          }
        </>
      )}
    </Formik>
  );
});
