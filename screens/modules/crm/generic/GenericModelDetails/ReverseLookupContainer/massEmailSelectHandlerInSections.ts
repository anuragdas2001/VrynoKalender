import _ from "lodash";
import { SendEmailModalRecordsType } from "../GenericModelDetailsScreen";

export const handleSelectedMassEmailRecord = (
  sendMassEmailRecords: SendEmailModalRecordsType | undefined,
  item: Partial<{ id: string }>
) => {
  return sendMassEmailRecords && sendMassEmailRecords?.selectedItems?.length > 0
    ? [...sendMassEmailRecords?.selectedItems]?.filter(
        (record) => record?.id === _.get(item, "id", "")
      )?.length > 0
      ? [...sendMassEmailRecords?.selectedItems]?.filter(
          (record) => record.id !== item.id
        )
      : [...sendMassEmailRecords?.selectedItems, item]
    : [item];
};
