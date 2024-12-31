import React, { useContext } from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { ICustomView, IUserPreference } from "../../../../../models/shared";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { useTranslation } from "next-i18next";
import { FormikValues, useFormikContext } from "formik";
import { customViewValueGenerator } from "../GenericAddCustomView/customViewHelpers/customViewValueGenerator";
import { ICustomField } from "../../../../../models/ICustomField";
import { FieldsFiltersSideBarMenu } from "./FieldsFiltersSideBarMenu";
import { getInitialValueForField } from "../../shared/utils/getInitialValuesFromList";
import { paramCase } from "change-case";
import CloseIcon from "remixicon-react/CloseLineIcon";
import SearchIcon from "remixicon-react/SearchLineIcon";
import { User } from "../../../../../models/Accounts";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { get } from "lodash";

export interface FormikActions<Values> {
  values: FormikValues;
  setFieldValue<Field extends keyof Values>(
    field: Field,
    value: Values[Field],
    shouldValidate?: boolean
  ): void;
}

export type CustomViewsSideBarMenuProps = {
  user: User | null;
  customViews: ICustomView[];
  currentCustomView?: ICustomView;
  customModuleViewPermissions?: boolean;
  fieldsList?: ICustomField[];
  sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[];
  selectedFilterFields: any[];
  customViewFiltersUpdateLoading?: boolean;
  userPreferences: IUserPreference[];
  appMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  instanceMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  setSelectedFilterFields: (value: any[]) => void;
  setSortingFieldList?: (
    value: { name: string; order: "ASC" | "DESC" | "None" }[]
  ) => void;
  setSideMenuClass?: (value: string) => void;
  onSelectFilterField: (value: any) => void;
  handleApplyTemparoryFilter?: (
    selectedFilterFields: {
      name: string | null;
      operator: string | null;
      value: any[] | null;
      logicalOperator: string | null;
    }[],
    sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[],
    calledFrom?: "localStorage" | "web"
  ) => void;
  handleClearFilters?: () => void;
};

const CustomViewsSideBarMenu = ({
  user,
  customViews,
  currentCustomView,
  customModuleViewPermissions,
  fieldsList,
  sortingFieldList = [],
  selectedFilterFields,
  customViewFiltersUpdateLoading,
  setSelectedFilterFields,
  userPreferences,
  instanceMessage,
  appMessage,
  setSortingFieldList = () => {},
  setSideMenuClass = () => {},
  onSelectFilterField,
  handleApplyTemparoryFilter = () => {},
  handleClearFilters = () => {},
}: CustomViewsSideBarMenuProps) => {
  const { t } = useTranslation(["common"]);
  let { modelName } = getAppPathParts();

  const [currentCustomViewSelected, setCurrentCustomviewSelected] =
    React.useState<any>();
  const { values, setFieldValue, resetForm } = useFormikContext<FormikValues>();

  React.useEffect(() => {
    if (customViews && currentCustomView) {
      setCurrentCustomviewSelected(currentCustomView);
    }
  }, [customViews, currentCustomView]);

  React.useEffect(() => {
    if (sortingFieldList?.length === 0 && selectedFilterFields?.length === 0) {
      handleClearFilters();
    }
  }, [sortingFieldList, selectedFilterFields]);

  React.useEffect(() => {
    if (localStorage.getItem(`quickFilter-${modelName}`)) {
      let updatedFilterFieldList: any[] = [];
      const filters: any[] =
        JSON.parse(localStorage.getItem(`quickFilter-${modelName}`) ?? "") ??
        [];
      filters?.forEach((filter) => {
        const findFieldIndex: number =
          fieldsList?.findIndex((field) =>
            field.systemDefined
              ? field.name === filter.name
              : `fields.${field.name}` === filter.name
          ) ?? -1;
        if (findFieldIndex !== -1 && fieldsList) {
          updatedFilterFieldList.push(fieldsList[findFieldIndex]);
        }
        setFieldValue(`operator${filter.name}`, filter.operator);
        if (filter.operator === "between") {
          setFieldValue(`value${filter.name}-between-start`, filter.value[0]);
          setFieldValue(`value${filter.name}-between-end`, filter.value[1]);
        } else {
          setFieldValue(`value${filter.name}`, filter.value);
        }
      });
      setSelectedFilterFields([...updatedFilterFieldList]);

      handleApplyTemparoryFilter(
        [...updatedFilterFieldList]?.map((field, index) => {
          const findFilterIndex =
            filters.findIndex((filter) =>
              field.systemDefined
                ? field.name === filter.name
                : `fields.${field.name}` === filter.name
            ) ?? -1;
          return customViewValueGenerator(
            field.systemDefined ? field.name : `fields.${field.name}`,
            filters[findFilterIndex].operator,
            filters[findFilterIndex].operator === "between"
              ? filters[findFilterIndex].value
              : field.dataType === "multiSelectLookup" ||
                field.dataType === "multiSelectRecordLookup"
              ? filters[findFilterIndex].value ?? values[`value${field.name}`]
              : [
                  filters[findFilterIndex].value ??
                    values[`value${field.name}`],
                ],
            "AND",
            field.dataType,
            user?.timezone
          );
        }),
        sortingFieldList,
        "localStorage"
      );
    }
  }, [localStorage.getItem(`quickFilter-${modelName}`)]);

  if (customModuleViewPermissions) {
    return (
      <div className="w-full h-full">
        <div className="w-full flex justify-between items-center">
          <span
            data-testid={paramCase("Filter by Fields")}
            className={`text-base flex items-center rounded-md py-1.5 px-1 break-all text-vryno-label-gray`}
          >
            Filter by Fields
          </span>
          <Button
            id="mobile-custom-view-quick-filter-close-icon"
            onClick={(e) => {
              e.preventDefault();
              setSideMenuClass("-translate-x-full");
            }}
            customStyle="sidebar-menu-button text-vryno-navbar-name-container mr-2 cursor-pointer lg:hidden"
            userEventName="mobile-custom-view-quick-filter-close:action-click"
          >
            <CloseIcon size={30} />
          </Button>
        </div>
        <hr className="py-2" />
        <>
          <div
            className={`${
              selectedFilterFields?.length > 0 ? "" : "hidden"
            } grid grid-cols-2 gap-x-4 mb-2`}
          >
            <Button
              id={`apply-custom-view-filter`}
              onClick={() => {
                handleApplyTemparoryFilter(
                  selectedFilterFields?.map((field, index) =>
                    customViewValueGenerator(
                      field.systemDefined ? field.name : `fields.${field.name}`,
                      values[`operator${field.name}`],
                      values[`operator${field.name}`] === "between"
                        ? [
                            values[`value${field.name}-between-start`],
                            values[`value${field.name}-between-end`],
                          ]
                        : field.dataType === "multiSelectLookup" ||
                          field.dataType === "multiSelectRecordLookup"
                        ? values[`value${field.name}`]
                        : [values[`value${field.name}`]],
                      "AND",
                      field.dataType,
                      user?.timezone
                    )
                  ),
                  sortingFieldList
                );
                localStorage.setItem(
                  `quickFilter-${modelName}`,
                  JSON.stringify(
                    selectedFilterFields?.map((field, index) => {
                      return {
                        name: field.systemDefined
                          ? field.name
                          : `fields.${field.name}`,
                        operator: values[`operator${field.name}`],
                        value:
                          values[`operator${field.name}`] === "between"
                            ? [
                                values[`value${field.name}-between-start`],
                                values[`value${field.name}-between-end`],
                              ]
                            : values[`value${field.name}`],
                      };
                    })
                  )
                );
                setFieldValue("filter-fields", "");
              }}
              loading={customViewFiltersUpdateLoading}
              buttonType="thin"
              disabled={customViewFiltersUpdateLoading}
              kind={"icon"}
              userEventName={`apply-custom-view-filter-${modelName}-click`}
            >
              {t("common:Apply")}
            </Button>
            <Button
              id={`clear-custom-view-filter`}
              onClick={() => {
                fieldsList
                  ?.filter(
                    (field) =>
                      !["recordImage", "image"].includes(field.dataType)
                  )
                  ?.filter((field) => field.visible)
                  ?.forEach((field) => {
                    setFieldValue(`operator${field.name}`, "eq");
                    setFieldValue(
                      `value${field.name}`,
                      getInitialValueForField(field)
                    );
                  });
                localStorage.removeItem(`quickFilter-${modelName}`);
                setSelectedFilterFields([]);
                handleApplyTemparoryFilter([]);
                resetForm();
                setFieldValue("filter-fields", "");
              }}
              loading={false}
              buttonType="thin"
              disabled={customViewFiltersUpdateLoading}
              kind={"back"}
              userEventName={`clear-custom-view-filter-${modelName}-click`}
            >
              {t("common:Clear")}
            </Button>
          </div>
          <div className="py-1">
            <FormInputBox
              name={`filter-fields`}
              placeholder="Search"
              id={`filter-fields`}
              rightIcon={
                <SearchIcon
                  size={20}
                  className="text-vryno-icon-gray cursor-auto"
                />
              }
            />
          </div>
          <div
            className={`card-scroll w-full ${
              selectedFilterFields?.length <= 0
                ? appMessage?.length > 0 && instanceMessage?.length > 0
                  ? "h-[63vh] 2xl:h-[68vh] 4xl:h-[69vh]"
                  : appMessage?.length > 0 || instanceMessage?.length > 0
                  ? "h-[63vh] 2xl:h-[68vh] 4xl:h-[69vh]"
                  : "h-[63vh] 2xl:h-[68vh] 4xl:h-[69vh]"
                : selectedFilterFields?.length > 0
                ? appMessage?.length > 0 && instanceMessage?.length > 0
                  ? "h-[58vh] 2xl:h-[63vh] 4xl:h-[65vh]"
                  : appMessage?.length > 0 || instanceMessage?.length > 0
                  ? "h-[60vh] 2xl:h-[65vh] 4xl:h-[68vh]"
                  : "h-[63vh] 2xl:h-[68vh] 4xl:h-[69vh]"
                : "h-[63vh] 2xl:h-[68vh] 4xl:h-[69vh]"
            } overflow-y-auto overflow-x-hidden pr-1.5`}
          >
            {fieldsList
              ?.filter((field) => {
                if (values["filter-fields"]) {
                  if (
                    get(field.label, "en", "")
                      .toLocaleLowerCase()
                      .includes(
                        String(values["filter-fields"]).toLocaleLowerCase()
                      )
                  )
                    return field;
                } else {
                  return field;
                }
              })
              ?.filter(
                (field) =>
                  ![
                    "recordImage",
                    "image",
                    "richText",
                    "json",
                    "jsonArray",
                    "relatedTo",
                  ].includes(field.dataType)
              )
              ?.filter((field) => field.visible)
              .map((field, index) => (
                <FieldsFiltersSideBarMenu
                  key={index}
                  index={index}
                  modelName={modelName}
                  field={field}
                  disabled={false}
                  currentCustomView={currentCustomView}
                  onSelectFilterField={onSelectFilterField}
                  checkedStatus={
                    selectedFilterFields?.findIndex(
                      (selectedFilterField) =>
                        selectedFilterField.name === field.name
                    ) === -1
                      ? false
                      : true
                  }
                  userPreferences={userPreferences}
                />
              ))}
          </div>
        </>
      </div>
    );
  } else {
    return (
      <NoViewPermission
        shadow={false}
        entireMessage={true}
        modelName={"or create custom view"}
        fontSize={"text-xsm"}
        addPadding={false}
      />
    );
  }
};
export default CustomViewsSideBarMenu;
