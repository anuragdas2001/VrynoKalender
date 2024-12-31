import { toast } from "react-toastify";
import React, { useContext } from "react";
import { useTranslation } from "next-i18next";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { getDateAndTime } from "../../../../../components/TailwindControls/DayCalculator";
import RelatedTo from "../../../../../components/TailwindControls/Form/RelatedTo/RelatedTo";
import { useLazyQuery } from "@apollo/client";
import { IUserPreference } from "../../../../../models/shared";
import { getFieldsFromDisplayExpression } from "../../shared/utils/getFieldsFromDisplayExpression";
import { relatedLookupMapper } from "../../../../../components/TailwindControls/Form/RelatedTo/FormRelatedTo";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { AllowedViews } from "../../../../../models/allowedViews";
import { UserStoreContext } from "../../../../../stores/UserStore";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../models/ICustomField";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SectionDetailsType } from "../GenericForms/Shared/genericFormProps";

export type ActivityContainerProps = {
  relatedToData: any[];
  app: string;
  modelName: string;
  heading: string;
  extended?: boolean;
  id: string;
  containerId: string;
  section?: SectionDetailsType;
  userPreferences?: IUserPreference[];
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  fieldsList: ICustomField[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
};

export const RelatedToContainer = ({
  relatedToData,
  app,
  modelName,
  heading,
  extended = false,
  id,
  containerId,
  section,
  userPreferences,
  handleOpenCollapseCardContainer = () => {},
  fieldsList,
  genericModels,
  allModulesFetched,
}: ActivityContainerProps) => {
  const { t } = useTranslation(["common"]);
  const { appName } = getAppPathParts();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const [relatedValues, setRelatedValues] = React.useState<any[]>([]);
  const [errorRelatedValuesIds, setErrorRelatedValueIds] = React.useState<
    string[]
  >([]);
  const [viewPermission, setViewPermission] = React.useState(true);
  const [modulesFetched, setModulesFetched] = React.useState<
    {
      value: string;
      label: string;
      additionalValues: Array<string>;
    }[]
  >([]);

  const [relatedToDataLoader, setRelatedToDataLoader] = React.useState(true);
  const [moduleLoading, setModuleLoading] = React.useState(true);

  const tableHeaders = [
    {
      columnName: "model",
      label: "Related To",
      dataType: SupportedDataTypes.singleline,
      render: (record: any, index: number) => {
        return (
          <div className="text-gray-400">
            {modulesFetched?.length
              ? modulesFetched?.filter(
                  (module) => module.value === record.model
                )[0]?.label
              : record.relatedToModule}
          </div>
        );
      },
    },
    {
      columnName: "name",
      label: "Name",
      dataType: SupportedDataTypes.recordLookup,
      render: (record: any, index: number) => {
        return (
          <div className="text-vryno-theme-blue-secondary">
            <RelatedTo
              field={{
                moduleName: record.model,
                recordId: record.id,
              }}
              index={index}
              modulesFetched={modulesFetched}
              fieldsList={fieldsList}
            />
          </div>
        );
      },
    },
    {
      columnName: "createdAt",
      label: "Date Added",
      dataType: SupportedDataTypes.singleline,
    },
  ];

  React.useEffect(() => {
    if (allModulesFetched) {
      setModulesFetched(
        Object.keys(genericModels)
          .map((module) => {
            if (genericModels[module]?.moduleInfo?.customizationAllowed) {
              return {
                name: genericModels[module]?.moduleInfo.name,
                label: genericModels[module]?.moduleInfo.label.en,
                searchBy: getFieldsFromDisplayExpression(
                  genericModels[module]?.moduleInfo?.displayExpression ??
                    "${name}"
                ),
              };
            } else return null;
          })
          ?.filter((module) => module !== null)
          .map(relatedLookupMapper)
      );
      setModuleLoading(false);
    }
  }, [allModulesFetched]);

  const [fetchRelatedRecords] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: app,
      },
    },
  });

  React.useEffect(() => {
    if (relatedToData && relatedToData?.length > 0) {
      setRelatedToDataLoader(true);
      const handleRelatedToDataFetch = async () => {
        try {
          const RelatedToPromise = relatedToData.map(async (val) => {
            if (!val.moduleName || !val.recordId) return null;
            const data = await fetchRelatedRecords({
              variables: {
                modelName: val.moduleName,
                fields: ["id", "name", "moduleName"],
                filters: [
                  { name: "id", operator: "eq", value: [val.recordId] },
                  {
                    operator: "in",
                    name: "recordStatus",
                    value: ["a", "i"],
                  },
                ],
              },
            });
            return data;
          });
          await Promise.all(RelatedToPromise).then((response) => {
            let hadPermission = true;
            let responseRelatedValues: any = response
              .filter((data) => data)
              .map((val) => {
                if (val?.data?.fetch.data) {
                  return {
                    ...val.data.fetch.data[0],
                    createdAt: getDateAndTime(
                      relatedToData.filter(
                        (related) =>
                          val.data &&
                          val.data.fetch.data[0]?.id === related.recordId
                      )[0]?.createdAt ||
                        val?.data.fetch.data[0]?.createdAt ||
                        "",
                      user ?? undefined
                    ),
                  };
                } else if (
                  val?.data?.fetch?.messageKey.includes("requires-view")
                ) {
                  hadPermission = false;
                  toast.error(val.data?.fetch?.message);
                  return;
                } else {
                  toast.error(t("common:unknown-message"));
                  return;
                }
              })
              .filter((val) => val !== undefined);
            if (!hadPermission) {
              setViewPermission(false);
              setRelatedToDataLoader(false);
              return;
            }
            responseRelatedValues = responseRelatedValues.length
              ? responseRelatedValues.map((val: { id: string }) => {
                  const relatedItem = relatedToData.filter(
                    (item) => item.recordId === val?.id
                  );
                  return { ...val, model: relatedItem[0]?.moduleName };
                })
              : [];
            const relatedDataValues = responseRelatedValues.filter(
              (data: any) => data.id
            );
            const flatRelatedDataValues = relatedDataValues.map(
              (data: any) => data.id
            );
            setRelatedValues(relatedDataValues);
            setErrorRelatedValueIds(
              relatedToData
                .filter(
                  (data) => !flatRelatedDataValues.includes(data.recordId)
                )
                .map((val) => val.recordId)
            );
            setRelatedToDataLoader(false);
          });
        } catch (error) {
          console.error(error);
          setRelatedToDataLoader(false);
        }
      };
      handleRelatedToDataFetch();
    } else {
      setRelatedToDataLoader(false);
    }
  }, [id, relatedToData]);

  const RelatedToMessageOnlyComponent = (message: string) => {
    return (
      <GenericHeaderCardContainer
        id={containerId}
        cardHeading={heading}
        extended={extended}
        modelName={modelName}
        userPreferences={userPreferences}
        handleOpenCollapseCardContainer={(id, showDetails) =>
          handleOpenCollapseCardContainer(id, showDetails)
        }
      >
        <div className="w-full flex items-center justify-center">
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </GenericHeaderCardContainer>
    );
  };

  return relatedToDataLoader || moduleLoading ? (
    <GenericHeaderCardContainer cardHeading={heading} extended={extended}>
      <ItemsLoader currentView={"List"} loadingItemCount={0} />
    </GenericHeaderCardContainer>
  ) : fieldsList?.filter((field) => field.name === "relatedTo")?.[0]?.visible ==
    false ? (
    RelatedToMessageOnlyComponent("No view permission for field Related To")
  ) : relatedToData?.length !== 0 ? (
    <GenericHeaderCardContainer
      id={containerId}
      cardHeading={heading}
      extended={extended}
      section={section}
      modelName={modelName}
      userPreferences={userPreferences}
      handleOpenCollapseCardContainer={(id, showDetails) =>
        handleOpenCollapseCardContainer(id, showDetails)
      }
      fetchErrorIconData={!viewPermission ? null : errorRelatedValuesIds}
    >
      {!viewPermission ? (
        <NoViewPermission
          modelName={heading}
          showIcon={false}
          autoHeight={false}
          shadow={false}
          fontSize={"text-sm"}
          entireMessage={false}
        />
      ) : (
        <div
          className={`${
            userPreferences?.[0]?.defaultPreferences?.[modelName]
              ?.selectedSizeView === "noLimit"
              ? ""
              : // : "max-h-80 overflow-scroll"
                "overflow-y-auto max-h-64 max-w-[inherit]"
          }`}
        >
          {relatedValues?.length !== 0 ? (
            <GenericList
              tableHeaders={tableHeaders}
              fieldsList={fieldsList}
              data={relatedValues}
              listSelector={false}
              rowUrlGenerator={(item) => {
                return appsUrlGenerator(
                  appName,
                  item.model,
                  AllowedViews.detail,
                  item.id as string
                );
              }}
              includeUrlWithRender={true}
              oldGenericListUI={true}
            />
          ) : (
            <div className="w-full flex items-center justify-center">
              <span className="text-sm text-gray-600">No Data Found</span>
            </div>
          )}
        </div>
      )}
    </GenericHeaderCardContainer>
  ) : (
    RelatedToMessageOnlyComponent("No Data Found")
  );
};
