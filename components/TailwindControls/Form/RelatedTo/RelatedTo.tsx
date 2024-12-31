import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../graphql/queries/fetchQuery";
import { camelCase } from "change-case";
import { SupportedApps } from "../../../../models/shared";
import { toast } from "react-toastify";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import { ICustomField } from "../../../../models/ICustomField";

export type RelatedToProps = {
  field: { moduleName: string; recordId: string };
  index: number;
  modulesFetched: {
    value: string;
    label: string;
    additionalValues: Array<string>;
  }[];
  truncateData?: boolean;
  fieldsList: ICustomField[] | undefined;
};

const RelatedTo = ({
  field,
  index,
  modulesFetched,
  truncateData,
  fieldsList,
}: RelatedToProps) => {
  const [selectedValue, setSelectedValue] = useState<Record<string, string>>(
    {}
  );

  const [getEditModeValues] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "cache-first",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
    onCompleted: (data) => {
      if (data?.fetch?.messageKey === "field-permission-required") {
        dataFetchFunction(["id", "name"]);
      }
      if (data?.fetch?.data) {
        if (!data?.fetch?.data.length) {
          toast.error(
            "Search successful, but no data found. Please re-enter data."
          );
        }
        setSelectedValue(data.fetch.data[0]);
      }
    },
  });

  const dataFetchFunction = (fieldsList: string[]) => {
    getEditModeValues({
      variables: {
        modelName: camelCase(field.moduleName),
        fields: fieldsList,
        filters: [
          {
            name: "id",
            operator: "in",
            value: field.recordId,
          },
          {
            operator: "in",
            name: "recordStatus",
            value: ["a", "i"],
          },
        ],
      },
    });
  };

  // TO DO: Need optimization to stop requests
  React.useEffect(() => {
    if (field.moduleName && field.recordId && modulesFetched.length > 0) {
      const modulesWithAdditional = modulesFetched.filter(
        (module: {
          value: string;
          label: string;
          additionalValues: Array<string>;
        }) => camelCase(module.value) == camelCase(field.moduleName)
      );
      dataFetchFunction(
        modulesWithAdditional?.length > 0
          ? [
              ...modulesWithAdditional[0].additionalValues?.map((value) => {
                if (value.slice(0, 6) === "custom") return `fields.${value}`;
                return value;
              }),
              "id",
            ]
          : ["id", "name"]
      );
    }
  }, [modulesFetched, field]);

  const getRelatedToValue = (
    selectedValue: Record<string, string>,
    modulesFetched: {
      value: string;
      label: string;
      additionalValues: Array<string>;
    }[]
  ) => {
    const value =
      Object.keys(selectedValue).length > 0 &&
      modulesFetched
        .filter(
          (module: {
            value: string;
            label: string;
            additionalValues: Array<string>;
          }) => camelCase(module.value) == camelCase(field.moduleName)
        )[0]
        ?.additionalValues.map(
          (item, index) =>
            getDataObject(selectedValue)[
              item?.split(".")?.length > 1 ? item.split(".")[1] : item
            ]
        );
    return value;
  };

  if (selectedValue && Object.keys(selectedValue).length > 0) {
    return (
      <span
        key={index}
        data-testid={getRelatedToValue(selectedValue, modulesFetched)}
        className={`rounded-r-lg text-xsm ${
          truncateData ? "truncate" : "whitespace-normal"
        } gap-x-1 text-vryno-theme-light-blue`}
      >
        {Object.keys(selectedValue).length > 0 &&
          modulesFetched
            .filter(
              (module: {
                value: string;
                label: string;
                additionalValues: Array<string>;
              }) => camelCase(module.value) == camelCase(field.moduleName)
            )[0]
            ?.additionalValues.map((item, index) => (
              <span key={index}>
                {
                  getDataObject(selectedValue)[
                    item?.split(".")?.length > 1 ? item.split(".")[1] : item
                  ]
                }
              </span>
            ))}
      </span>
    );
  } else {
    return null;
  }
};
export default RelatedTo;
