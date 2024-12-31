import { useFormikContext } from "formik";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { IFieldDependencyFieldType } from "./ConnectedCreateDependency";

export const DependencyStepOne = ({
  parentFields,
  childFields,
  saveProcessing,
  setSelectedParentField,
  setSelectedChildField,
}: {
  parentFields: IFieldDependencyFieldType[];
  childFields: IFieldDependencyFieldType[];
  saveProcessing: boolean;
  setSelectedParentField: React.Dispatch<
    React.SetStateAction<IFieldDependencyFieldType | undefined>
  >;
  setSelectedChildField: React.Dispatch<
    React.SetStateAction<IFieldDependencyFieldType | undefined>
  >;
}) => {
  const { setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold"></h3>
      </div>

      <div className="grid grid-cols-[130px_minmax(150px,_200px)] items-center gap-x-6 mt-4">
        <p className="text-sm">Parent Field</p>
        <FormDropdown
          required={true}
          name={"parentField"}
          onChange={(data) => {
            setFieldValue("parentField", data.target.value);
            setSelectedParentField(
              parentFields?.filter(
                (field) => field.value === data.target.value
              )[0]
            );
          }}
          allowMargin={false}
          disabled={saveProcessing}
          placeholder={"Select Parent Field"}
          options={
            parentFields.length
              ? parentFields
              : [{ value: null, label: "None" }]
          }
        />
      </div>
      <div className="grid grid-cols-[130px_minmax(150px,_200px)] items-center gap-x-6 mt-4">
        <p className="text-sm">Child Field</p>
        <FormDropdown
          required={true}
          name={"childField"}
          onChange={(data) => {
            setFieldValue("childField", data.target.value);
            setSelectedChildField(
              childFields?.filter(
                (field) => field.value === data.target.value
              )[0]
            );
          }}
          allowMargin={false}
          disabled={saveProcessing}
          placeholder={"Select Child Field"}
          options={
            childFields.length ? childFields : [{ value: null, label: "None" }]
          }
        />
      </div>
    </>
  );
};
