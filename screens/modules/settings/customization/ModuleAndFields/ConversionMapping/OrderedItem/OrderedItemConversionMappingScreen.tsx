import React from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import { SupportedApps } from "../../../../../../../models/shared";
import { toast } from "react-toastify";
import { IGenericConversionBEData } from "../conversionTypes";
import { ConnectedOrderedItemConversionMapping } from "./ConnectedOrderedItemConversionMapping";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../../graphql/queries/fetchQuery";

const uniqueNameDict = {
  "crm.ordered_item": "orderedItem",
  "crm.invoiced_item": "invoicedItem",
};

export interface IOrderedItemMappingLabels {
  orderedItem: string;
  invoicedItem: string;
}

export type OrderedItemConversionDataType = Record<
  string,
  {
    invoicedItem: {
      id: string | null;
      value: string | null;
    };
  }
>;

export const OrderedItemConversionMappingScreen = () => {
  const [orderedItemConversionData, setOrderedItemConversionData] =
    React.useState<OrderedItemConversionDataType>({});

  const [rootPermissionData, setRootPermissionData] = React.useState<
    Record<string, string | null>[]
  >([]);

  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [labelData, setLabelData] = React.useState<IOrderedItemMappingLabels>({
    orderedItem: "Sales Order",
    invoicedItem: "Invoice",
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
          value: ["crm.ordered_item", "crm.invoiced_item"],
        },
      ],
    },
    onCompleted: (responseOnCompletion) => {
      const nameObject: IOrderedItemMappingLabels = {
        orderedItem: "",
        invoicedItem: "",
      };
      if (responseOnCompletion?.fetch?.data?.length) {
        responseOnCompletion?.fetch?.data.forEach((module) => {
          if (
            uniqueNameDict[module.uniqueName as keyof typeof uniqueNameDict]
          ) {
            nameObject[
              uniqueNameDict[
                module.uniqueName as keyof typeof uniqueNameDict
              ] as keyof IOrderedItemMappingLabels
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
        modelName: "orderedItemConversionInvoicedItemMapping",
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
        const resultDict: OrderedItemConversionDataType = {};
        mappingData.forEach((val: any) => {
          const name = val.sourceFieldUniqueName.split(".").pop();
          const value =
            val.destinationFieldUniqueName?.split(".")?.pop() || null;
          const { invoicedItem } = resultDict[name] || {};
          resultDict[name] = {
            invoicedItem:
              val.destinationModuleUniqueName === "crm.invoiced_item"
                ? {
                    id: val.id || invoicedItem?.id || null,
                    value: value || invoicedItem?.value || null,
                  }
                : invoicedItem || null,
          };
        });
        setOrderedItemConversionData(resultDict);
      }
    })();
  }, []);

  return (
    <ConnectedOrderedItemConversionMapping
      orderedItemConversionData={orderedItemConversionData}
      labelData={labelData}
      rootPermissionData={rootPermissionData}
      setOrderedItemConversionData={(value: OrderedItemConversionDataType) =>
        setOrderedItemConversionData(value)
      }
      setRootPermissionData={(value: Record<string, string | null>[]) =>
        setRootPermissionData(value)
      }
      moduleLoading={moduleLoading}
    />
  );
};
