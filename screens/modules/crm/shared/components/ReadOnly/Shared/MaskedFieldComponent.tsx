import Eye from "remixicon-react/EyeLineIcon";
import EyeOff from "remixicon-react/EyeOffLineIcon";
import { ICustomField } from "../../../../../../../models/ICustomField";

export const MaskedFieldComponent = ({
  fieldDetail,
  field,
  fetchMaskedFieldData,
  showMaskedData,
  maskedFieldData,
  setShowMaskedData,
  maskedDataLoading,
}: {
  fieldDetail: ICustomField | undefined;
  field: any;
  fetchMaskedFieldData: (fieldName: string) => null | any;
  showMaskedData: boolean;
  maskedFieldData: {
    oldValue: any;
    newValue: any;
  };
  setShowMaskedData: React.Dispatch<React.SetStateAction<boolean>>;
  maskedDataLoading: boolean;
}) => {
  return fieldDetail?.isMasked &&
    ["singleline", "email", "phoneNumber"].includes(field.dataType) ? (
    <button
      className="pl-1 text-center"
      onClick={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (maskedFieldData.newValue) {
          setShowMaskedData((value) => !value);
          return;
        }
        await fetchMaskedFieldData(
          fieldDetail?.systemDefined ? field.value : `fields.${field.value}`
        );
        setShowMaskedData(true);
      }}
      data-testid={`toggle-masked-field-${field.label}`}
      disabled={maskedDataLoading}
    >
      {showMaskedData ? (
        <EyeOff data-testid={"masked-field-open-icon"} size="14" />
      ) : (
        <Eye data-testid={"masked-field-close-icon"} size="14" />
      )}
    </button>
  ) : (
    <></>
  );
};
