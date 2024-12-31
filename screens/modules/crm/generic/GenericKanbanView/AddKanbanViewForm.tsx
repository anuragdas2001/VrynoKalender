import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { GenericFieldsSelector } from "../GenericAddCustomView/GenericFieldsSelector";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { ICustomField } from "../../../../../models/ICustomField";
import { useTranslation } from "react-i18next";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import { IKanbanViewData } from "../../../../../models/shared";

export const AddKanbanViewForm = ({
  handleSubmit,
  lookupFieldsList,
  numberFieldsList,
  availableFieldsList,
  availableThresholdFieldsList,
  selectedFieldsList,
  selectedThresholdFieldsList,
  handleAvailableFieldSelection,
  setSelectedThresholdFieldsList,
  handleSelectedFieldSelection,
  setAvailableThresholdFieldsList,
  handleAvailableFields,
  handleSelectedFields,
  setKanbanViewModal,
  savingProcess,
  setSavingProcess,
  currencyField,
  modelName,
  initialData,
}: {
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  lookupFieldsList: ICustomField[];
  numberFieldsList: ICustomField[];
  availableFieldsList: ISimplifiedCustomField[];
  availableThresholdFieldsList: ISimplifiedCustomField[];
  selectedFieldsList: ISimplifiedCustomField[];
  selectedThresholdFieldsList: ISimplifiedCustomField[];
  handleAvailableFieldSelection: (value: ISimplifiedCustomField) => void;
  setSelectedThresholdFieldsList: React.Dispatch<
    React.SetStateAction<ISimplifiedCustomField[]>
  >;
  handleSelectedFieldSelection: (value: ISimplifiedCustomField) => void;
  setAvailableThresholdFieldsList: React.Dispatch<
    React.SetStateAction<ISimplifiedCustomField[]>
  >;
  handleAvailableFields: () => void;
  handleSelectedFields: () => void;
  setKanbanViewModal: (value: {
    visible: boolean;
    data: IKanbanViewData | null;
    edit: boolean;
  }) => void;
  savingProcess: boolean;
  setSavingProcess: React.Dispatch<React.SetStateAction<boolean>>;
  currencyField: ICustomField;
  modelName: string;
  initialData: {
    name: string;
    categorizeBy: string;
    aggregateBy: string;
    relatedModule: string;
    currencyType: null | string;
  };
}) => {
  const { t } = useTranslation(["settings", "common"]);
  return (
    <div className="px-2">
      <div className="w-full max-h-[55vh] overflow-y-auto pr-1.5 card-scroll mt-4">
        <div>
          <FormInputBox
            name="name"
            label="Kanban View Name"
            required={true}
            allowMargin={false}
            placeholder="Kanban view Name"
          />
        </div>
        <div className="mt-5">
          <FormDropdown
            name="categorizeBy"
            label="Categorize By"
            required={true}
            options={lookupFieldsList?.map((item: ICustomField) => {
              return { value: item.name, label: item.label.en };
            })}
            placeholder="Select Field"
            allowMargin={false}
          />
        </div>
        {modelName === "deal" && Object.keys(currencyField || {})?.length ? (
          <div className="mt-5">
            <FormDropdown
              name="aggregateBy"
              label="Aggregate By"
              // required={true}
              options={[
                { value: "---", label: "---" },
                ...numberFieldsList?.map((item: ICustomField) => {
                  return { value: item.name, label: item.label.en };
                }),
              ]}
              placeholder="Select Field"
              allowMargin={false}
            />
          </div>
        ) : (
          <></>
        )}
        {modelName === "deal" && Object.keys(currencyField || {})?.length ? (
          <div className="mt-5">
            <FormDropdown
              name="currencyType"
              label="Currency Type"
              // required={true}
              options={currencyField.dataTypeMetadata.lookupOptions
                .filter(
                  (currency: { recordStatus: string; label: { en: string } }) =>
                    currency.recordStatus == "a" ||
                    initialData.currencyType === currency.label.en
                )
                .map((val: { label: { en: string } }) => {
                  return { value: val.label.en, label: val.label.en };
                })}
              placeholder="Select Field"
              allowMargin={false}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="mt-7">
          <p
            className={`text-sm tracking-wide text-vryno-label-gray whitespace-nowrap mb-2.5`}
          >
            Select Fields
          </p>
          <GenericFieldsSelector
            availableFieldsList={availableFieldsList}
            availableThresholdFieldsList={availableThresholdFieldsList}
            selectedFieldsList={selectedFieldsList}
            selectedThresholdFieldsList={selectedThresholdFieldsList}
            handleAvailableFieldSelection={handleAvailableFieldSelection}
            setSelectedThresholdFieldsList={setSelectedThresholdFieldsList}
            handleSelectedFieldSelection={handleSelectedFieldSelection}
            setAvailableThresholdFieldsList={setAvailableThresholdFieldsList}
            handleAvailableFields={handleAvailableFields}
            handleSelectedFields={handleSelectedFields}
            containerMargin=""
          />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-36 mt-6.5">
        <Button
          id="cancel-kanban_view"
          disabled={savingProcess}
          onClick={() =>
            setKanbanViewModal({
              visible: false,
              data: null,
              edit: false,
            })
          }
          kind="back"
          buttonType="thin"
          userEventName="pipeline-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-kanban_view"
          loading={savingProcess}
          disabled={savingProcess}
          onClick={() => {
            handleSubmit();
          }}
          kind="primary"
          buttonType="thin"
          userEventName="pipeline-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};
