import React from "react";
import { IEmailTemplate, SupportedApps } from "../../../../../../models/shared";
import * as Yup from "yup";
import NoDataFoundContainer from "../../../shared/components/NoDataFoundContainer";
import { useRouter } from "next/router";
import { settingsUrlGenerator } from "../../../shared/utils/settingsUrlGenerator";
import { Formik, FormikValues } from "formik";
import { ExportPdfModalFormFields } from "./ExportPdfModalFormFields";

type ExportPdfModalFormProps = {
  moduleTemplates: IEmailTemplate[];
  savingProcess: boolean;
  alreadyGenerated: boolean;
  currentGeneratedFile: any;
  setAlreadyGenerated: (value: boolean) => void;
  onCancel: (value: boolean) => void;
  handleSave: (value: FormikValues) => void;
  handleSaveNew: (value: FormikValues) => void;
};

let initialValues = {
  templateId: null,
  name: "",
  fileName: "",
  fileFormat: null,
  recordId: "",
  generationType: "",
  status: "",
};

export const ExportPdfModalForm = ({
  moduleTemplates,
  savingProcess,
  alreadyGenerated,
  currentGeneratedFile,
  setAlreadyGenerated,
  onCancel,
  handleSave,
  handleSaveNew,
}: ExportPdfModalFormProps) => {
  const router = useRouter();
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("File name is required")
      .max(20, "File name cannot exceed 20 characters"),
    templateId: Yup.string().nullable().required("Template is required"),
  });

  return (
    <>
      {moduleTemplates && moduleTemplates?.length <= 0 ? (
        <NoDataFoundContainer
          modelName={"Module Template"}
          onClick={() => {
            router.push(
              settingsUrlGenerator(SupportedApps.crm, "templates", "", [
                "moduleTemplate",
                "add",
              ])
            );
          }}
        />
      ) : (
        <Formik
          initialValues={{ ...initialValues }}
          onSubmit={(values) =>
            alreadyGenerated ? handleSaveNew(values) : handleSave(values)
          }
          validationSchema={validationSchema}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <ExportPdfModalFormFields
              moduleTemplates={moduleTemplates}
              savingProcess={savingProcess}
              alreadyGenerated={alreadyGenerated}
              currentGeneratedFile={currentGeneratedFile}
              setAlreadyGenerated={setAlreadyGenerated}
              handleSave={handleSubmit}
              handleSaveNew={handleSubmit}
              onCancel={onCancel}
            />
          )}
        </Formik>
      )}
    </>
  );
};
