import { useLazyQuery } from "@apollo/client";
import React, { useContext } from "react";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { BulkImportContentContainer } from "./BulkImportContentContainer";
import {
  IBulkImportCriteriaValues,
  IBulkImportFieldMappingData,
  IBulkImportMappingData,
} from "./bulkImportImportMappingHelpers";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";

export const ConnectedAddBulkImportScreen = observer(() => {
  const { appName, modelName, ui: urlUi, id } = getAppPathParts();
  const ui = urlUi as string;
  const { navigations } = useContext(NavigationStoreContext);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    allLayoutFetched,
    allModulesFetched,
    userPreferences,
  } = generalModelStore;

  const [moduleData, setModuleData] = React.useState<IModuleMetadata | null>(
    null
  );
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);

  const [bulkImportStepOne, setBulkImportStepOne] =
    React.useState<boolean>(true);
  const [bulkImportStepTwo, setBulkImportStepTwo] =
    React.useState<boolean>(false);
  const [bulkImportStepThree, setBulkImportStepThree] =
    React.useState<boolean>(false);

  const [bulkImportMappingData, setBulkImportMappingData] =
    React.useState<IBulkImportMappingData | null>(null);
  const [bulkImportCriteriaValues, setBulkImportCriteriaValues] =
    React.useState<IBulkImportCriteriaValues>({
      name: null,
      mappingMode: "create",
      updateOn: null,
      skipOn: null,
      triggerAutomation: false,
      updateEmptyValues: false,
    });
  const [sampleListHeaders, setSampleListHeaders] = React.useState<
    ICustomField[]
  >([]);
  const [triggerAutomation, setTriggerAutomation] = React.useState(true);
  const [fileName, setFileName] = React.useState("");

  const [bulkImportFieldMappingData, setBulkImportFieldMappingData] =
    React.useState<IBulkImportFieldMappingData[] | null>(null);
  const [bulkImportMappingProcessing, setBulkImportMappingProcessing] =
    React.useState(false);
  const [importedFiles, setImportedFiles] = React.useState<File[] | null>([]);

  React.useEffect(() => {
    if (allModulesFetched && allLayoutFetched) {
      let moduleDataFromStore = genericModels[modelName]?.moduleInfo;
      let fieldsListFromStore = genericModels[modelName]?.fieldsList;
      setModuleData(moduleDataFromStore);
      setFieldsList(
        fieldsListFromStore.filter(
          (field) =>
            !["recordImage", "relatedTo"].includes(field.dataType) &&
            ![
              "id",
              "layoutId",
              "recordStatus",
              "closedBy",
              "closedAt",
            ].includes(field.name)
        )
      );
    }
  }, [allModulesFetched, allLayoutFetched]);

  const [getBulkImportMapping] = useLazyQuery<FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        const responseData = responseOnCompletion?.fetch?.data[0];
        setBulkImportMappingData({
          id: responseData.id,
          fileName: responseData.fileName,
          headers: responseData.headers,
          fileKey: responseData.fileKey,
          name: responseData.name,
          mappingMode: responseData.mode,
          updateOn: responseData.updateOn,
          skipOn: responseData.skipOn,
          rowData: responseData.head,
          updateEmptyValues: responseData.updateEmptyValues,
        });
        setBulkImportCriteriaValues({
          name: responseData.name,
          mappingMode: responseData.mode,
          updateOn: responseData.updateOn,
          skipOn: responseData.skipOn,
          triggerAutomation: responseData.triggerAutomation,
          updateEmptyValues: responseData.updateEmptyValues,
        });
        setTriggerAutomation(responseData.triggerAutomation);
        setFileName(responseData.fileName);
      }
    },
  });

  let [jobItemsFetchPageNumber, setJobItemsFetchPageNumber] = React.useState(1);

  const [getBulkImportFieldDependency] = useLazyQuery<
    FetchData<IBulkImportFieldMappingData>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length === 0) {
        setBulkImportMappingProcessing(false);
        if (ui === "mapping" || ui == "bulkimport") {
          setBulkImportStepTwo(false);
          setBulkImportStepThree(true);
        }
        return;
      }
      if (responseOnCompletion?.fetch?.data?.length) {
        if (bulkImportFieldMappingData?.length) {
          setBulkImportFieldMappingData([
            ...bulkImportFieldMappingData,
            ...responseOnCompletion?.fetch?.data,
          ]);
        } else {
          setBulkImportFieldMappingData(responseOnCompletion?.fetch?.data);
        }
        setJobItemsFetchPageNumber(++jobItemsFetchPageNumber);
        recursionBulkImportJobItemsData(
          bulkImportMappingData,
          jobItemsFetchPageNumber
        );
      }
    },
  });

  const recursionBulkImportJobItemsData = (
    bulkImportMappingData: IBulkImportMappingData | null,
    pageNumber: number
  ) => {
    if (!bulkImportMappingData) return;
    getBulkImportFieldDependency({
      variables: {
        modelName: "BulkImportFieldMapping",
        fields: [
          "id",
          "sourceFieldLabel",
          "destinationFieldUniqueName ",
          "options",
        ],
        filters: [
          {
            name: "mappingId",
            operator: "eq",
            value: [bulkImportMappingData.id],
          },
        ],
        pageNumber: pageNumber,
      },
    });
  };

  React.useEffect(() => {
    if (bulkImportMappingData && appName) {
      setJobItemsFetchPageNumber(1);
      recursionBulkImportJobItemsData(bulkImportMappingData, 1);
    }
  }, [bulkImportMappingData, appName]);

  React.useEffect(() => {
    if (fieldsList.length > 0) {
      setSampleListHeaders(
        fieldsList
          ?.filter((field) => !field.readOnly)
          ?.filter((field) => field.visible)
          ?.filter((field) => field.dataType !== "expression")
          ?.filter((field) => !field.addInSummarySection)
      );
    }
  }, [fieldsList]);

  React.useEffect(() => {
    if (ui && id && ui === "biedit" && appName) {
      setBulkImportStepOne(false);
      setBulkImportStepTwo(true);
      getBulkImportMapping({
        variables: {
          modelName: "BulkImportMapping",
          fields: [
            "id",
            "fileName",
            "headers",
            "fileKey",
            "name",
            "mode",
            "updateOn",
            "skipOn",
            "head",
            "triggerAutomation",
            "updateEmptyValues",
          ],
          filters: [
            {
              name: "id",
              operator: "eq",
              value: [id],
            },
          ],
        },
      });
    }
  }, [ui, id, appName]);

  React.useEffect(() => {
    if (ui === "mapping" || ui == "bulkimport") {
      setBulkImportMappingData(null);
    }
  }, [importedFiles]);

  if (fieldsList.length <= 0) {
    return <GeneralScreenLoader modelName={"..."} />;
  }

  return !moduleData ||
    !fieldsList?.length ||
    (ui == "biedit" && !bulkImportMappingData) ? (
    <div className={"flex items-center justify-center h-screen text-xl"}>
      <PageLoader />
    </div>
  ) : (
    <BulkImportContentContainer
      ui={ui}
      id={id}
      appName={appName}
      modelName={modelName}
      fieldsList={fieldsList}
      sampleListHeaders={sampleListHeaders}
      moduleData={moduleData}
      bulkImportStepOne={bulkImportStepOne}
      bulkImportStepTwo={bulkImportStepTwo}
      bulkImportStepThree={bulkImportStepThree}
      setBulkImportStepOne={(value) => setBulkImportStepOne(value)}
      setBulkImportStepTwo={(value) => setBulkImportStepTwo(value)}
      setBulkImportStepThree={(value) => setBulkImportStepThree(value)}
      bulkImportMappingData={bulkImportMappingData}
      bulkImportFieldMappingData={bulkImportFieldMappingData}
      setBulkImportMappingData={(value) => setBulkImportMappingData(value)}
      bulkImportMappingProcessing={bulkImportMappingProcessing}
      setBulkImportMappingProcessing={(value) =>
        setBulkImportMappingProcessing(value)
      }
      bulkImportCriteriaValues={bulkImportCriteriaValues}
      setBulkImportCriteriaValues={(value: IBulkImportCriteriaValues) =>
        setBulkImportCriteriaValues(value)
      }
      triggerAutomation={triggerAutomation}
      onTriggerAutomation={(value) => setTriggerAutomation(value)}
      fileName={fileName}
      importedFiles={importedFiles}
      setImportedFiles={setImportedFiles}
      userPreferences={userPreferences}
      navigations={navigations}
    />
  );
});
