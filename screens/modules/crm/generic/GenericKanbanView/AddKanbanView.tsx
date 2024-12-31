import { Formik, FormikValues } from "formik";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import * as Yup from "yup";
import { ICustomField } from "../../../../../models/ICustomField";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import React from "react";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import {
  IKanbanViewData,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { toast } from "react-toastify";
import { AddKanbanViewForm } from "./AddKanbanViewForm";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";

const ViewStoreKey = "currentView";

export const AddKanbanView = ({
  kanbanViewModal,
  setKanbanViewModal,
  lookupFieldsList,
  numberFieldsList,
  currencyField,
  fieldsList,
  modelName,
  setKVData,
  setCurrentView,
}: {
  kanbanViewModal: {
    visible: boolean;
    data: IKanbanViewData | null;
    edit: boolean;
  };
  setKanbanViewModal: (value: {
    visible: boolean;
    data: IKanbanViewData | null;
    edit: boolean;
  }) => void;
  lookupFieldsList: ICustomField[];
  numberFieldsList: ICustomField[];
  currencyField: ICustomField;
  fieldsList: ICustomField[];
  modelName: string;
  setKVData: (value: IKanbanViewData) => void;
  setCurrentView: React.Dispatch<React.SetStateAction<SupportedDashboardViews>>;
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter view name")
      .max(40, "Kanban view name cannot be more than 40 characters"),
    categorizeBy: Yup.string().required("Please select categorize field"),
    // aggregateBy: Yup.string().required("Please select aggregate field"),
  });
  const processedFieldList = fieldsList
    .filter((field) => !["id", "layoutId", "recordStatus"].includes(field.name))
    .map((field: ICustomField) => {
      return {
        value: field.name,
        label: field.label["en"],
        dataType: field.dataType,
        systemDefined: field.systemDefined,
      };
    });
  const [initialData, setInitialData] = React.useState<{
    name: string;
    categorizeBy: string;
    aggregateBy: string;
    relatedModule: string;
    currencyType: null | string;
  }>({
    name: "",
    categorizeBy: "",
    aggregateBy: "",
    relatedModule: "",
    currencyType: null,
  });
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [availableFieldsList, setAvailableFieldsList] =
    React.useState<ISimplifiedCustomField[]>(processedFieldList);
  const [selectedThresholdFieldsList, setSelectedThresholdFieldsList] =
    React.useState<ISimplifiedCustomField[]>([]);
  const [availableThresholdFieldsList, setAvailableThresholdFieldsList] =
    React.useState<ISimplifiedCustomField[]>([]);
  const [selectedFieldsList, setSelectedFieldsList] = React.useState<
    ISimplifiedCustomField[]
  >([]);
  const handleSelectedFieldSelection = (value: ISimplifiedCustomField) => {
    selectedThresholdFieldsList.includes(value)
      ? setSelectedThresholdFieldsList(
          selectedThresholdFieldsList.filter(
            (field) => JSON.stringify(field) !== JSON.stringify(value)
          )
        )
      : setSelectedThresholdFieldsList([...selectedThresholdFieldsList, value]);
  };
  const handleAvailableFieldSelection = (value: ISimplifiedCustomField) => {
    availableThresholdFieldsList.includes(value)
      ? setAvailableThresholdFieldsList(
          availableThresholdFieldsList.filter(
            (field) => JSON.stringify(field) !== JSON.stringify(value)
          )
        )
      : setAvailableThresholdFieldsList([
          ...availableThresholdFieldsList,
          value,
        ]);
  };
  const handleAvailableFields = () => {
    setSelectedFieldsList([
      ...selectedFieldsList,
      ...availableThresholdFieldsList,
    ]);
    setAvailableFieldsList(
      availableFieldsList.filter(
        (field) => !availableThresholdFieldsList.includes(field)
      )
    );
    setAvailableThresholdFieldsList([]);
  };

  const handleSelectedFields = () => {
    setAvailableFieldsList([
      ...selectedThresholdFieldsList,
      ...availableFieldsList,
    ]);
    setSelectedFieldsList(
      selectedFieldsList.filter(
        (field) => !selectedThresholdFieldsList.includes(field)
      )
    );
    setSelectedThresholdFieldsList([]);
  };

  const [saveKanbanView] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  const handleKanbanViewSave = (values: FormikValues) => {
    if (values["categorizeBy"]) {
      const categorizeByField = fieldsList.filter((field) => {
        if (field.systemDefined) {
          return field.name === values["categorizeBy"];
        } else {
          return `fields.${field.name}` === values["categorizeBy"];
        }
      })[0];
      if (!categorizeByField) {
        toast.error("Categorized by field not found.");
        return;
      }
      if (!categorizeByField.visible) {
        toast.error(
          `No field permission for the selected "Categorize By" field: ${
            categorizeByField?.label.en || categorizeByField.name
          }`
        );
        return;
      }
    }
    if (values["availableFields"]?.length) {
      const hiddenFields = [];
      for (const fieldName of values["availableFields"]) {
        const field = fieldsList.filter((field) => {
          if (fieldName === "recordStatus") return false;
          if (field.systemDefined) {
            return field.name === fieldName;
          } else {
            return `fields.${field.name}` === fieldName;
          }
        })[0];
        if (field && !field.visible)
          hiddenFields.push(field?.label.en || field.name);
      }
      if (hiddenFields.length) {
        toast.error(
          `Cannot use hidden Selected Field${
            hiddenFields?.length > 1 ? "s" : ""
          }: ${hiddenFields.join(", ")}`
        );
        return;
      }
    }
    try {
      setSavingProcess(true);
      saveKanbanView({
        variables: {
          id: kanbanViewModal.data ? kanbanViewModal?.data.id : null,
          modelName: "kanbanView",
          // saveInput: { ...values, aggregateBy: "", relatedModule: modelName },
          saveInput: { ...values, relatedModule: modelName },
        },
      }).then((response) => {
        if (
          response.data.save.messageKey.includes("-success") &&
          response.data.save.data
        ) {
          setKanbanViewModal({ visible: false, data: null, edit: false });
          setKVData({
            id: response.data.save.data.id,
            name: response.data.save.data.name,
            categorizeBy: response.data.save.data.categorizeBy,
            aggregateBy: response.data.save.data.aggregateBy,
            currencyType: response.data.save.data.currencyType,
            availableFields: response.data.save.data.availableFields,
            relatedModule: response.data.save.data.relatedModule,
          });
          setCurrentView(SupportedDashboardViews.Kanban);
          sessionStorage.setItem(ViewStoreKey, SupportedDashboardViews.Kanban);
          toast.success(response.data.save.message);
        } else {
          toast.error(response.data.save.message);
        }
        setSavingProcess(false);
      });
    } catch (error) {
      console.error(error);
      setSavingProcess(false);
    }
  };

  const fieldNameExtractor = (name: string) => {
    return name.includes("fields.") ? name.slice(name.indexOf(".") + 1) : name;
  };

  React.useEffect(() => {
    if (kanbanViewModal.edit && kanbanViewModal.data) {
      let selectedFields = [];
      let availableFields = [];
      const selectedFieldsResponse = kanbanViewModal.data.availableFields.map(
        (field: string) => fieldNameExtractor(field)
      );

      for (const field of availableFieldsList) {
        let found = false;
        for (const fieldName of selectedFieldsResponse) {
          if (fieldName == field.value) {
            found = true;
            break;
          }
        }
        if (!found) availableFields.push(field);
      }

      for (const fieldName of selectedFieldsResponse) {
        for (const field of availableFieldsList) {
          if (fieldName == field.value) {
            selectedFields.push(field);
          }
        }
      }
      setSelectedFieldsList(selectedFields);
      setAvailableFieldsList(availableFields);
      setInitialData({
        name: kanbanViewModal.data.name,
        categorizeBy:
          kanbanViewModal.data.categorizeBy.split(".")[0] === "fields"
            ? kanbanViewModal.data.categorizeBy.slice(7)
            : kanbanViewModal.data.categorizeBy,
        aggregateBy: kanbanViewModal.data.aggregateBy,
        currencyType: kanbanViewModal.data.currencyType,
        relatedModule: kanbanViewModal.data.relatedModule,
      });
    }
  }, [kanbanViewModal.edit]);

  return (
    <>
      <GenericFormModalContainer
        formHeading="Kanban View - Settings"
        onOutsideClick={() =>
          setKanbanViewModal({ visible: false, data: null, edit: false })
        }
        onCancel={() =>
          setKanbanViewModal({ visible: false, data: null, edit: false })
        }
      >
        <Formik
          initialValues={initialData}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            if (selectedFieldsList?.length === 0) {
              toast.error("Please select module fields");
              return;
            }
            handleKanbanViewSave({
              ...values,
              categorizeBy: fieldsList.filter(
                (field) => field.name === values.categorizeBy
              )[0]?.systemDefined
                ? values.categorizeBy
                : `fields.${values.categorizeBy}`,
              aggregateBy:
                values.aggregateBy === "---" || !values.aggregateBy
                  ? null
                  : values.aggregateBy,
              currencyType: values.currencyType,
              availableFields: [
                ...selectedFieldsList.map((field) => {
                  if (!field.systemDefined) {
                    return `fields.${field["value"]}`;
                  }
                  return field["value"];
                }),
                "isSample",
              ],
            });
          }}
        >
          {({ handleSubmit }) => (
            <AddKanbanViewForm
              handleSubmit={handleSubmit}
              lookupFieldsList={lookupFieldsList}
              numberFieldsList={numberFieldsList}
              availableFieldsList={availableFieldsList}
              availableThresholdFieldsList={availableThresholdFieldsList}
              selectedFieldsList={selectedFieldsList}
              selectedThresholdFieldsList={selectedThresholdFieldsList}
              handleAvailableFieldSelection={handleAvailableFieldSelection}
              setSelectedThresholdFieldsList={setSelectedThresholdFieldsList}
              handleSelectedFieldSelection={handleSelectedFieldSelection}
              setAvailableThresholdFieldsList={setAvailableThresholdFieldsList}
              handleAvailableFields={handleAvailableFields}
              handleSelectedFields={handleSelectedFields}
              setKanbanViewModal={setKanbanViewModal}
              savingProcess={savingProcess}
              setSavingProcess={setSavingProcess}
              currencyField={currencyField}
              modelName={modelName}
              initialData={initialData}
            />
          )}
        </Formik>
      </GenericFormModalContainer>
      <Backdrop
        onClick={() =>
          setKanbanViewModal({ visible: false, data: null, edit: false })
        }
      />
    </>
  );
};
