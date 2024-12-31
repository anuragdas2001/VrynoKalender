import GenericHeaderCardContainer from "../../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { IFieldDependencyFieldType } from "./ConnectedCreateDependency";

export const DependencyStepTwo = ({
  selectedParentField,
  selectedChildField,
  handleLookupSelect,
  selectedLookups,
  saveProcessing,
}: {
  selectedParentField: IFieldDependencyFieldType | undefined;
  selectedChildField: IFieldDependencyFieldType | undefined;
  handleLookupSelect: (parentLookupId: string, childLookupId: string) => void;
  selectedLookups: {
    [key: string]: string[];
  };
  saveProcessing: boolean;
}) => {
  return (
    <>
      <div>
        <p className="text-sm">
          This page lets you map a parent field value with child field values.
          You can map more than one child field value to a parent field value.
        </p>
      </div>

      {selectedParentField &&
      selectedParentField &&
      selectedParentField.fieldData.dataTypeMetadata.lookupOptions.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-x-6 gap-y-2 mt-4">
          {selectedParentField.fieldData.dataTypeMetadata.lookupOptions.map(
            (
              parentOption: { id: string; label: { en: string } },
              parentIndex: number
            ) => {
              return (
                <GenericHeaderCardContainer
                  key={`parent-${parentIndex}`}
                  renderHtmlHeading={
                    <p className="text-left px-5 py-3 text-sm">
                      {selectedParentField.label}{" "}
                      <span className="font-semibold text-sl">
                        {parentOption.label.en}
                      </span>
                    </p>
                  }
                  cardHeading={`${selectedParentField.label} ${parentOption.label.en}`}
                  extended={true}
                  id="add-widgets-new-dashboard"
                  allowToggle={false}
                >
                  <div className="sm:col-span-5 flex flex-col">
                    <span className=" mb-2.5 text-sm tracking-wide font-medium">
                      {selectedChildField && selectedChildField.label}
                    </span>
                    <div className="border border-vryno-form-border-gray rounded-xl w-full h-64 p-3">
                      <div className="w-full h-full overflow-y-scroll">
                        {selectedChildField &&
                          selectedChildField.fieldData.dataTypeMetadata.lookupOptions.map(
                            (
                              childOption: {
                                id: string;
                                label: { en: string };
                              },
                              childIndex: number
                            ) => (
                              <span
                                key={`child-${childIndex}`}
                                onClick={(e) => {
                                  if (saveProcessing) return;
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleLookupSelect(
                                    parentOption.id,
                                    childOption.id
                                  );
                                }}
                                className={`text-sm p-2 mb-1 flex items-center ${
                                  !saveProcessing
                                    ? "hover:bg-vryno-theme-blue-disable"
                                    : ""
                                } cursor-pointer
                               ${
                                 selectedLookups[parentOption.id] &&
                                 selectedLookups[parentOption.id].includes(
                                   childOption.id
                                 )
                                   ? "bg-vryno-theme-highlighter-blue"
                                   : ""
                               }`}
                              >
                                {childOption.label.en}
                              </span>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </GenericHeaderCardContainer>
              );
            }
          )}
        </div>
      ) : (
        <div className="py-40 text-center bg-white w-full mt-6 rounded-xl">
          <p className="text-vryno-gray text-sm font-semibold">
            {selectedParentField?.label} lookup options not found.
          </p>
        </div>
      )}
    </>
  );
};
