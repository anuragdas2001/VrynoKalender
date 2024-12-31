import _ from "lodash";
import React from "react";
import * as Yup from "yup";
import moment from "moment";
import { Formik } from "formik";
import { CSVLink } from "react-csv";
import { useTranslation } from "next-i18next";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import DownloadDataIcon from "remixicon-react/DownloadCloud2LineIcon";
import { BulkImportStepOneProps } from "../bulkImportImportMappingHelpers";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import GenericBackHeader from "../../../shared/components/GenericBackHeader";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormCheckBox from "../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import FormFileDropper from "../../../../../../components/TailwindControls/Form/FileDropper/FormFileDropper";

export const SampleData = (type: SupportedDataTypes, num: number) => {
  const sampleDataType: Record<SupportedDataTypes, any> = {
    autoNumber: num,
    boolean: "No",
    date: moment(new Date()).format("YYYY-MM-DD"),
    datetime: moment(new Date()).format("YYYY-MM-DDThh:mm:ss").concat("Z"),
    email: "some-email@email.com",
    expression: "",
    image: "",
    json: "",
    jsonArray: "",
    lookup: "Dropdown Option1",
    multiSelectLookup: `""Dropdown Option1, Dropdown Option2""`,
    multiSelectRecordLookup: `""Search Option 1, Search Option 2""`,
    multiline: "Multi Line",
    number: num,
    numberArray: `""1, 2, 3, 4, 5""`,
    phoneNumber: "+911234567890",
    recordImage: "",
    recordLookup: "Search Option 1",
    relatedTo: "",
    richText: "This is rich text",
    singleline: "Single Line",
    stringArray: `""Dropdown Option1, Dropdown Option2""`,
    stringLookup: "Option1",
    time: "",
    url: "https://www.vryno.com",
    uuid: "Option1",
    uuidArray: `""Option1, Option2""`,
    jsonDateTime: {},
  };

  return sampleDataType[type];
};

let validationSchema = Yup.object().shape({
  fileId: Yup.array()
    .nullable()
    .min(1, "Please select a file")
    .max(1, "Please select a file"),
});

export const BulkImportStepOne = ({
  ui,
  currentModuleLabel,
  importedFiles,
  savingProcess,
  sampleListHeaders,
  fieldsList,
  setImportedFiles,
  handleBulkImportCreation,
  useDefaultMapping,
  handleUseDefaultMapping,
  gotoStepTwo,
}: BulkImportStepOneProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full h-full">
      <Formik
        initialValues={{
          fileId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (!useDefaultMapping && ui !== "biimport") {
            gotoStepTwo();
            return;
          }
          handleBulkImportCreation({ ...values });
        }}
      >
        {({ handleSubmit }) => (
          <>
            <GenericBackHeader heading={`Import ${currentModuleLabel}`}>
              <div
                className={`${
                  importedFiles && importedFiles.length > 0 ? "" : "hidden"
                }`}
              >
                <div className="w-32">
                  <Button
                    id="bi-step-one"
                    onClick={() => handleSubmit()}
                    loading={savingProcess}
                    buttonType="thin"
                    disabled={savingProcess}
                    kind={"primary"}
                    userEventName={`${
                      !useDefaultMapping && ui !== "biimport"
                        ? "bulkImport-mapping-step-one:next"
                        : "bulkImport-job:submit"
                    }-click`}
                  >
                    {useDefaultMapping || ui === "biimport"
                      ? t("common:Save")
                      : t("common:Next")}
                  </Button>
                </div>
              </div>
            </GenericBackHeader>
            <div
              style={{
                height: (window.innerHeight * 4) / 6,
              }}
              className="w-full flex flex-col items-center justify-center px-6"
            >
              <div
                className={`w-full max-w-lg flex flex-col items-center justify-center h-full rounded-xl px-6 bg-white ${
                  ui === "biimport" ? "max-h-[360px]" : "max-h-84 mt-8"
                }`}
              >
                <div className="w-full max-w-lg">
                  <FormFileDropper
                    name="fileId"
                    files={importedFiles}
                    disabled={savingProcess}
                    onChange={(file: File[] | null) => setImportedFiles(file)}
                  />
                </div>
                <CSVLink
                  data={[
                    sampleListHeaders?.map((field) => field.label.en),
                    ..._.range(1, 2).map((num: number) =>
                      sampleListHeaders?.map((field) =>
                        SampleData(field.dataType as SupportedDataTypes, num)
                      )
                    ),
                  ]}
                  filename={`${currentModuleLabel}.csv`}
                  className="w-full mt-4"
                >
                  <Button
                    id="bulk-import-download-sample-data"
                    customStyle={`w-full text-sm ${
                      savingProcess
                        ? "bg-gray-300"
                        : "bg-vryno-theme-light-blue"
                    }  flex items-center justify-between p-4 rounded-md`}
                    renderChildrenOnly={true}
                    userEventName="bulkImport-download-sample-data"
                  >
                    <>
                      <span className={`font-medium text-white`}>
                        DownLoad Sample File
                      </span>
                      <DownloadDataIcon size={20} className={`text-white`} />
                    </>
                  </Button>
                </CSVLink>
                {ui === "biimport" ? (
                  <></>
                ) : (
                  <div className="mt-3">
                    <FormCheckBox
                      onChange={() => {
                        handleUseDefaultMapping(!useDefaultMapping);
                        MixpanelActions.track(
                          "bulkImport-use-default-mapping:toggle-click",
                          { type: "click" }
                        );
                      }}
                      name="useDefaultMapping"
                      label={`Bulk import using default mapping`}
                      value={useDefaultMapping}
                      labelSize="text-sm"
                      marginY="mt-4"
                    />
                  </div>
                )}
                <div
                  className={`w-full flex items-center justify-center ${
                    ui === "biimport" ? "mt-6" : "mt-2"
                  }`}
                >
                  <p className="text-xs text-gray-600 text-center">
                    Please make sure that you have write access to the field
                    corresponding to each column in the uploaded file
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </form>
  );
};
