import { Formik } from "formik";
import React, { useContext } from "react";
import { UserStoreContext } from "../../../../../stores/UserStore";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormTextAreaBox from "../../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";

export type ComposeScreenProps = {};

const ComposeSettingInfo = () => {
  return (
    <div className="mb-4">
      <h2 className="text-lg">Compose Settings</h2>
      <p className="text-sm text-slate-500">
        Configure basic default email compose settings to personalize your
        composing experience.
      </p>
    </div>
  );
};

export const ComposeScreen = ({}: ComposeScreenProps) => {
  const { user } = useContext(UserStoreContext);
  return (
    <div>
      <ComposeSettingInfo />
      <div className={`p-6 bg-white rounded-lg md:max-w-[50vw] `}>
        <Formik
          initialValues={{
            fontFamily: "monospace",
            address: user?.email,
            fontSize: "12",
            preview: "The quick brown fox jumped over the lazy dog",
          }}
          onSubmit={(values) => console.log(values)}
          enableReinitialize
        >
          {({ setFieldValue, values, handleSubmit, handleChange }) => (
            <div className={`w-full grid md:grid-cols-2 gap-x-6`}>
              <FormDropdown
                name="fontFamily"
                label={`Default font family`}
                onChange={(selectedValue) => {
                  setFieldValue("fontFamily", selectedValue.target.value);
                }}
                options={[
                  {
                    value: "sans-serif",
                    label: "Comic Sans MS, Comic Sans",
                  },
                  { value: "serif", label: "Serif" },
                  { value: "monospace", label: "Monospace" },
                  { value: "cursive", label: "Cursive" },
                ]}
              />
              <FormInputBox
                name="address"
                label={`Default From Address`}
                onChange={(selectedValue) => {
                  setFieldValue("address", selectedValue.target.value);
                }}
                disabled={true}
              />
              <div className="col-span-2 w-full">
                <FormDropdown
                  name="fontSize"
                  label={`Default Font Size`}
                  onChange={(selectedValue) => {
                    setFieldValue("fontSize", selectedValue.target.value);
                  }}
                  options={[
                    { value: "8", label: "8" },
                    { value: "10", label: "10" },
                    { value: "12", label: "12" },
                    { value: "14", label: "14" },
                    { value: "16", label: "16" },
                    { value: "18", label: "18" },
                    { value: "20", label: "20" },
                  ]}
                />
                <FormTextAreaBox
                  name="preview"
                  label={`Preview`}
                  rows={2}
                  disabled={true}
                  fontStyle={`${values["fontSize"]}px`}
                  lineHeightStyle={`${Number(values["fontSize"]) * 1.5}px`}
                  fontFamilyStyle={`${values["fontFamily"]}`}
                />
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};
