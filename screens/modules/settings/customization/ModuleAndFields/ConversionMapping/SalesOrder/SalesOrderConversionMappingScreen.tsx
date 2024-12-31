import { useLazyQuery, useQuery } from "@apollo/client";
import React from "react";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../../graphql/queries/fetchQuery";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import { SupportedApps } from "../../../../../../../models/shared";
import { toast } from "react-toastify";
import { ConnectedSalesOrderConversionMapping } from "./ConnectedSalesOrderConversionMapping";
import { IGenericConversionBEData } from "../conversionTypes";
import { PageLoader } from "../../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { NoViewPermission } from "../../../../../crm/shared/components/NoViewPermission";

const uniqueNameDict = {
  "crm.sales_order": "salesOrder",
  "crm.invoice": "invoice",
};

export interface ISalesOrderMappingLabels {
  salesOrder: string;
  invoice: string;
}

export type SalesOrderConversionDataType = Record<
  string,
  {
    invoice: {
      id: string | null;
      value: string | null;
    };
  }
>;

export const SalesOrderConversionMappingScreen = () => {
  const [salesOrderConversionData, setSalesOrderConversionData] =
    React.useState<SalesOrderConversionDataType>({});

  const [rootPermissionData, setRootPermissionData] = React.useState<
    Record<string, string | null>[]
  >([]);

  const [invoiceViewPermission, setInvoiceViewPermission] =
    React.useState<boolean>(true);
  const [invoiceDataLoading, setInvoiceDataLoading] = React.useState(true);

  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [labelData, setLabelData] = React.useState<ISalesOrderMappingLabels>({
    salesOrder: "Sales Order",
    invoice: "Invoice",
  });

  //FILTER IS NOT WORKING ON THIS QUERY FROM BE
  useQuery<FetchData<IModuleMetadata>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
    variables: {
      modelName: "Module",
      fields: ["id", "name", "customizationAllowed", "uniqueName", "label"],
      filters: [
        {
          name: "uniqueName",
          operator: "in",
          value: ["crm.sales_order", "crm.invoice"],
        },
      ],
    },
    onCompleted: (responseOnCompletion) => {
      const nameObject: ISalesOrderMappingLabels = {
        salesOrder: "",
        invoice: "",
      };
      if (responseOnCompletion?.fetch?.data?.length) {
        responseOnCompletion?.fetch?.data.forEach((module) => {
          if (
            uniqueNameDict[module.uniqueName as keyof typeof uniqueNameDict]
          ) {
            nameObject[
              uniqueNameDict[
                module.uniqueName as keyof typeof uniqueNameDict
              ] as keyof ISalesOrderMappingLabels
            ] = module.label.en;
          }
        });
      }
      setLabelData(nameObject);
      setModuleLoading(false);
    },
  });

  const [fetchQuoteConversionMapping] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const fetchQuoteConversionMappingInRecursion = async (
    pageNumber: number,
    mappingData: IGenericConversionBEData[]
  ) => {
    await fetchQuoteConversionMapping({
      variables: {
        modelName: "salesOrderConversionInvoiceMapping",
        fields: [
          "id",
          "sourceFieldUniqueName",
          "sourceModuleUniqueName",
          "destinationFieldUniqueName",
          "destinationModuleUniqueName",
        ],
        filters: [],
        pageNumber: pageNumber,
      },
    }).then(async (response) => {
      if (response?.data?.fetch?.data) {
        response?.data?.fetch?.data?.forEach((data: any) => {
          mappingData.push(data);
        });
        if (response?.data?.fetch?.data?.length === 50) {
          await fetchQuoteConversionMappingInRecursion(
            pageNumber + 1,
            mappingData
          );
        }
      } else if (response?.data?.fetch?.messageKey.includes("requires-view")) {
        setInvoiceViewPermission(false);
      } else if (response?.data?.fetch?.messageKey) {
        toast.error(response?.data?.fetch?.message);
      } else {
        toast.error("Failed to fetch mapping data");
      }
    });
    return { mappingData };
  };

  React.useEffect(() => {
    (async () => {
      const { mappingData } = await fetchQuoteConversionMappingInRecursion(
        1,
        []
      );
      if (mappingData.length) {
        setRootPermissionData(mappingData as any);
        const resultDict: SalesOrderConversionDataType = {};
        mappingData.forEach((val: any) => {
          const name = val.sourceFieldUniqueName.split(".").pop();
          const value =
            val.destinationFieldUniqueName?.split(".")?.pop() || null;
          const { invoice } = resultDict[name] || {};
          resultDict[name] = {
            invoice:
              val.destinationModuleUniqueName === "crm.invoice"
                ? {
                    id: val.id || invoice?.id || null,
                    value: value || invoice?.value || null,
                  }
                : invoice || null,
          };
        });
        setSalesOrderConversionData(resultDict);
      }
      setInvoiceDataLoading(false);
    })();
  }, []);

  if (moduleLoading || invoiceDataLoading) {
    return (
      <div className={"flex items-center justify-center h-screen text-xl"}>
        <PageLoader />
      </div>
    );
  }

  if (!invoiceViewPermission) {
    return (
      <NoViewPermission customMessage="Looks like you do not have Invoice conversion mapping view permission" />
    );
  }

  return (
    <ConnectedSalesOrderConversionMapping
      salesOrderConversionData={salesOrderConversionData}
      labelData={labelData}
      rootPermissionData={rootPermissionData}
      setSalesOrderConversionData={(value: SalesOrderConversionDataType) =>
        setSalesOrderConversionData(value)
      }
      setRootPermissionData={(value: Record<string, string | null>[]) =>
        setRootPermissionData(value)
      }
      moduleLoading={moduleLoading}
    />
  );
};
