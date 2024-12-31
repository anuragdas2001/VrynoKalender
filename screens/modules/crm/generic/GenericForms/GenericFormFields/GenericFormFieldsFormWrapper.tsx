export const GenericFormFieldsFormWrapper = ({
  children,
  currentFormLayer,
  formCustomization,
  loadingCustomizationForm,
  saveLoading,
  saveFormCustomization,
  saveCustomizationFormError,
  handleCustomFieldsSave,
  handleSave,
}: {
  children: React.ReactNode;
  currentFormLayer: boolean;
  formCustomization?: boolean;
  loadingCustomizationForm: boolean;
  saveLoading: boolean;
  saveFormCustomization: boolean;
  saveCustomizationFormError: boolean;
  handleCustomFieldsSave: () => void;
  handleSave: () => void;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (formCustomization) {
          !loadingCustomizationForm && handleCustomFieldsSave();
          return;
        }
        handleCustomFieldsSave();
        handleSave();
      }}
      onKeyPress={(e) => {
        if (
          e.key === "Enter" &&
          currentFormLayer &&
          !(
            saveLoading ||
            saveFormCustomization ||
            saveCustomizationFormError ||
            loadingCustomizationForm
          )
        ) {
          const focusedElement = document.activeElement;
          if (
            focusedElement?.id === "add-section" ||
            focusedElement?.id === "customize-form"
          )
            return;
          e.preventDefault();
          if (formCustomization) {
            !loadingCustomizationForm && handleCustomFieldsSave();
            return;
          }
          handleCustomFieldsSave();
          handleSave();
        }
      }}
      className="w-full"
    >
      {children}
    </form>
  );
};
