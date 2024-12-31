import { useFormikContext } from "formik";
import React from "react";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormSearchBox from "../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import { SupportedApps } from "../../../../../../models/shared";
import { AccountModels } from "../../../../../../models/Accounts";
import _ from "lodash";

export type AssignOwnerFormProps = {
  editMode: boolean;
  appName: string;
  recordDraftData: any;
  modules: { value: string; label: string }[];
};

export const AssignOwnerForm = ({
  editMode,
  appName,
  recordDraftData,
  modules,
}: AssignOwnerFormProps) => {
  const { values, setFieldValue, handleChange } =
    useFormikContext<Record<string, string>>();

  React.useEffect(() => {
    if (recordDraftData && Object.keys(recordDraftData)?.length > 0) {
      const usersList = _.get(
        _.get(recordDraftData, "ownerId", {}),
        "input",
        []
      );
      setFieldValue("assignOwnerUsers", usersList);
    }
  }, [recordDraftData]);

  return (
    <>
      <FormDropdown
        required={true}
        name={`moduleName`}
        label={`Select Module`}
        options={modules}
        disabled={editMode || values["fields"]?.length > 0}
        onChange={(selectedOption) => {
          setFieldValue("moduleName", selectedOption.currentTarget.value);
        }}
      />
      <div className="col-span-full">
        <FormSearchBox
          label="Select users"
          name="assignOwnerUsers"
          appName={SupportedApps.accounts}
          modelName={AccountModels.User}
          editMode={editMode}
          disabled={!values["moduleName"]}
          multiple={true}
          searchBy={["firstName", "middleName", "lastName"]}
          fieldDisplayExpression={["firstName", "middleName", "lastName"]}
          placeholder="Please enter here to search..."
          helpText={
            Array.isArray(values["assignOwnerUsers"]) &&
            values["assignOwnerUsers"]?.length > 1 ? (
              <p className="text-xsm text-gray-600">{`The users will be assigned in a round robin pattern`}</p>
            ) : (
              <></>
            )
          }
        />
      </div>
    </>
  );
};
