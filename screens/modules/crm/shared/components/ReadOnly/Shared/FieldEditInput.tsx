import { Formik, FormikValues } from "formik";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { FormFieldPerDataType } from "../../Form/FormFieldPerDataType";
import SaveIcon from "remixicon-react/SaveLineIcon";
import CloseIcon from "remixicon-react/CloseCircleLineIcon";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../../graphql/mutations/saveMutation";
import { SupportedApps } from "../../../../../../../models/shared";
import { toast } from "react-toastify";
import { getAppPathParts } from "../../../utils/getAppPathParts";
import React from "react";
import { IEditInputDetails } from "./ShowFieldEdit";
import getValidationSchema from "../../../utils/validations/getValidationSchema";
import { getCorrectTimezone } from "../../../../../../../shared/dateTimeTimezoneFormatter";
import moment from "moment";
import { UserStoreContext } from "../../../../../../../stores/UserStore";
import { Loading } from "../../../../../../../components/TailwindControls/Loading/Loading";
import { handleFieldValueMutator } from "../../../utils/handleGenericFormSave";
import { NavigationStoreContext } from "../../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { camelCase } from "change-case";

export const FieldEditInput = ({
  field,
  countryCodeInUserPreference,
  appName,
  modelName,
  setEditInputDetails,
  editInputDetails,
  updateModelFieldData,
  updateSearchResults,
  setMaskedFieldData,
}: {
  field: ICustomField | undefined;
  countryCodeInUserPreference?: string;
  appName?: SupportedApps;
  modelName?: string;
  setEditInputDetails: (value: IEditInputDetails) => void;
  editInputDetails: IEditInputDetails;
  updateModelFieldData:
    | ((field: string, value: any, id: string) => void)
    | null;
  updateSearchResults?: (value: any) => void;
  setMaskedFieldData?: (value: { oldValue: any; newValue: any }) => void;
}) => {
  const { id } = getAppPathParts();
  const { navigations } = React.useContext(NavigationStoreContext);
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const [dataProcessing, setDataProcessing] = React.useState(false);
  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName || SupportedApps.crm,
      },
    },
  });

  const handleSave = async (values: FormikValues) => {
    const recordId = editInputDetails.id || id;
    if (!field) {
      toast.error("Field detail is required to save the record");
      return;
    }
    if (!modelName?.length) {
      toast.error("Model name is required to save the record");
      return;
    }
    if (!recordId?.length) {
      toast.error("Record id is required to save the record");
      return;
    }
    setDataProcessing(true);

    await saveData({
      variables: {
        id: recordId,
        modelName: modelName,
        saveInput: field?.systemDefined
          ? { [field.name]: handleFieldValueMutator(field, values[field.name]) }
          : {
              fields: {
                [field.name]: handleFieldValueMutator(
                  field,
                  values[field.name]
                ),
              },
            },
      },
    }).then(async (responseOnCompletion) => {
      if (responseOnCompletion?.data?.save?.messageKey.includes("-success")) {
        const responseData = responseOnCompletion?.data?.save?.data;
        const fieldData = field?.systemDefined
          ? responseData[field.name]
          : responseData.fields[field.name];
        const finalFieldData =
          field.isMasked && fieldData
            ? fieldData?.replace(/\S/g, field.maskedPattern)
            : fieldData;
        setEditInputDetails({
          visible: false,
          fieldData: null,
          id: undefined,
        });
        updateModelFieldData &&
          updateModelFieldData(field.name, finalFieldData, recordId);
        setMaskedFieldData &&
          field.isMasked &&
          setMaskedFieldData({
            oldValue: finalFieldData,
            newValue: fieldData,
          });
        updateSearchResults && updateSearchResults({});
        toast.success(
          `${
            navigations.filter(
              (navigation) =>
                navigation.navTypeMetadata?.moduleName &&
                camelCase(navigation.navTypeMetadata?.moduleName) === modelName
            )[0]?.label.en
          } updated successfully`
        );
        setDataProcessing(false);
      } else {
        toast.error(responseOnCompletion?.data?.save?.message);
        setDataProcessing(false);
      }
    });
  };

  return (
    <Formik
      initialValues={
        field?.name
          ? {
              [field.name]: editInputDetails?.fieldData ?? null,
            }
          : {}
      }
      validationSchema={
        field ? getValidationSchema([field], modelName) : undefined
      }
      onSubmit={(values) => {
        if (field?.dataType == "datetime") {
          values[field.name] = user?.timezone
            ? getCorrectTimezone(values[field.name], user?.timezone)
            : moment(values[field.name]).toISOString();
        }
        handleSave(values);
      }}
    >
      {({ values, setFieldValue, handleSubmit }) => {
        return field ? (
          <div className="relative z-[1001] flex gap-x-2 items-center">
            <FormFieldPerDataType
              field={field}
              isSample={false}
              setFieldValue={setFieldValue}
              modelName={modelName ?? field?.modelName ?? ""}
              editMode={true}
              values={values}
              countryCodeInUserPreference={countryCodeInUserPreference || ""}
              enableRichTextReinitialize={true}
              showLabel={false}
              disabled={dataProcessing}
              allowMargin={false}
              useExpression={false}
              switchWidth="auto"
            />
            <div className="flex gap-x-1 cursor-pointer">
              {dataProcessing ? (
                <Loading />
              ) : (
                <SaveIcon
                  size={18}
                  className="text-vryno-theme-light-blue"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!dataProcessing) handleSubmit();
                  }}
                  data-testid={`${
                    field?.label?.en ?? field?.name
                  }-inline-edit-save`}
                />
              )}
              <CloseIcon
                size={18}
                className="text-vryno-danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!dataProcessing)
                    setEditInputDetails({
                      visible: false,
                      fieldData: null,
                      id: undefined,
                    });
                }}
                data-testid={`${
                  field?.label?.en ?? field?.name
                }-inline-edit-close`}
              />
            </div>
          </div>
        ) : (
          <></>
        );
      }}
    </Formik>
  );
};
