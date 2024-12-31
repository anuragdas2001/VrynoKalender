import React from "react";
import { Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { ICustomField } from "../../../../../../models/ICustomField";
import { CustomViewFieldsModalFormFields } from "./CustomViewFieldsModalFormFields";
import { ICustomView } from "../../../../../../models/shared";
import { getSortedFieldList } from "../../../shared/utils/getOrderedFieldsList";

const initialValues = {};

export type CustomViewFieldsModalFormProps = {
  customView: ICustomView | null;
  fieldsList: ICustomField[];
  customViewFieldsList: ICustomField[];
  savingProcess: boolean;
  onCancel: () => void;
  handleSave: (values: FormikValues) => void;
};

export const CustomViewFieldsModalForm = ({
  customView,
  fieldsList,
  customViewFieldsList,
  savingProcess,
  onCancel,
  handleSave,
}: CustomViewFieldsModalFormProps) => {
  const validationSchema = Yup.object().shape({});
  const [availableFieldsList, setAvailableFieldsList] = React.useState<
    ICustomField[]
  >(
    fieldsList
      ?.filter((field) => !customViewFieldsList.includes(field))
      ?.filter((field) => field)
      ?.filter((field) => field?.visible)
  );
  const [availableFieldsListThreshold, setAvailableFieldsListThreshold] =
    React.useState<ICustomField[]>([]);
  const [selectedFieldsList, setSelectedFieldsList] = React.useState<
    ICustomField[]
  >(customViewFieldsList?.filter((field) => field));
  const [selectedFieldsListThreshold, setSelectedFieldsListThreshold] =
    React.useState<ICustomField[]>([]);

  return (
    <>
      <Formik
        initialValues={{ ...initialValues }}
        onSubmit={(values) =>
          handleSave({
            fieldList: selectedFieldsList
              ?.map((field) => field.name)
              .concat(["isSample"]),
          })
        }
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <CustomViewFieldsModalFormFields
            availableFieldsList={getSortedFieldList(availableFieldsList)}
            availableFieldsListThreshold={availableFieldsListThreshold}
            selectedFieldsList={selectedFieldsList}
            selectedFieldsListThreshold={selectedFieldsListThreshold}
            handleAddFieldToAvailableFieldsList={(field) => {
              if (availableFieldsListThreshold?.includes(field)) {
                setAvailableFieldsListThreshold([
                  ...availableFieldsListThreshold?.filter(
                    (availField) => availField !== field
                  ),
                ]);
              } else {
                setAvailableFieldsListThreshold([
                  ...availableFieldsListThreshold,
                  field,
                ]);
              }
            }}
            handleAddFieldToSelectedFieldsList={(field) => {
              if (selectedFieldsListThreshold?.includes(field)) {
                setSelectedFieldsListThreshold([
                  ...selectedFieldsListThreshold?.filter(
                    (selectedField) => selectedField !== field
                  ),
                ]);
              } else {
                setSelectedFieldsListThreshold([
                  ...selectedFieldsListThreshold,
                  field,
                ]);
              }
            }}
            handleAddThresholdToAvailable={(fields) => {
              setAvailableFieldsList([...availableFieldsList, ...fields]);
              setSelectedFieldsList(
                [...selectedFieldsList]?.filter(
                  (field) => !fields.includes(field)
                )
              );
            }}
            handleAddThresholdToSelected={(fields) => {
              setSelectedFieldsList([...selectedFieldsList, ...fields]);
              setAvailableFieldsList(
                [...availableFieldsList]?.filter(
                  (field) => !fields.includes(field)
                )
              );
            }}
            setAvailableFieldsListThreshold={(fields) =>
              setAvailableFieldsListThreshold(fields)
            }
            setSelectedFieldsListThreshold={(fields) =>
              setSelectedFieldsListThreshold(fields)
            }
            handleSave={handleSubmit}
            savingProcess={savingProcess}
            onCancel={onCancel}
          />
        )}
      </Formik>
    </>
  );
};
