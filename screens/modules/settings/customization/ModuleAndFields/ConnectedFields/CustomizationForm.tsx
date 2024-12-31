import React from "react";
import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import handleCustomFieldSave from "./handleCustomFieldSave";
import CustomizationFormFields from "./CustomizationFormFields";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { getFieldsFromDisplayExpression } from "../../../../crm/shared/utils/getFieldsFromDisplayExpression";
import { User } from "../../../../../../models/Accounts";
import { toast } from "react-toastify";
import { lookupMapper } from "../../../../crm/shared/utils/staticLookupMapper";

export type CustomizationFormProps = {
  data: any;
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  user: User | null;
  onCancel: () => void;
  modules: IModuleMetadata[];
  fieldList: ICustomField[];
  currentModule?: string;
};

let fieldInitialValues = {
  moduleName: "",
  dataType: null,
  order: null,
  label: "",
  name: "",
  mandatory: false,
  visible: false,
};

const CustomizationForm = ({
  data,
  handleSave,
  saveLoading,
  editMode = false,
  user,
  onCancel = () => {},
  modules,
  fieldList,
  currentModule,
}: CustomizationFormProps) => {
  const { navigations } = React.useContext(NavigationStoreContext);
  const validationSchema = Yup.object().shape({
    dataType: Yup.string().nullable().required("Please select a data type"),
    label: Yup.string()
      .required("Label is required")
      .matches(/^\S+(?:\s+\S+)*$/g, "Name cannot contain trailing blankspaces"),
    name: Yup.string().required(`Name is required`),
    displayInReverseLookupAs: Yup.string()
      .notRequired()
      .max(50, "Cannot have value more than 50 characters"),
  });

  const dataTypeMetadataPayload =
    !Array.isArray(data.dataTypeMetadata) &&
    data?.dataTypeMetadata?.allLookups?.length > 0;

  const isModuleAvailableInNavigation = navigations?.find(
    (nav) => nav?.navTypeMetadata?.moduleName === currentModule
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          ...fieldInitialValues,
          ...data,
          ...{
            name: data.name,
            label: data?.label?.en,
            equal: data?.validations?.equal,
            matches: data?.validations?.matches,
            maxVal: data?.validations?.maxVal,
            minVal: data?.validations?.minVal,
            checkDuplicacy: data?.checkDuplicacy,
            showInQuickCreate:
              !editMode && !isModuleAvailableInNavigation?.visible
                ? true
                : data?.showInQuickCreate,
            isMasked: data?.isMasked,
            maskedPattern: data?.maskedPattern,
            prefix: data?.dataTypeMetadata?.prefix,
            suffix: data?.dataTypeMetadata?.suffix,
            readOnly: data?.readOnly,
            paddingCharacter: data?.dataTypeMetadata?.padding?.character,
            paddingLength: data?.dataTypeMetadata?.padding?.frequency,
            numberPrecision:
              data.dataType === "expression"
                ? String(data?.dataTypeMetadata?.format?.precision) ?? "0"
                : String(data?.dataTypeMetadata?.precision) ?? "0",
            lookupOptions:
              Array.isArray(data.dataTypeMetadata) &&
              data.dataTypeMetadata &&
              data.dataType === "stringLookup"
                ? data.dataTypeMetadata
                : dataTypeMetadataPayload &&
                  (data.dataType === "lookup" ||
                    data.dataType === "multiSelectLookup")
                ? data.dataTypeMetadata.lookupOptions
                : [],
            searchByFields:
              dataTypeMetadataPayload &&
              getFieldsFromDisplayExpression(
                data?.dataTypeMetadata?.allLookups[0]?.displayExpression
              ),
            formulaBuilder: data?.dataTypeMetadata?.expression,
            allowColour: data?.dataTypeMetadata?.allowColour,
            recordLookupAppName:
              dataTypeMetadataPayload &&
              data?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[0],
            recordLookupModule:
              dataTypeMetadataPayload &&
              data?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1],
            recordLookupFields:
              dataTypeMetadataPayload &&
              data?.dataTypeMetadata?.allLookups[0]?.fieldName,
            recordLookupFilters:
              dataTypeMetadataPayload &&
              data?.dataTypeMetadata?.allLookups[0].additionalFilters,
            displayInReverseLookupAs:
              dataTypeMetadataPayload &&
              data?.dataTypeMetadata?.allLookups[0].displayInReverseLookupAs,
            isSubform: data?.dataTypeMetadata?.isSubform,
            defaultOption:
              (data.dataType === "lookup" ||
                data.dataType === " stringLookup" ||
                data.dataType === "array-string" ||
                data.dataType === "array-number") &&
              data.dataTypeMetadata.lookupOptions
                ? lookupMapper(data.dataTypeMetadata.lookupOptions)?.filter(
                    (option) => option.defaultOption
                  )?.length > 0
                  ? lookupMapper(data.dataTypeMetadata.lookupOptions)?.filter(
                      (option) => option.defaultOption
                    )[0].value
                  : null
                : null,
            multiDefaultOptions:
              data.dataType === "multiSelectLookup" &&
              data.dataTypeMetadata.lookupOptions
                ? lookupMapper(data.dataTypeMetadata.lookupOptions)?.filter(
                    (option) => option.defaultOption
                  )?.length > 0
                  ? lookupMapper(data.dataTypeMetadata.lookupOptions)
                      ?.map((option) =>
                        option.defaultOption ? option.value : null
                      )
                      ?.filter((value) => value)
                  : null
                : null,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (values["isMasked"] && !values["maskedPattern"]) {
            toast.error("Masked pattern is required");
            return;
          }
          handleSave(
            handleCustomFieldSave(
              values,
              editMode,
              fieldList,
              data,
              user?.timezone
            )
          );
        }}
        validateOnChange={false}
      >
        {({ handleSubmit }) => (
          <CustomizationFormFields
            data={data}
            editMode={editMode}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            onCancel={onCancel}
            modules={modules}
            fieldList={fieldList}
            currentModule={currentModule}
          />
        )}
      </Formik>
    </form>
  );
};

export default CustomizationForm;
