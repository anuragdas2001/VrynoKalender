import React, { useContext } from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { SupportedApps } from "../../../../../models/shared";
import { EXECUTE_CONVERSION } from "../../../../../graphql/mutations/executeConversion";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../models/allowedViews";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

//here
/*
quote - salesOrder - quoteConversionSalesOrderMapping
quote - invoice - quoteConversionInvoiceMapping
quotedItem - orderedItem - quotedItemConversionOrderedItemMapping
quotedItem - invoice - quotedItemConversionInvoicedItemMapping
salesOrder - invoice - salesOrderConversionInvoiceMapping
orderedItem - invoicedItem - orderedItemConversionInvoicedItemMapping
*/

export const CONVERSION_MAPPING_MODULE_NAMES = {
  quoteToSalesOrder: "quoteConversionSalesOrderMapping",
  quoteToInvoice: "quoteConversionInvoiceMapping",
  salesOrderToInvoice: "salesOrderConversionInvoiceMapping",
};

export const REDIRECTION_MODULE_NAMES = {
  quoteToSalesOrder: "salesOrder",
  quoteToInvoice: "invoice",
  salesOrderToInvoice: "invoice",
};

export const GenericConversionForm = ({
  modelName,
  currentModuleLabel,
  data,
  onCancel,
  setRefetchRecordData = () => {},
}: {
  modelName: string;
  currentModuleLabel: string;
  data: {
    convertToModuleLabel: string;
    id: string;
    modelName: string;
  };
  onCancel: () => void;
  setRefetchRecordData?: (value: boolean) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const router = useRouter();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, updateModuleData } = generalModelStore;
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [saveData] = useMutation(EXECUTE_CONVERSION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const handleSave = () => {
    setSaveLoading(true);
    saveData({
      variables: {
        modelName:
          CONVERSION_MAPPING_MODULE_NAMES[
            data.modelName as keyof typeof CONVERSION_MAPPING_MODULE_NAMES
          ],
        executeConversionInput: {
          sourceIds: [data.id],
        },
      },
    }).then((response) => {
      if (response.data.executeConversion.messageKey.includes("-success")) {
        let redirectModuleName =
          REDIRECTION_MODULE_NAMES[
            data.modelName as keyof typeof REDIRECTION_MODULE_NAMES
          ];
        toast.success(response.data.executeConversion.message);
        updateModuleData(
          {
            id: data.id,
            [modelName === "quote"
              ? "quoteConverted"
              : modelName === "salesOrder"
              ? "salesOrderConverted"
              : ""]: true,
          },
          modelName,
          [
            modelName === "quote"
              ? "quoteConverted"
              : modelName === "salesOrder"
              ? "salesOrderConverted"
              : "",
          ]
        );
        router.push(
          appsUrlGenerator(
            SupportedApps.crm,
            redirectModuleName,
            AllowedViews.detail,
            response.data.executeConversion.data[redirectModuleName]
          )
        );
        setSaveLoading(false);
        onCancel();
        return;
      }
      if (response.data.executeConversion.messageKey) {
        toast.error(response.data.executeConversion.message);
      } else {
        toast.error(t("common:unknown-message"));
      }
      setSaveLoading(false);
    });
  };

  return (
    <div>
      <p className="text-sm">
        Are you sure you want to convert{" "}
        <span className="text-vryno-theme-light-blue">
          {currentModuleLabel}
        </span>{" "}
        to{" "}
        <span className="text-vryno-theme-light-blue">
          {data.convertToModuleLabel}
        </span>
      </p>
      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
          userEventName="userRole-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          loading={saveLoading}
          disabled={saveLoading}
          onClick={() => {
            handleSave();
          }}
          kind="primary"
          userEventName="userRole-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};
