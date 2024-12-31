import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import React from "react";
import { setHeight } from "../../../shared/utils/setHeight";
import { removeHeight } from "../../../shared/utils/removeHeight";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import { paramCase } from "change-case";
import { IEmailItemTabValue, IEmailJobItem } from "./emailJobItemHelper";

export const EmailJobItemTable = ({
  data,
  fieldsList,
  appName,
  modelName,
  selectedEmailItemTab,
}: {
  data: IEmailJobItem[];
  fieldsList: ICustomField[];
  appName: string;
  modelName: string;
  selectedEmailItemTab: IEmailItemTabValue;
}) => {
  const EmailJobItemsHeightRef = React.useRef(null);

  const tableHeaders = [
    {
      columnName: "status",
      label: "Status",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "errorMessage",
      label: "Error Message",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "name",
      label:
        fieldsList.filter((field) => field.name === "name")[0].label.en ||
        "Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "recipientEmails",
      label: "Email",
      dataType: SupportedDataTypes.email,
    },
  ];

  React.useEffect(() => {
    if (EmailJobItemsHeightRef) {
      setHeight(EmailJobItemsHeightRef, 30);
    }
  }, [data]);

  return (
    <div className="py-4 px-4 bg-white rounded-xl w-full">
      <div
        ref={EmailJobItemsHeightRef}
        className="flex flex-col lg:flex-row bg-white w-full"
      >
        <GenericList
          data={data}
          tableHeaders={
            ["success", "sent", "delivered"].includes(selectedEmailItemTab)
              ? [
                  ...tableHeaders,
                  {
                    columnName: "isOpened",
                    label: "Opened",
                    dataType: SupportedDataTypes.boolean,
                  },
                  {
                    columnName: "isClicked",
                    label: "Clicked",
                    dataType: SupportedDataTypes.boolean,
                  },
                ]
              : tableHeaders
          }
          fieldsList={fieldsList.filter((field) => field.visible)}
          onDetail={false}
          showIcons={false}
          listSelector={false}
          rowUrlGenerator={(item) => {
            return item.emailRecipientRecordId
              ? `/app/${appName}/${paramCase(modelName)}/detail/${
                  item.emailRecipientRecordId
                }`
              : "#";
          }}
        />
      </div>
    </div>
  );
};
