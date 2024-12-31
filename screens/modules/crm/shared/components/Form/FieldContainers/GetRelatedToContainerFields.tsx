import FormRelatedTo from "../../../../../../../components/TailwindControls/Form/RelatedTo/FormRelatedTo";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";
import { IGenericFormDetails } from "../../../../generic/GenericModelDetails/IGenericFormDetails";

export const GetRelatedToContainerFields = ({
  fieldList,
  editMode,
  formResetted,
  required = false,
  rejectRequired = false,
  formDetails,
  disabled,
  fieldCustomization = false,
  sectionDetails,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  setCurrentFormLayer = () => {},
}: {
  fieldList: ICustomField[];
  editMode: boolean;
  formResetted?: boolean;
  required?: boolean;
  rejectRequired?: boolean;
  addClear?: boolean;
  disabled?: boolean;
  formDetails?: IGenericFormDetails;
  fieldCustomization?: boolean;
  sectionDetails?: SectionDetailsType;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  setCurrentFormLayer?: (value: boolean) => void;
}) => {
  return (
    <>
      {fieldList.flatMap((field: ICustomField, index) => {
        if (field.dataType === "relatedTo") {
          if (fieldCustomization) {
            return (
              <div
                key={`field_${index}`}
                className={`border rounded-lg border-dashed bg-gray-100 border-gray-400 px-2 flex items-center justify-center gap-x-4`}
              >
                <div
                  className={`w-full ${
                    fieldCustomization ? "z-10 opacity-60 relative" : ""
                  }`}
                >
                  <FormRelatedTo
                    required={required ? true : field.mandatory}
                    name={field.name}
                    label={field.label["en"]}
                    editMode={editMode}
                    externalExpressionToCalculateValue={field.expression}
                    formResetted={formResetted}
                    rejectRequired={rejectRequired}
                    disabled={fieldCustomization ? true : disabled}
                    formDetails={formDetails}
                    genericModels={genericModels}
                    allLayoutFetched={allLayoutFetched}
                    allModulesFetched={allModulesFetched}
                    setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
                  />
                </div>
              </div>
            );
          } else
            return (
              <FormRelatedTo
                required={required ? true : field.mandatory}
                name={field.name}
                label={field.label["en"]}
                editMode={editMode}
                externalExpressionToCalculateValue={field.expression}
                formResetted={formResetted}
                rejectRequired={rejectRequired}
                disabled={fieldCustomization ? true : disabled}
                formDetails={formDetails}
                genericModels={genericModels}
                allLayoutFetched={allLayoutFetched}
                allModulesFetched={allModulesFetched}
                setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
              />
            );
        } else {
          return [];
        }
      })}
    </>
  );
};
