import React from "react";
import { Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { IWidget } from "../../../../../models/Dashboard";
import { WidgetFormFields } from "./WidgetFormFields";
import _ from "lodash";
import {
  ValueAgainstFieldListType,
  ValueFieldListType,
} from "./ConnectedWidgetDashbaord";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type WidgetFormProps = {
  appName: string;
  widget?: IWidget | null;
  widgets?: IWidget[];
  modules: IModuleMetadata[];
  editMode: boolean;
  saveLoading: boolean;
  valueAgainstFieldList: ValueAgainstFieldListType[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  setValueAgainstFieldList: (values: ValueAgainstFieldListType[]) => void;
  valueFieldList: ValueFieldListType[];
  setValueFieldList: (values: ValueFieldListType[]) => void;
  onCancel: () => void;
  handleSave: (T: FormikValues) => void;
};

let initialValues = {
  name: "",
  moduleName: "",
  actions: "",
  widgetType: "table",
};

export const WidgetForm = ({
  appName,
  widget,
  widgets,
  modules,
  editMode,
  saveLoading,
  valueAgainstFieldList,
  valueFieldList,
  genericModels,
  allLayoutFetched,
  setValueFieldList,
  setValueAgainstFieldList,
  onCancel,
  handleSave,
}: WidgetFormProps) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter widget name")
      .trim()
      .min(1, "Please enter atleast 1 characters")
      .max(50, "Please enter characters less than 50"),
  });

  let editModeData: Record<string, any> = editMode
    ? {
        name: widget?.name,
        moduleName: _.get(widget?.widgetMetadata, "moduleName", null)
          ? widget?.widgetMetadata?.moduleName
          : widget?.customView && widget?.customView.length > 0
          ? widget?.customView[0].moduleName ?? ""
          : "",
        moduleViewId: widget?.moduleViewId[0]
          ? widget?.moduleViewId[0]
          : widget?.widgetMetadata?.systemModuleViewId,
        widgetType: _.get(widget?.widgetMetadata, "moduleName", null)
          ? widget?.widgetMetadata?.widgetType
          : widget?.widgetType,
      }
    : {};

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full mt-4">
      <Formik
        initialValues={{
          ...initialValues,
          ...editModeData,
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <WidgetFormFields
            appName={appName}
            editMode={editMode}
            currentWidget={widget}
            widgets={widgets}
            modules={modules?.map((module) => {
              return { value: module.name, label: module.label?.en };
            })}
            onCancel={onCancel}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            valueAgainstFieldList={valueAgainstFieldList}
            valueFieldList={valueFieldList}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            setValueFieldList={setValueFieldList}
            setValueAgainstFieldList={setValueAgainstFieldList}
          />
        )}
      </Formik>
    </form>
  );
};
