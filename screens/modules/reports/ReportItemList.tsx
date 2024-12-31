import GenericList, {
  GenericListHeaderType,
} from "../../../components/TailwindControls/Lists/GenericList";
import { useTranslation } from "next-i18next";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { BaseGenericObjectType } from "../../../models/shared";

export const ReportItemList = function <T>({
  data,
  tableHeaders,
  noOfItems,
  restoreBin,
  deleteBinItems,
  onItemSelect,
  selectedItems,
  selectAllItems,
}: {
  data: BaseGenericObjectType[];
  tableHeaders: Array<GenericListHeaderType>;
  noOfItems: number;
  restoreBin: () => void;
  deleteBinItems: () => void;
  selectedItems: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  selectAllItems: () => void;
}) {
  const { t } = useTranslation(["customizations", "common"]);
  return (
    <div>
      <div className="px-5 py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center h-32 sm:h-24">
        <div>
          <span className="text-vryno-label-gray text-sm sm:text-sm">
            Total Records:&nbsp;
            <span className="text-vryno-theme-blue-secondary">{noOfItems}</span>
          </span>
        </div>
        <div className="grid grid-cols-4 mt-4 gap-x-8 sm:gap-x-4 sm:mt-0 w-full sm:w-1/2 sm:max-w-xs">
          {selectedItems.length ? (
            <>
              <div className="col-span-2">
                <Button
                  type="button"
                  id="recycle-restore"
                  onClick={() => {
                    restoreBin();
                  }}
                  kind="primary"
                  buttonType="thin"
                  userEventName="reports-recycle-restore-click"
                >
                  {t("Restore")}
                </Button>
              </div>
              <div className="col-span-2">
                <Button
                  type="button"
                  id="recycle-delete"
                  onClick={() => {
                    deleteBinItems();
                  }}
                  kind="next"
                  buttonType="thin"
                  userEventName="reports-recycle-delete-click"
                >
                  {t("Delete")}
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div>
        {noOfItems != 0 ? (
          <div className="px-5">
            <GenericList
              tableHeaders={tableHeaders}
              data={data}
              selectedItems={selectedItems}
              onItemSelect={(value) => onItemSelect(value)}
              selectAllItems={selectAllItems}
              onDetail={false}
              showIcons={false}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
