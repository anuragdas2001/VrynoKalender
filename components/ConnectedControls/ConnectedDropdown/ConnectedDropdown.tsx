import { useLazyQuery } from "@apollo/client";
import React from "react";
import { FETCH_QUERY } from "../../../graphql/queries/fetchQuery";
import { ILookupMapperInput } from "../../../models/shared";
import { useFormikContext } from "formik";
import FormDropdown from "../../TailwindControls/Form/Dropdown/FormDropdown";

export type ConnectedDropdownProps = {
  required?: boolean;
  name: string;
  label?: string;
  editMode?: boolean;
  appName?: string;
  modelName?: string;
  filters?: { type: string };
  fields?: Array<string>;
  allowMargin?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
};

export const ConnectedDropdown = ({
  required,
  name,
  label,
  appName,
  modelName,
  filters = { type: "" },
  fields = [],
  editMode = false,
  allowMargin = true,
  disabled = false,
  placeholder,
  onChange = () => {},
}: ConnectedDropdownProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [dropdownDataFetched, setDrpodownDataFetched] = React.useState<
    Array<any>
  >([]);

  const lookupMapper = (item: ILookupMapperInput) => ({
    value: item.id,
    label: item.defaultLabel,
  });

  const [getDropdownListData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        let resultData: { value: string; label: string }[] = [];
        let data = responseOnCompletion.fetch.data.map(lookupMapper);
        data.map((item: { value: string; label: string }) => {
          let commonData = dropdownDataFetched.filter(
            (data: { value: string; label: string }) =>
              JSON.stringify(data) === JSON.stringify(item)
          );
          if (commonData.length === 0) resultData.push(item);
        });
        setDrpodownDataFetched([...dropdownDataFetched, ...resultData]);
      }
    },
  });

  const [getEditModeLookupValues] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        let data = responseOnCompletion.fetch.data.map(lookupMapper);
        setDrpodownDataFetched(data);
      }
    },
  });

  const handleDropdownSelection = (additionalFilters: any) => {
    const queryFilters = Object.keys(additionalFilters).map((obj) => {
      return {
        operator: "eq",
        name: obj,
        value: [additionalFilters[obj]],
      };
    });
    getDropdownListData({
      variables: {
        modelName: modelName,
        fields: ["id"].concat(fields),
        filters: queryFilters,
      },
    });
  };

  React.useEffect(() => {
    if (editMode && values[name] !== null && appName) {
      getEditModeLookupValues({
        variables: {
          modelName: modelName,
          fields: ["id"].concat(fields),
          filters: [
            {
              operator: "in",
              name: "id",
              value: values[name],
            },
          ],
        },
      });
    }
  }, [appName]);

  React.useEffect(() => {
    if (!appName) return;
    filters.type ? handleDropdownSelection(filters) : {};
  }, [filters.type, appName]);

  return (
    <FormDropdown
      required={required}
      name={name}
      label={label}
      onChange={onChange}
      allowMargin={allowMargin}
      disabled={disabled}
      placeholder={placeholder}
      options={dropdownDataFetched}
    />
  );
};
