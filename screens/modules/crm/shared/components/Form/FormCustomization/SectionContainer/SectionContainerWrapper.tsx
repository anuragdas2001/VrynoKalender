import React from "react";
import GenericHeaderCardContainer from "../../../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { SectionDetailsType } from "../../../../../generic/GenericForms/Shared/genericFormProps";
import { Formik, FormikErrors } from "formik";
import { get } from "lodash";
import FormDropdown from "../../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { updateSectionColumnLayouts } from "../updateSectionColumnLayout";
import Button from "../../../../../../../../components/TailwindControls/Form/Button/Button";
import { updateSectionHeading } from "../updateSectionHeading";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";

export type SectionContainerWrapperProps = {
  index: number;
  applyBorder: boolean;
  formCustomization: boolean;
  section: SectionDetailsType;
  sections: SectionDetailsType[];
  allowToggle: boolean;
  loadingCustomizationForm?: boolean;
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  setSections: (value: SectionDetailsType[]) => void;
  setSaveFormCustomization: (value: boolean) => void;
  setLoadingCustomizationForm: (value: boolean) => void;
  setDeleteSectionModal: (value: {
    visible: boolean;
    section: SectionDetailsType;
  }) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<Record<string, string>>>;
};

export const SectionContainerWrapper = ({
  index,
  applyBorder,
  formCustomization,
  section,
  sections,
  allowToggle,
  loadingCustomizationForm,
  children,
  setSections,
  setLoadingCustomizationForm,
  setSaveFormCustomization,
  setDeleteSectionModal,
  setFieldValue,
}: SectionContainerWrapperProps) => {
  return (
    <GenericHeaderCardContainer
      key={index}
      setSaveFormCustomization={setSaveFormCustomization}
      cardHeading={get(section, "sectionLabel", "")}
      extended={true}
      applyBorder={applyBorder}
      allowToggle={formCustomization ? false : allowToggle}
      allowOverflow={true}
      customizeHeader={formCustomization}
      section={section}
      loadingCustomizationForm={loadingCustomizationForm}
      setLoadingCustomizationForm={(value) =>
        setLoadingCustomizationForm(value)
      }
      updateSectionHeading={(value, section) =>
        setSections(updateSectionHeading(sections, value, section))
      }
      renderHtmlNextToOpenCloseButton={
        formCustomization ? (
          <div className="flex items-center justify-center gap-x-3">
            <Formik
              initialValues={{
                [`${get(section, "sectionLabel", "")}-${section}-dropdown`]:
                  section.columnLayout,
              }}
              enableReinitialize
              onSubmit={(values) => {}}
            >
              {({ values, handleSubmit }) => (
                <FormDropdown
                  name={`${get(
                    section,
                    "sectionLabel",
                    ""
                  )}-${section}-dropdown`}
                  options={[
                    { value: "1", label: "1 Column" },
                    { value: "2", label: "2 Column" },
                    { value: "3", label: "3 Column" },
                    { value: "4", label: "4 Column" },
                  ]}
                  stopEventPropagation={true}
                  onChange={(e) => {
                    setFieldValue(
                      `${get(section, "sectionLabel", "")}-${section}-dropdown`,
                      e.target.value
                    );
                    setSections(
                      updateSectionColumnLayouts(
                        sections,
                        section,
                        e.target.value
                      )
                    );
                  }}
                />
              )}
            </Formik>
          </div>
        ) : (
          <></>
        )
      }
      renderHtmlRightToOpenCloseButton={
        !section.systemDefined && formCustomization ? (
          <Button
            id="form-field-delete-icon"
            customStyle="p-1 rounded-full bg-red-400 text-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteSectionModal({
                visible: true,
                section: section,
              });
            }}
            userEventName="formField-delete-icon-click"
          >
            <DeleteIcon size={16} />
          </Button>
        ) : (
          <></>
        )
      }
    >
      {children}
    </GenericHeaderCardContainer>
  );
};
