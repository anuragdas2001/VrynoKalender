import _, { kebabCase } from "lodash";
import { sentenceCase } from "change-case";
import { IGenericModel } from "../../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import {
  IAuditActivityCreate,
  IAuditActivityUpdate,
  IAuditFieldUpdate,
  IFieldUpdateDetails,
  IQuotedItemCreate,
  IQuotedItemUpdate,
} from "../../../../../../../../shared/types/auditLogTypes";
import { AuditFieldMessageComponent } from "../AuditFieldMessageComponent";
import { ILayout } from "../../../../../../../../models/ILayout";

export const SubFormMessageComponent = ({
  subFormData,
  genericModels,
  layouts,
  type,
  moduleName = "",
}: {
  subFormData:
    | IAuditFieldUpdate
    | IAuditActivityCreate
    | IAuditActivityUpdate
    | IQuotedItemCreate
    | IQuotedItemUpdate;
  genericModels: IGenericModel;
  layouts: ILayout[];
  type: "create" | "update" | "delete";
  moduleName?:
    | "quotedItem"
    | "orderedItem"
    | "invoicedItem"
    | "purchaseItem"
    | "";
}) => {
  const moduleLayout = layouts.find(
    (layout) => layout.moduleName === moduleName
  );
  const fieldsList = moduleLayout ? moduleLayout.config.fields : [];
  const nameField = fieldsList?.find((field) => field.name === "name");
  const subFormDetailsByModule = _.get(
    _.get(
      subFormData,
      subFormData?.moduleUniqueName === "crm.sales_order"
        ? "orderedItemType"
        : subFormData?.moduleUniqueName === "crm.invoice"
        ? "invoicedItemType"
        : subFormData?.moduleUniqueName === "crm.purchase_order"
        ? "purchaseItemType"
        : "quotedItemType",
      {}
    ),
    "fieldUpdateDetails",
    {}
  );

  if (type === "delete") {
    return (
      <div
        data-testid={`audit-log-${kebabCase(
          subFormData.__typename || ""
        )}-${type}`}
      >
        {`${
          moduleName === "quotedItem"
            ? "Quoted"
            : moduleName === "invoicedItem"
            ? "Invoiced"
            : moduleName === "orderedItem"
            ? "Sales Ordered"
            : moduleName === "purchaseItem"
            ? "Purchased"
            : ""
        } item deleted`}
      </div>
    );
  }

  return (
    <div
      data-testid={`audit-log-${kebabCase(
        subFormData.__typename || ""
      )}-${type}`}
    >
      {`${sentenceCase(subFormData.__typename || "")}`}
      {nameField?.isMasked ? ` masked field ${nameField.label.en}` : ""}
      {[
        "QuotedItemCreate",
        "QuotedItemUpdate",
        "OrderedItemCreate",
        "OrderedItemUpdate",
        "InvoicedItemCreate",
        "InvoicedItemUpdate",
        "PurchaseItemCreate",
        "PurchaseItemUpdate",
      ].includes(subFormData.__typename) ? (
        subFormDetailsByModule &&
        Object.keys(
          _.get(
            _.get(
              subFormData,
              subFormData?.moduleUniqueName === "crm.sales_order"
                ? "orderedItemType"
                : subFormData?.moduleUniqueName === "crm.invoice"
                ? "invoicedItemType"
                : subFormData?.moduleUniqueName === "crm.purchase_order"
                ? "purchaseItemType"
                : "quotedItemType",
              {}
            ),
            "fieldUpdateDetails",
            {}
          )
        )?.length ? (
          <>
            {Object.keys(subFormDetailsByModule).map(
              (key: string, index: number) => {
                const extractedValue =
                  subFormDetailsByModule as IFieldUpdateDetails;
                const field = fieldsList?.find(
                  (field) => field.name === key.split(".").pop()
                );
                if (!field) {
                  return "";
                }
                if (field.dataType === "relatedTo") {
                  let data = "";
                  if (extractedValue[key].relatedToMetadata)
                    for (const val in extractedValue[key].relatedToMetadata) {
                      data += ` ${val}: ${
                        extractedValue[key].relatedToMetadata?.[
                          val
                        ]?.toString() || ""
                      }`;
                    }
                  return (
                    <div
                      className="flex flex-row gap-x-1"
                      data-testid={"audit-log-field-update-data"}
                      key={index}
                    >
                      <div className="flex flex-row gap-x-1 flex-shrink-0">
                        {field?.isMasked ? "Masked field " : "Field "}
                        <div
                          className="italic font-light max-w-[200px] truncate pr-0.5"
                          title={
                            extractedValue[key].fieldLabel ||
                            field.label.en ||
                            field.name
                          }
                        >
                          {extractedValue[key].fieldLabel ||
                            field.label.en ||
                            field.name}
                        </div>{" "}
                        associated with
                      </div>
                      <div className="font-semibold">
                        <AuditFieldMessageComponent
                          field={field}
                          auditData={subFormData}
                          data={data}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    className="flex flex-row gap-x-1"
                    data-testid={"audit-log-field-update-data"}
                    key={index}
                  >
                    <div className="flex flex-row gap-x-1 flex-shrink-0">
                      {field?.isMasked ? "Masked field " : "Field "}
                      <span
                        className="italic font-light max-w-[200px] truncate pr-0.5"
                        title={
                          extractedValue[key].fieldLabel ||
                          field.label.en ||
                          field.name
                        }
                      >
                        {extractedValue[key].fieldLabel ||
                          field.label.en ||
                          field.name}
                      </span>{" "}
                      {field.dataType === "recordImage"
                        ? "updated"
                        : "value updated from"}
                    </div>
                    {field.dataType === "recordImage" ? (
                      <></>
                    ) : (
                      <>
                        {/* <div className="flex-grow font-semibold"> */}
                        <div className="font-semibold">
                          <AuditFieldMessageComponent
                            field={field}
                            auditData={subFormData}
                            data={extractedValue[key].oldValue ?? ""}
                          />
                        </div>
                        <div className="flex-shrink-0">{` to `}</div>
                        <div className="flex-grow font-semibold">
                          <AuditFieldMessageComponent
                            field={field}
                            auditData={subFormData}
                            data={extractedValue[key].newValue ?? ""}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              }
            )}
          </>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </div>
  );
};
