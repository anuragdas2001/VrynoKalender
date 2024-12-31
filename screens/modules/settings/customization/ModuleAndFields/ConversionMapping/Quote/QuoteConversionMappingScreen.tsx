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
import { ConnectedQuoteConversionMapping } from "./ConnectedQuoteConversionMapping";
import { IGenericConversionBEData } from "../conversionTypes";
import { NoViewPermission } from "../../../../../crm/shared/components/NoViewPermission";
import { PageLoader } from "../../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";

const uniqueNameDict = {
  "crm.sales_order": "salesOrder",
  "crm.invoice": "invoice",
  "crm.quote": "quote",
};

export interface IQuoteMappingLabels {
  salesOrder: string;
  invoice: string;
  quote: string;
}

export type QuoteConversionDataType = Record<
  string,
  {
    salesOrder: {
      id: string | null;
      value: string | null;
    };
    invoice: {
      id: string | null;
      value: string | null;
    };
  }
>;

export const QuoteConversionMappingScreen = () => {
  const [quoteConversionData, setQuoteConversionData] =
    React.useState<QuoteConversionDataType>({});

  const [rootPermissionData, setRootPermissionData] = React.useState<
    Record<string, string | null>[]
  >([]);

  const [fetchedSalesOrderData, setFetchedSalesOrderData] = React.useState<
    any[]
  >([]);
  const [fetchedInvoiceData, setFetchedInvoiceData] = React.useState<any[]>([]);

  const [salesOrderViewPermission, setSalesOrderViewPermission] =
    React.useState<boolean>(true);
  const [invoiceViewPermission, setInvoiceViewPermission] =
    React.useState<boolean>(true);

  const [salesOrderDataLoading, setSalesOrderDataLoading] =
    React.useState(true);
  const [invoiceDataLoading, setInvoiceDataLoading] = React.useState(true);

  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [conversionDataLoading, setConversionDataLoading] =
    React.useState(true);
  const [labelData, setLabelData] = React.useState<IQuoteMappingLabels>({
    salesOrder: "Sales Order",
    invoice: "Invoice",
    quote: "Quote",
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
          value: ["crm.sales_order", "crm.invoice", "crm.quote"],
        },
      ],
    },
    onCompleted: (responseOnCompletion) => {
      const nameObject: IQuoteMappingLabels = {
        salesOrder: "",
        invoice: "",
        quote: "",
      };
      if (responseOnCompletion?.fetch?.data?.length) {
        responseOnCompletion?.fetch?.data.forEach((module) => {
          if (
            uniqueNameDict[module.uniqueName as keyof typeof uniqueNameDict]
          ) {
            nameObject[
              uniqueNameDict[
                module.uniqueName as keyof typeof uniqueNameDict
              ] as keyof IQuoteMappingLabels
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
    mappingData: IGenericConversionBEData[],
    moduleName: string
  ) => {
    await fetchQuoteConversionMapping({
      variables: {
        modelName: moduleName,
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
            mappingData,
            moduleName
          );
        }
      } else if (response?.data?.fetch?.messageKey.includes("requires-view")) {
        moduleName === "quoteConversionSalesOrderMapping"
          ? setSalesOrderViewPermission(false)
          : setInvoiceViewPermission(false);
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
      const { mappingData: salesOrderData } =
        await fetchQuoteConversionMappingInRecursion(
          1,
          [],
          "quoteConversionSalesOrderMapping"
        );
      setFetchedSalesOrderData(salesOrderData);
      setSalesOrderDataLoading(false);
    })();
    (async () => {
      const { mappingData: invoiceData } =
        await fetchQuoteConversionMappingInRecursion(
          1,
          [],
          "quoteConversionInvoiceMapping"
        );
      setFetchedInvoiceData(invoiceData);
      setInvoiceDataLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    if (salesOrderDataLoading || invoiceDataLoading) return;
    const mappingData = [...fetchedSalesOrderData, ...fetchedInvoiceData];
    if (mappingData.length) {
      setRootPermissionData(mappingData as any);
      const resultDict: QuoteConversionDataType = {};
      mappingData.forEach((val: any) => {
        const name = val.sourceFieldUniqueName.split(".").pop();
        const value = val.destinationFieldUniqueName?.split(".")?.pop() || null;
        const { salesOrder, invoice } = resultDict[name] || {};
        resultDict[name] = {
          salesOrder:
            val.destinationModuleUniqueName === "crm.sales_order"
              ? {
                  id: val.id || salesOrder?.id || null,
                  value: value || salesOrder?.value || null,
                }
              : salesOrder || null,
          invoice:
            val.destinationModuleUniqueName === "crm.invoice"
              ? {
                  id: val.id || invoice?.id || null,
                  value: value || invoice?.value || null,
                }
              : invoice || null,
        };
      });
      setQuoteConversionData(resultDict);
    }
    setConversionDataLoading(false);
  }, [salesOrderDataLoading, invoiceDataLoading]);

  if (moduleLoading || conversionDataLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        <PageLoader />
      </div>
    );
  }

  if (!salesOrderViewPermission && !invoiceViewPermission) {
    return (
      <NoViewPermission customMessage="Looks like you do not have Sales Order and Invoice conversion mapping view permission" />
    );
  }

  return (
    <ConnectedQuoteConversionMapping
      quoteConversionData={quoteConversionData}
      labelData={labelData}
      rootPermissionData={rootPermissionData}
      setQuoteConversionData={(value: QuoteConversionDataType) =>
        setQuoteConversionData(value)
      }
      setRootPermissionData={(value: Record<string, string | null>[]) =>
        setRootPermissionData(value)
      }
      salesOrderViewPermission={salesOrderViewPermission}
      invoiceViewPermission={invoiceViewPermission}
    />
  );
};
