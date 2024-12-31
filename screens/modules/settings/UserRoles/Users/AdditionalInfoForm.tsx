import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useTranslation } from "next-i18next";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { useFormikContext } from "formik";
import { countryList } from "../../../../../shared/CountryList";

export const AdditionalInfoForm = ({ editMode }: { editMode: boolean }) => {
  const { t } = useTranslation(["settings", "common"]);
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <FormInputBox
        name="middleName"
        label={t("Middle Name")}
        type="text"
        required={false}
        disabled={editMode}
      />
      <FormDropdown
        name="country"
        label={t("Country")}
        options={countryList}
        onChange={(selectedOption) => {
          setFieldValue("country", selectedOption.currentTarget.value);
        }}
        disabled={editMode}
      />
      <FormInputBox
        name="city"
        label={t("city-label")}
        type="text"
        required={false}
        disabled={editMode}
      />
      <FormInputBox
        name="zipcode"
        label={t("Zip Code")}
        type="text"
        required={false}
        disabled={editMode}
      />
      <FormInputBox
        name="address"
        label={t("Address")}
        type="text"
        required={false}
        disabled={editMode}
      />
    </>
  );
};
