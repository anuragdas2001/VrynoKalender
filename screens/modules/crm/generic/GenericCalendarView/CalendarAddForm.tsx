import GenericFormModalContainer from "../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormCheckBox from "../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import { CalendarColorPicker } from "./CalendarHelpers/CalendarColorPicker";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { BaseUser, IInstance } from "../../../../../models/Accounts";
import { ICalendarFieldsList, IModuleList } from "./CalendarViewScreen";

export const CalendarAddForm = ({
  instanceData,
  cookieUser,
  handleSetFilterData,
  setOpenAddCalendarFilter,
  moduleList,
  dateAndDateTimeFieldsList,
  unrelatedSessionData,
  filterData,
  dateTimeFieldsList,
  selectedColorList,
}: {
  instanceData: IInstance | null;
  cookieUser: BaseUser | null;
  handleSetFilterData: (data: any) => void;
  setOpenAddCalendarFilter: (value: boolean) => void;
  moduleList: IModuleList[];
  dateAndDateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  };
  unrelatedSessionData: any[];
  filterData: any;
  dateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  };
  selectedColorList: string[];
}) => {
  const { t } = useTranslation(["common"]);

  const addFieldValidationSchema = Yup.object().shape({
    module: Yup.string().required("Please select module"),
  });

  return (
    <>
      <GenericFormModalContainer
        formHeading="Add Activity Type"
        onOutsideClick={() => setOpenAddCalendarFilter(false)}
        limitWidth={true}
        onCancel={() => setOpenAddCalendarFilter(false)}
      >
        <Formik
          initialValues={{
            module: "",
            addRange: false,
            startField: "",
            endField: "",
            color: "",
          }}
          validationSchema={addFieldValidationSchema}
          onSubmit={(values) => {
            if (!instanceData) {
              toast.error("Error: No instance data found.");
              return;
            }
            if (!values.addRange && !values.startField?.length) {
              toast.error("Please select field");
              return;
            }
            if (
              values.addRange &&
              (!values.startField?.length || !values.endField?.length)
            ) {
              toast.error("Please select range fields");
              return;
            }
            if (values.color.length == 0) {
              toast.error("Please select color");
              return;
            }
            let startFieldData = "",
              startFieldLabel = "",
              endFieldData = "",
              endFieldLabel = "",
              startFieldDatatype = "",
              endFieldDatatype = "";
            if (values.startField) {
              [startFieldLabel, startFieldData, startFieldDatatype] =
                values.startField.split("-");
            }
            if (values.endField) {
              [endFieldLabel, endFieldData, endFieldDatatype] =
                values.endField.split("-");
            }
            const data = {
              module: values.module,
              addRange: values.addRange,
              startField: startFieldData,
              endField: endFieldData,
              startFieldLabel: startFieldLabel,
              endFieldLabel: endFieldLabel,
              startFieldDatatype: startFieldDatatype,
              endFieldDatatype: endFieldDatatype,
              color: values.color,
              instanceId: instanceData.id,
              userEmail: cookieUser?.email || "",
              checked: true,
            };
            localStorage.setItem(
              "calendarView",
              JSON.stringify([...unrelatedSessionData, ...filterData, data])
            );
            handleSetFilterData(data);
            setOpenAddCalendarFilter(false);
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <>
              <FormDropdown
                name="module"
                options={moduleList}
                label="Select Module"
                onChange={(selectedOption) => {
                  setFieldValue("module", selectedOption.target.value);
                  setFieldValue("startField", "");
                  setFieldValue("endField", "");
                  setFieldValue("addRange", false);
                  setFieldValue("color", "");
                }}
                required={true}
              />
              {!values["addRange"] && (
                <FormDropdown
                  name="startField"
                  options={
                    values["module"] &&
                    dateAndDateTimeFieldsList[values["module"]]?.length
                      ? dateAndDateTimeFieldsList[values["module"]]
                      : [{ label: "-", value: null }]
                  }
                  label="Select Field"
                  disabled={values["module"] ? false : true}
                  required={true}
                />
              )}
              <FormCheckBox
                name="addRange"
                label="Select Fields for Range"
                value={Boolean(values["addRange"])}
                labelSize="text-sm"
                marginY="mt-4"
                onChange={(e) => {
                  setFieldValue("addRange", e.target.checked);
                  setFieldValue("startField", "");
                  setFieldValue("endField", "");
                  setFieldValue("color", "");
                }}
              />
              {values["addRange"] && (
                <>
                  <FormDropdown
                    name="startField"
                    options={
                      values["module"] &&
                      dateTimeFieldsList[values["module"]]?.length
                        ? dateTimeFieldsList[values["module"]]
                        : [{ label: "-", value: null }]
                    }
                    label="Start Field"
                    disabled={values["module"] ? false : true}
                    required={true}
                    onChange={(e) => {
                      setFieldValue("startField", e.target.value);
                      setFieldValue("endField", "");
                    }}
                  />
                  <FormDropdown
                    name="endField"
                    options={
                      values["module"] &&
                      dateTimeFieldsList[values["module"]]?.filter(
                        (field) => field.value !== values["startField"]
                      ).length
                        ? dateTimeFieldsList[values["module"]]?.filter(
                            (field) => field.value !== values["startField"]
                          )
                        : [{ label: "-", value: null }]
                    }
                    label="End Field"
                    disabled={values["module"] ? false : true}
                    required={true}
                  />
                </>
              )}
              <CalendarColorPicker
                name="color"
                label="Select Calendar Color"
                onClick={(color) => {
                  setFieldValue("color", color);
                }}
                marginTop="mt-4"
                selectedColorList={selectedColorList}
              />

              <div className="grid grid-cols-2 w-full gap-x-4 gap-y-4 sm:gap-y-0 mt-6.5">
                <Button
                  id="cancel-form"
                  onClick={() => setOpenAddCalendarFilter(false)}
                  kind="back"
                  userEventName="calenderView-save:cancel-click"
                >
                  {t("Cancel")}
                </Button>
                <Button
                  id="save-form"
                  onClick={() => {
                    handleSubmit();
                  }}
                  kind="primary"
                  userEventName="calenderView-save:submit-click"
                >
                  {t("Save")}
                </Button>
              </div>
            </>
          )}
        </Formik>
      </GenericFormModalContainer>
      <Backdrop onClick={() => setOpenAddCalendarFilter(false)} />
    </>
  );
};
