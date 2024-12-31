import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import EditIcon from "remixicon-react/PencilLineIcon";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { GenericFormFieldsHeaderChildrenProps } from "../Shared/genericFormProps";
import { useTranslation } from "react-i18next";

export const GenericFormFieldsHeaderChildren = ({
  modelName,
  currentUser,
  formCustomization,
  saveFormCustomization,
  saveLoading,
  saveNext,
  editMode,
  saveCustomizationFormError,
  loadingCustomizationForm,
  subFormValidationErrors,
  formDetails,
  onCancel,
  handleSave,
  handleSaveNext,
  handleCustomFieldsSave,
  setAddNewSection,
  setFormCustomization,
  setSaveFormCustomization,
}: GenericFormFieldsHeaderChildrenProps) => {
  const { t } = useTranslation(["common"]);
  const subDomain = window.location.hostname.split(".")[0];
  return (
    <div
      className={`grid grid-cols-9 sm:grid-cols-6 sm:max-w-lg gap-x-4 mt-5 sm:mt-0 w-full sm:w-1/2`}
    >
      <div
        className={`col-span-3 sm:col-span-2 ${
          subDomain === "recko-lead" && !currentUser?.isInstanceAdmin
            ? "invisible"
            : ""
        }`}
      >
        <Button
          id={"customize-form"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setFormCustomization(!formCustomization);
          }}
          buttonType="thin"
          disabled={
            saveLoading || saveFormCustomization || loadingCustomizationForm
          }
          kind={!formCustomization ? "white" : "back"}
          userEventName={`generic-form-customize-${modelName}-form-click`}
        >
          <span className="flex gap-x-2 items-center justify-center">
            <EditIcon size={16} /> {t("common:Customize")}
          </span>
        </Button>
      </div>
      <div className="col-span-3 sm:col-span-2">
        {formCustomization ? (
          <Button
            id={"add-section"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAddNewSection(true);
            }}
            loading={saveLoading}
            buttonType="thin"
            disabled={
              saveLoading || saveFormCustomization || loadingCustomizationForm
            }
            kind={"icon"}
            userEventName={`generic-form-add-${modelName}-form-section-click`}
          >
            <span className={`flex items-center justify-center gap-x-3`}>
              <AddIcon size={20} />
              {t("common:Section")}
            </span>
          </Button>
        ) : (
          <Button
            id={formDetails.type === "add" ? "save-form" : "cancel-form"}
            onClick={
              formDetails.type === "add"
                ? () => {
                    handleCustomFieldsSave();
                    handleSave();
                  }
                : () => onCancel()
            }
            loading={
              formDetails.type === "add" && !saveNext ? saveLoading : false
            }
            buttonType="thin"
            disabled={
              Object.keys(subFormValidationErrors)?.length
                ? true
                : false || saveLoading || formCustomization
            }
            kind={"icon"}
            userEventName={`generic-form-${
              formDetails.type === "add" ? "save" : "cancel"
            }-${modelName}-click`}
          >
            {formDetails.type === "add" ? t("common:save") : t("common:cancel")}
          </Button>
        )}
      </div>
      <div className="col-span-3 sm:col-span-2">
        {formCustomization ? (
          <Button
            id={"save-form-customization"}
            onClick={() => setSaveFormCustomization(true)}
            loading={saveLoading || saveFormCustomization}
            buttonType="thin"
            disabled={
              Object.keys(subFormValidationErrors)?.length
                ? true
                : false ||
                  saveLoading ||
                  saveFormCustomization ||
                  saveCustomizationFormError ||
                  loadingCustomizationForm
            }
            kind={"primary"}
            userEventName={`generic-form-save-${modelName}-click`}
          >
            {t("common:Save")}
          </Button>
        ) : (
          <Button
            id={`${
              !editMode
                ? `save-${formDetails.modelName}`
                : `update-${formDetails.modelName}`
            }`}
            onClick={
              formDetails.type === "add"
                ? () => {
                    handleCustomFieldsSave();
                    handleSaveNext();
                  }
                : () => {
                    handleCustomFieldsSave();
                    handleSave();
                  }
            }
            buttonType="thin"
            disabled={
              Object.keys(subFormValidationErrors)?.length
                ? true
                : false || saveLoading || formCustomization
            }
            kind={"primary"}
            loading={
              formDetails.type === "add" && saveNext
                ? saveLoading
                : formDetails.type !== "add" && !saveNext
                ? saveLoading
                : false
            }
            userEventName={`generic-form-${
              formDetails.type === "add" ? "save-next" : "save"
            }-click`}
          >
            {formDetails.type === "add"
              ? t("common:save-next")
              : t("common:save")}
          </Button>
        )}
      </div>
    </div>
  );
};
