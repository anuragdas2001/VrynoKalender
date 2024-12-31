import React from "react";
import { toast } from "react-toastify";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { IInstance } from "../../../../../models/Accounts";
import { ICustomField } from "../../../../../models/ICustomField";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import GenericFormModalContainer from "../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import RequiredIndicator from "../../../../../components/TailwindControls/Form/Shared/RequiredIndicator";

export const KanbanViewCurrencyModal = ({
  setShowCurrencyModal,
  exchangeRate,
  currencyField,
  currencyType,
  instance,
  setTriggerExchangeRate,
}: {
  setShowCurrencyModal: (value: boolean) => void;
  exchangeRate: Record<string, number> | null;
  currencyField: ICustomField;
  currencyType: string;
  instance: IInstance;
  setTriggerExchangeRate: (ValidityState: boolean) => void;
}) => {
  const { t } = useTranslation(["common"]);

  const [initialValues, setInitialValues] = React.useState<Record<
    string,
    number
  > | null>(null);

  React.useEffect(() => {
    const sessionStoredExchangeRate = JSON.parse(
      sessionStorage.getItem("kanbanViewExchangeRate") || "{}"
    );
    const initialValuesDict: Record<string, number> = { [currencyType]: 1 };
    for (const currency of currencyField?.dataTypeMetadata.lookupOptions) {
      const currencyCode = currency.label.en.toLowerCase();
      if (
        sessionStoredExchangeRate[instance.id]?.[currencyType]?.[currencyCode]
      ) {
        initialValuesDict[currencyCode] =
          sessionStoredExchangeRate[instance.id][currencyType][currencyCode];
      } else if (exchangeRate?.[currencyCode]) {
        initialValuesDict[currencyCode] = exchangeRate[currencyCode];
      }
    }
    setInitialValues(initialValuesDict);
    // if (exchangeRate) {
    //   setInitialValues(JSON.parse(exchangeRate));
    // }
  }, []);

  return (
    <>
      <GenericFormModalContainer
        formHeading={`Currency conversion rates (${currencyType.toUpperCase()})`}
        onOutsideClick={() => setShowCurrencyModal(false)}
        limitWidth={true}
        onCancel={() => setShowCurrencyModal(false)}
        allowScrollbar={false}
      >
        <Formik
          initialValues={initialValues || {}}
          enableReinitialize
          onSubmit={(values: FormikValues) => {
            let errorMessage = "";
            for (const key in values) {
              if (values[key] !== null && values[key] <= 0) {
                errorMessage += `${key} `;
              }
            }
            if (errorMessage) {
              toast.error(
                `Please enter valid exchange rate for ${errorMessage}`
              );
              return;
            }
            const sessionStoredExchangeRate = JSON.parse(
              sessionStorage.getItem("kanbanViewExchangeRate") || "{}"
            );

            if (!instance) {
              toast.error("Instance not found");
              return;
            }
            const updatedSessionData = Object.keys(sessionStoredExchangeRate)
              ?.length
              ? Object.keys(sessionStoredExchangeRate[instance.id])?.length
                ? {
                    ...sessionStoredExchangeRate,
                    [instance.id]: {
                      ...sessionStoredExchangeRate[instance.id],
                      [currencyType]: values,
                    },
                  }
                : {
                    ...sessionStoredExchangeRate,
                    [instance.id]: { [currencyType]: values },
                  }
              : {
                  [instance.id]: { [currencyType]: values },
                };
            sessionStorage.setItem(
              "kanbanViewExchangeRate",
              JSON.stringify(updatedSessionData)
            );
            toast.success("Exchange rate updated successfully");
            setTriggerExchangeRate(true);
            setShowCurrencyModal(false);
          }}
        >
          {({ setFieldValue, handleSubmit }) => (
            <>
              <div className="max-h-[330px] overflow-y-scroll">
                {currencyField?.dataTypeMetadata.lookupOptions
                  ?.filter(
                    (currency: { recordStatus: string }) =>
                      currency.recordStatus == "a"
                  )
                  .map(
                    (
                      currency: { id: string; label: { en: string } },
                      index: number
                    ) => {
                      const name = currency.label.en.toLowerCase();
                      return (
                        <div className="mt-4" key={index}>
                          <FormInputBox
                            name={name}
                            allowMargin={false}
                            type="number"
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFieldValue(
                                name,
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value)
                              );
                            }}
                            label={currency.label.en}
                            precision={10}
                            disabled={name === currencyType}
                            required={exchangeRate?.[name] ? false : true}
                          />
                        </div>
                      );
                    }
                  )}
              </div>
              <div className="grid grid-cols-2 w-full gap-x-4 mt-6">
                <Button
                  id="cancel-form"
                  onClick={() => setShowCurrencyModal(false)}
                  kind="back"
                  userEventName="kanban-view-currency-rate-save:cancel-click"
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  id="save-form"
                  onClick={() => {
                    handleSubmit();
                  }}
                  kind="primary"
                  userEventName="kanban-view-currency-rate-save:submit-click"
                >
                  {t("common:save")}
                </Button>
              </div>
              <p className="text-xs text-vryno-theme-light-blue mt-2">
                <RequiredIndicator required={true} /> Exchange rate not found
              </p>
            </>
          )}
        </Formik>
      </GenericFormModalContainer>
      <Backdrop onClick={() => setShowCurrencyModal(false)} />
    </>
  );
};
