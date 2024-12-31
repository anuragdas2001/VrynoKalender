import React from "react";
import { ICustomField } from "../../../../../models/ICustomField";
import _, { kebabCase } from "lodash";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import {
  datatypeOperatorDict,
  datatypeOperatorSymbolDict,
} from "../../../../../shared/datatypeOperatorDict";
import { useFormikContext } from "formik";
import { DropdownSelect } from "./ViewUtils/DropdownSelect";
import { FilterFieldPerOperatorPerDatatype } from "./ViewUtils/FilterFieldPerOperatorPerDatatype";
import { ICustomView, IUserPreference } from "../../../../../models/shared";
import { paramCase } from "change-case";
import { getDictionaryOptionsForFilters } from "../../shared/utils/getDictionaryOptionsForFilters";

type FieldsFiltersSideBarMenuProp = {
  field: ICustomField;
  index: number;
  modelName: string;
  disabled: boolean;
  checkedStatus: boolean;
  currentCustomView?: ICustomView;
  userPreferences: IUserPreference[];
  onSelectFilterField: (value: any) => void;
};

export const FieldsFiltersSideBarMenu = ({
  field,
  index,
  modelName,
  disabled,
  checkedStatus,
  currentCustomView,
  userPreferences,
  onSelectFilterField,
}: FieldsFiltersSideBarMenuProp) => {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  return (
    <>
      <div
        id={field.name}
        className={`text-sm rounded-md rounded-l-none block py-2 my-1 px-1 ${
          disabled ? "" : "cursor-pointer"
        } hover:bg-gray-100 break-all`}
        onClick={(e) => {}}
      >
        <div className={`w-full h-full gap-x-3 grid grid-cols-3 mb-1.5`}>
          <div
            className={`flex items-center text-xsm gap-x-2 ${
              checkedStatus ? "col-span-2" : "col-span-3"
            }`}
          >
            <div>
              <input
                id={`${kebabCase(modelName)}-select-${field.name}`}
                data-testid={paramCase(`checkbox-${field.name}`)}
                type="checkbox"
                name={`selected-filter-${field.name}`}
                checked={checkedStatus}
                disabled={disabled}
                readOnly={true}
                className={`text-white bg-vryno-theme-light-blue rounded-md ${
                  disabled ? "" : "cursor-pointer"
                } `}
                style={{ width: "12px", height: "12px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFilterField(field);
                  MixpanelActions.track(
                    `${modelName}-card-item-select-${field.name}:action-click`,
                    { type: "click" }
                  );
                }}
              />
            </div>
            <p className="gap-x-1.5 truncate">
              <p className="truncate">
                <span
                  data-testid={paramCase(_.get(field.label, "en", ""))}
                  className=""
                >
                  {_.get(field.label, "en", "")}
                </span>
              </p>
            </p>
          </div>
          <div className={`${checkedStatus ? "" : "hidden"}`}>
            <DropdownSelect
              name={`operator${field.name}`}
              required={true}
              disabled={false}
              editMode={false}
              options={
                getDictionaryOptionsForFilters(
                  datatypeOperatorDict[field.dataType],
                  [field],
                  field.name
                ) ?? []
              }
              onChange={(selectedOption: any) => {
                setFieldValue(
                  `operator${field.name}`,
                  selectedOption.currentTarget.value
                );
                if (values[`value${field.name}-between-start`]) {
                  setFieldValue(`value${field.name}-between-start`, null);
                }
                if (values[`value${field.name}-between-end`]) {
                  setFieldValue(`value${field.name}-between-end`, null);
                }
                if (selectedOption.currentTarget.value.includes("d_")) {
                  setFieldValue(
                    `value${field.name}`,
                    datatypeOperatorSymbolDict[
                      selectedOption.currentTarget.value
                    ]
                  );
                } else if (selectedOption.currentTarget.value.includes("is_")) {
                  setFieldValue(
                    `value${field.name}`,
                    selectedOption.currentTarget.value === "is_empty"
                      ? "empty"
                      : "not empty"
                  );
                } else if (selectedOption.currentTarget.value === "any_value") {
                  setFieldValue(`value${field.name}`, "any_value");
                } else if (field.dataType === "phoneNumber") {
                  if (values[`value${field.name}`]) {
                    setFieldValue(`value${field.name}`, undefined);
                  } else setFieldValue(`value${field.name}`, null);
                } else setFieldValue(`value${field.name}`, "");
              }}
            />
          </div>
        </div>
        <div className={`${checkedStatus ? "" : "hidden"}`}>
          <FilterFieldPerOperatorPerDatatype
            name={field.name}
            modelName={modelName}
            disabled={false}
            selectedField={field}
            userPreferences={userPreferences}
          />
        </div>
      </div>
    </>
  );
};
