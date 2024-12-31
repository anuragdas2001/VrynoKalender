import { kebabCase } from "lodash";
import { sentenceCase } from "change-case";
import { ICustomField } from "../../../../../../models/ICustomField";
import { TimelineFieldUpdate } from "./TimelineTypeComponents/TimelineFieldUpdate";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { AuditActivityMessageComponent } from "./TimelineTypeComponents/AuditActivityMessageComponent";
import {
  IAuditActivityCreate,
  IAuditActivityDelete,
  IAuditActivityUpdate,
  IAuditFieldUpdate,
  IAuditRecordCreate,
  IAuditRecordDelete,
  IAuditWorkflowAction,
  IMaskedView,
  IQuotedItemCreate,
  IQuotedItemDelete,
  IQuotedItemUpdate,
} from "../../../../../../shared/types/auditLogTypes";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import { User } from "../../../../../../models/Accounts";
import { SubFormMessageComponent } from "./TimelineTypeComponents/SubFormMessageComponent/SubFormMessageComponent";
import { ILayout } from "../../../../../../models/ILayout";
export interface INotesSuggestions {
  items: ({ query }: { query: any }) => Promise<any>;
  render: () => {
    onStart: (props: any) => void;
    onUpdate(props: any): void;
    onKeyDown(props: any): any;
    onExit(): void;
  };
}

export const TimelineContentMessageComponent = {
  recordCreate: (auditData: IAuditRecordCreate) => {
    return <div data-testid={"audit-log-record-create"}>Record</div>;
  },
  recordDelete: (auditData: IAuditRecordDelete) => {
    return <div data-testid={"audit-log-record-delete"}>Record</div>;
  },
  fieldUpdate: (
    auditData: IAuditFieldUpdate,
    _: unknown,
    fieldsList: ICustomField[]
  ) => <TimelineFieldUpdate auditData={auditData} fieldsList={fieldsList} />,
  leadConvert: (auditData: IAuditRecordCreate) => {
    return <div data-testid={"audit-log-lead-convert"}>Lead Converted</div>;
  },
  quoteConvert: (auditData: IAuditActivityCreate) => {
    return <div data-testid={"audit-log-quote-convert"}>Quote Converted</div>;
  },
  salesOrderConvert: (auditData: IAuditActivityCreate) => {
    return (
      <div data-testid={"audit-log-sales-order-convert"}>
        Sales order Converted
      </div>
    );
  },
  invoiceConvert: (auditData: IAuditActivityCreate) => {
    return (
      <div data-testid={"audit-log-invoice-convert"}>Invoice Converted</div>
    );
  },
  quotedItemCreate: (
    quotedItemData: IQuotedItemCreate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="create"
        moduleName="quotedItem"
      />
    );
  },
  orderedItemCreate: (
    quotedItemData: IQuotedItemCreate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="create"
        moduleName="orderedItem"
      />
    );
  },
  invoicedItemCreate: (
    quotedItemData: IQuotedItemCreate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="create"
        moduleName="invoicedItem"
      />
    );
  },
  purchaseItemCreate: (
    quotedItemData: IQuotedItemCreate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="create"
        moduleName="purchaseItem"
      />
    );
  },
  quotedItemUpdate: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="update"
        moduleName="quotedItem"
      />
    );
  },
  orderedItemUpdate: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="update"
        moduleName="orderedItem"
      />
    );
  },
  invoicedItemUpdate: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="update"
        moduleName="invoicedItem"
      />
    );
  },
  purchaseItemUpdate: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="update"
        moduleName="purchaseItem"
      />
    );
  },
  quotedItemDelete: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="delete"
        moduleName="quotedItem"
      />
    );
  },
  orderedItemDelete: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="delete"
        moduleName="orderedItem"
      />
    );
  },
  invoicedItemDelete: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="delete"
        moduleName="invoicedItem"
      />
    );
  },
  purchaseItemDelete: (
    quotedItemData: IQuotedItemUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <SubFormMessageComponent
        subFormData={quotedItemData}
        genericModels={genericModels}
        layouts={layouts}
        type="delete"
        moduleName="purchaseItem"
      />
    );
  },
  activityCreate: (
    auditData: IAuditActivityCreate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <AuditActivityMessageComponent
        auditData={auditData}
        noteSuggestions={noteSuggestions}
        genericModels={genericModels}
        layouts={layouts}
        type="create"
      />
    );
  },
  activityUpdate: (
    auditData: IAuditActivityUpdate,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    genericModels: IGenericModel,
    user: User | null,
    layouts: ILayout[]
  ) => {
    return (
      <AuditActivityMessageComponent
        auditData={auditData}
        noteSuggestions={noteSuggestions}
        genericModels={genericModels}
        layouts={layouts}
        type="update"
      />
    );
  },
  activityDelete: (auditData: IAuditActivityDelete) => {
    return (
      <div
        data-testid={`audit-log-${kebabCase(
          auditData.activityType?.__typename || ""
        )}-delete`}
      >
        {`${sentenceCase(auditData.activityType.__typename)}`}
        {auditData.activityType.activityRecordName && (
          <span className="font-semibold">{` ${auditData.activityType.activityRecordName}`}</span>
        )}
      </div>
    );
  },
  workflowAction: (auditData: IAuditWorkflowAction) => {
    return auditData.workflowType.__typename === "EmailWorkflow" ? (
      <div data-testid={"audit-log-workflow-email"}>
        Email triggered for{" "}
        <span className="italic font-light">Rule Name:</span>{" "}
        <span className="font-semibold">{auditData.workflowType.ruleName}</span>
      </div>
    ) : auditData.workflowType.__typename === "InAppNotificationWorkflow" ? (
      <div data-testid={"audit-log-workflow-notification"}>
        Notification generated{" "}
        <span className="font-semibold">
          {auditData.workflowType.actionName}
        </span>
      </div>
    ) : auditData.workflowType.__typename === "WebhookWorkflow" ? (
      <div data-testid={"audit-log-workflow-webhook"}>
        Webhook triggered for{" "}
        <span className="italic font-light">Rule Name:</span>{" "}
        <span className="font-semibold">{auditData.workflowType.ruleName}</span>
      </div>
    ) : (
      <div data-testid={"audit-log-workflow"}>Workflow generated</div>
    );
  },
  maskedView: (
    auditData: IMaskedView,
    noteSuggestions: INotesSuggestions,
    fieldsList: ICustomField[],
    _: IGenericModel,
    user: User | null
  ) => {
    const fieldsName = auditData.fieldName
      .map(
        (name) =>
          fieldsList.find((field) => field.name === name)?.label.en || name
      )
      ?.toString();
    return (
      <div data-testid={"audit-log-masked-view"}>
        Masked {auditData.fieldName?.length > 1 ? "fields " : "field "}
        <span className="font-semibold">{fieldsName}</span>
        {" viewed by"}{" "}
        <span className="italic text-xs">{` ${
          auditData.createdBy
        } - ${getDateAndTime(auditData.createdAt, user ?? undefined)} `}</span>
      </div>
    );
  },
};
