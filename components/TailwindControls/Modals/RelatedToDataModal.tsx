import React from "react";
import { ICustomField, SupportedDataTypes } from "../../../models/ICustomField";
import GenericList from "../Lists/GenericList";
import { ClickOutsideToClose } from "../shared/ClickOutsideToClose";
import { Loading } from "../Loading/Loading";
import { Backdrop } from "../Backdrop";
import GenericFormModalContainer from "./FormModal/GenericFormModalContainer";
import RelatedTo from "../Form/RelatedTo/RelatedTo";
import { appsUrlGenerator } from "../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { SupportedApps } from "../../../models/shared";
import { AllowedViews } from "../../../models/allowedViews";
import { useRouter } from "next/router";

export function RelatedToDataModal({
  relatedListData,
  modulesFetched = [],
  setShowShowRelatedTo,
  fieldsList,
  fontSize,
  handleRowClick = () => {},
}: {
  relatedListData: any;
  modulesFetched: {
    value: string;
    label: string;
    additionalValues: Array<string>;
  }[];
  fontSize: {
    header: string;
    value: string;
  };
  setShowShowRelatedTo: any;
  fieldsList: ICustomField[] | undefined;
  handleRowClick?: (record: Record<string, string>) => void;
}) {
  const wrapperRef = React.useRef(null);
  const router = useRouter();
  ClickOutsideToClose(wrapperRef, (value: boolean) =>
    setShowShowRelatedTo(false)
  );

  return (
    <>
      <GenericFormModalContainer
        topIconType="Close"
        formHeading={`Related To`}
        extendedWidth={true}
        onCancel={() => setShowShowRelatedTo(false)}
        onOutsideClick={() => setShowShowRelatedTo(false)}
      >
        <div className="overflow-y-scroll py-5 max-h-[50%]">
          {relatedListData.length ? (
            <GenericList
              listSelector={false}
              data={relatedListData}
              fieldsList={fieldsList}
              tableHeaders={[
                {
                  columnName: "moduleName",
                  label: "Related To",
                  dataType: SupportedDataTypes.singleline,
                },
                {
                  columnName: "relatedToName",
                  label: "Name",
                  dataType: SupportedDataTypes.recordLookup,
                  render: (record: any, index: number) => {
                    return (
                      <div className={`text-gray-400 ${fontSize.value}`}>
                        <RelatedTo
                          field={{
                            moduleName: record.moduleName,
                            recordId: record.relatedToName,
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
                  dataType: SupportedDataTypes.datetime,
                },
              ]}
              oldGenericListUI={true}
              includeUrlWithRender={true}
              rowUrlGenerator={(record) =>
                appsUrlGenerator(
                  SupportedApps.crm,
                  record.moduleName,
                  AllowedViews.detail,
                  record.relatedToName
                )
              }
              handleRowClick={(record) => {
                router.push(
                  appsUrlGenerator(
                    SupportedApps.crm,
                    record.moduleName,
                    AllowedViews.detail,
                    record.relatedToName
                  )
                );
                handleRowClick(record);
                setShowShowRelatedTo(false);
              }}
            />
          ) : (
            <div className="w-full h-full py-3.5 flex items-center justify-center bg-white">
              <Loading color="Blue" />
            </div>
          )}
        </div>
      </GenericFormModalContainer>
      <Backdrop onClick={() => setShowShowRelatedTo(false)} />
    </>
  );
}
