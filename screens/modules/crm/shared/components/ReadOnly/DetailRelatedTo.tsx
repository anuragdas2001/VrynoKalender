import { useLazyQuery } from "@apollo/client";
import _, { camelCase } from "lodash";
import React from "react";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { relatedLookupMapper } from "../../../../../../components/TailwindControls/Form/RelatedTo/FormRelatedTo";
import { RelatedToDataModal } from "../../../../../../components/TailwindControls/Modals/RelatedToDataModal";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { SupportedApps } from "../../../../../../models/shared";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../utils/getFieldsFromDisplayExpression";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import RelatedTo from "../../../../../../components/TailwindControls/Form/RelatedTo/RelatedTo";
import { getModuleLabel } from "../../utils/getModuleLabel";
import Link from "next/link";
import { appsUrlGenerator } from "../../utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../../models/allowedViews";

export const DetailRelatedTo = ({
  data,
  field,
  fontSize,
  fieldsList,
  truncateData,
  handleRowClick,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fieldsList"
  | "handleRowClick"
>) => {
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched } = generalModelStore;
  const [showRelatedTo, setShowShowRelatedTo] = React.useState(false);
  const [relatedToData, setRelatedToData] = React.useState<{
    data: any[];
    loading: boolean;
  }>({ data: [], loading: true });
  const [modulesFetched, setModulesFetched] = React.useState<{
    data: IModuleMetadata[];
    loading: boolean;
  }>({ data: [], loading: true });

  const getModifiedModules = (modules: IModuleMetadata[]) => {
    return modules
      .map((module) => {
        return {
          name: module.name,
          label: module.label.en,
          searchBy: evaluateDisplayExpression(
            getFieldsFromDisplayExpression(
              module?.displayExpression ?? "${name}"
            ),
            genericModels[module.name]?.layouts?.[0]?.config?.fields || [],
            true
          ),
        };
      })
      .map(relatedLookupMapper);
  };

  React.useEffect(() => {
    if (
      !modulesFetched?.loading &&
      modulesFetched?.data?.length > 0 &&
      !modulesFetched
    )
      return;
    let moduleInfoFromStore: IModuleMetadata[] = [
      ...Object.keys(genericModels)
        ?.map((model) => {
          if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
            return genericModels[model]?.moduleInfo;
        })
        ?.filter((model) => model !== undefined),
    ];
    setModulesFetched({
      data: [...moduleInfoFromStore],
      loading: false,
    });
  }, [allModulesFetched]);

  const [getEditModeValues] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "cache-first",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const handleFetchDataForRelatedTo = async () => {
    let modifiedRelatedData: {
      moduleName: string;
      relatedToName: string;
      createdAt: string;
    }[] = [];
    const fetchPromise = await data[field.value].map(
      async (field: { recordId: string; moduleName: string | undefined }) => {
        const response = await getEditModeValues({
          variables: {
            modelName: camelCase(field.moduleName),
            fields: ["name", "id"],
            filters: [
              {
                operator: "in",
                name: "id",
                value: field.recordId,
              },
            ],
          },
        });
        return response.data?.fetch.data[0];
      }
    );
    await Promise.all(fetchPromise).then((result: any) => {
      const uniqueEntries = new Set();
      for (const res of result) {
        for (const relatedData of data[field.value]) {
          if (res.id === relatedData.recordId) {
            const uniqueKey = `${relatedData.moduleName}-${res.id}-${relatedData.createdAt}`;
            if (!uniqueEntries.has(uniqueKey)) {
              uniqueEntries.add(uniqueKey);
              modifiedRelatedData.push({
                moduleName: relatedData.moduleName,
                relatedToName: res.id,
                createdAt: relatedData.createdAt,
              });
            }
          }
        }
      }
    });
    return _.cloneDeep(modifiedRelatedData);
  };

  React.useEffect(() => {
    if (data[field.value] && data[field.value]?.length > 1 && showRelatedTo) {
      const handleFetch = async () => {
        const result = await handleFetchDataForRelatedTo();
        setRelatedToData({ data: _.cloneDeep(result), loading: false });
      };
      handleFetch();
    }
  }, [data[field.value], showRelatedTo]);

  React.useEffect(() => {
    if (
      data[field.value] &&
      data[field.value]?.length === 1 &&
      !showRelatedTo &&
      relatedToData?.loading
    ) {
      const handleFetch = async () => {
        const result = await handleFetchDataForRelatedTo();
        setRelatedToData({ data: _.cloneDeep(result), loading: false });
      };
      handleFetch();
    }
  }, []);

  return data[field.value]?.length ? (
    data[field.value]?.length > 1 ? (
      <>
        <Button
          id="related-to-details"
          customStyle={`text-vryno-theme-light-blue text-left inline-block `}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowShowRelatedTo(true);
          }}
          userEventName="relatedTo-details:view-click"
        >
          <p className={`${fontSize.value}`}>View Details</p>
        </Button>
        {showRelatedTo && (
          <>
            <RelatedToDataModal
              relatedListData={relatedToData?.data}
              modulesFetched={getModifiedModules(modulesFetched?.data)}
              setShowShowRelatedTo={setShowShowRelatedTo}
              fieldsList={fieldsList}
              fontSize={fontSize}
              handleRowClick={handleRowClick}
            />
            <Backdrop onClick={() => setShowShowRelatedTo(false)} />
          </>
        )}
      </>
    ) : modulesFetched?.loading || relatedToData?.loading ? (
      ""
    ) : (
      <Link
        href={appsUrlGenerator(
          SupportedApps.crm,
          relatedToData?.data[0]?.moduleName,
          AllowedViews.detail,
          relatedToData?.data[0]?.relatedToName
        )}
        legacyBehavior
      >
        <a
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick && handleRowClick(relatedToData?.data[0]);
          }}
          className={`text-gray-700 items-center w-full ${
            truncateData ? "truncate" : "relative"
          } ${fontSize.value}`}
        >
          <RelatedTo
            field={{
              moduleName: relatedToData?.data[0]?.moduleName,
              recordId: relatedToData?.data[0]?.relatedToName,
            }}
            index={0}
            modulesFetched={getModifiedModules(modulesFetched?.data)}
            fieldsList={fieldsList}
            truncateData={truncateData}
          />
          <span
            className="font-500 pl-1"
            data-testid={getModuleLabel(
              relatedToData?.data[0]?.moduleName,
              modulesFetched?.data
            )}
          >{`(${getModuleLabel(
            relatedToData?.data[0]?.moduleName,
            modulesFetched?.data
          )})`}</span>
        </a>
      </Link>
    )
  ) : (
    <span data-testid={`${field.label || field.value}-value`}>-</span>
  );
};
