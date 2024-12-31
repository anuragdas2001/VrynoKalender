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
import { ConnectedQuotedItemConversionMapping } from "./ConnectedQuotedItemConversionMapping";
import { IGenericConversionBEData } from "../conversionTypes";

const uniqueNameDict = {
  "crm.ordered_item": "orderedItem",
  "crm.invoiced_item": "invoicedItem",
  "crm.quoted_item": "quotedItem",
};

export interface IQuotedItemMappingLabels {
  orderedItem: string;
  invoicedItem: string;
  quotedItem: string;
}

export type QuotedItemConversionDataType = Record<
  string,
  {
    orderedItem: {
      id: string | null;
      value: string | null;
    };
    invoicedItem: {
      id: string | null;
      value: string | null;
    };
  }
>;

export const QuotedItemConversionMappingScreen = () => {
  const [quotedItemConversionData, setQuotedItemConversionData] =
    React.useState<QuotedItemConversionDataType>({});

  const [rootPermissionData, setRootPermissionData] = React.useState<
    Record<string, string | null>[]
  >([]);
  const [fetchedOrderedItemItemData, setFetchedOrderedItemData] =
    React.useState<any[]>([]);
  const [fetchedInvoicedItemData, setFetchedInvoicedItemData] = React.useState<
    any[]
  >([]);
  const [conversionDataLoading, setConversionDataLoading] =
    React.useState(true);

  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [labelData, setLabelData] = React.useState<IQuotedItemMappingLabels>({
    orderedItem: "Ordered Item",
    invoicedItem: "Invoiced Item",
    quotedItem: "Quoted Item",
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
          value: ["crm.ordered_item", "crm.invoiced_item", "crm.quoted_item"],
        },
      ],
    },
    onCompleted: (responseOnCompletion) => {
      const nameObject: IQuotedItemMappingLabels = {
        orderedItem: "",
        invoicedItem: "",
        quotedItem: "",
      };
      if (responseOnCompletion?.fetch?.data?.length) {
        responseOnCompletion?.fetch?.data.forEach((module) => {
          if (
            uniqueNameDict[module.uniqueName as keyof typeof uniqueNameDict]
          ) {
            nameObject[
              uniqueNameDict[
                module.uniqueName as keyof typeof uniqueNameDict
              ] as keyof IQuotedItemMappingLabels
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
    modelName: string
  ) => {
    await fetchQuoteConversionMapping({
      variables: {
        modelName: modelName,
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
            modelName
          );
        }
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
      const { mappingData: orderedItemData } =
        await fetchQuoteConversionMappingInRecursion(
          1,
          [],
          "quotedItemConversionOrderedItemMapping"
        );
      setFetchedOrderedItemData(orderedItemData);
    })();
    (async () => {
      const { mappingData: invoicedItemData } =
        await fetchQuoteConversionMappingInRecursion(
          1,
          [],
          "quotedItemConversionInvoicedItemMapping"
        );
      setFetchedInvoicedItemData(invoicedItemData);
    })();
  }, []);

  React.useEffect(() => {
    if (!fetchedOrderedItemItemData.length || !fetchedInvoicedItemData.length)
      return;
    const mappingData = [
      ...fetchedOrderedItemItemData,
      ...fetchedInvoicedItemData,
    ];
    if (mappingData.length) {
      setRootPermissionData(mappingData as any);
      const resultDict: QuotedItemConversionDataType = {};
      mappingData.forEach((val: any) => {
        const name = val.sourceFieldUniqueName.split(".").pop();
        const value = val.destinationFieldUniqueName?.split(".")?.pop() || null;
        const { orderedItem, invoicedItem } = resultDict[name] || {};
        resultDict[name] = {
          orderedItem:
            val.destinationModuleUniqueName === "crm.ordered_item"
              ? {
                  id: val.id || orderedItem?.id || null,
                  value: value || orderedItem?.value || null,
                }
              : orderedItem || null,
          invoicedItem:
            val.destinationModuleUniqueName === "crm.invoiced_item"
              ? {
                  id: val.id || invoicedItem?.id || null,
                  value: value || invoicedItem?.value || null,
                }
              : invoicedItem || null,
        };
      });
      setQuotedItemConversionData(resultDict);
      setConversionDataLoading(false);
    }
  }, [fetchedOrderedItemItemData, fetchedInvoicedItemData]);

  return (
    <ConnectedQuotedItemConversionMapping
      quotedItemConversionData={quotedItemConversionData}
      labelData={labelData}
      rootPermissionData={rootPermissionData}
      setQuotedItemConversionData={(value: QuotedItemConversionDataType) =>
        setQuotedItemConversionData(value)
      }
      setRootPermissionData={(value: Record<string, string | null>[]) =>
        setRootPermissionData(value)
      }
      moduleLoading={moduleLoading}
      conversionDataLoading={conversionDataLoading}
    />
  );
};
