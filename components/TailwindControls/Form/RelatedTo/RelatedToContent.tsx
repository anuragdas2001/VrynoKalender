import { ActionWrapper } from "../../../../screens/modules/crm/shared/components/ActionWrapper";
import GenericList from "../../Lists/GenericList";
import { ShowResultsBox } from "../SearchBox/ShowResultsBox";
import RelatedTo from "./RelatedTo";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { IconInsideInputBox, IconLocation } from "../../IconInsideInputBox";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import SearchIcon from "remixicon-react/SearchLineIcon";
import { getSearchByList } from "../ModuleSearchBox/getSearchByList";
import { SupportedDataTypes } from "../../../../models/ICustomField";
import { useFormikContext } from "formik";
import Button from "../Button/Button";
import ItemsLoader from "../../ContentLoader/Shared/ItemsLoader";
import { IRelatedToContentProps } from "./RelatedToContentContainer";
import { evaluateDisplayExpression } from "../../../../screens/modules/crm/shared/utils/getFieldsFromDisplayExpression";

export const RelatedToContent = ({
  label,
  required,
  inputRef,
  modulesFetched,
  inputBox,
  searchLoading,
  inputHeight,
  inputWidth,
  lookupRef,
  isPanelBelowVisible,
  searchResults,
  relatedListData,
  relatedToFields,
  demoSearchResults,
  rejectRequired = false,
  disableSearchButton,
  disabled,
  setPanelBelowVisible,
  handleOnChange,
  setRelatedToFields,
  setRelatedListData,
  handleResultShow,
  setCurrentFormLayer,
  labelClasses,
  handleGetLayout,
  setShowSearchScreen,
  setLocalSearchModal,
  appName,
  fieldsList,
  handleSelectedItem,
  name,
  moduleLoading,
}: IRelatedToContentProps) => {
  const {
    values,
    setFieldValue,
    setFieldTouched,
    handleChange,
    errors,
    touched,
  } = useFormikContext<Record<string, string>>();
  const isValid = touched[name] ? errors[name] === undefined : true;
  const error: string | undefined = errors[name];
  const borderClass =
    (touched[name] ? errors[name] === undefined : true) || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = (touched[name] ? errors[name] === undefined : true)
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  return (
    <>
      {label && (
        <label
          className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses}`}
        >
          {label}
          <RequiredIndicator required={rejectRequired ? false : required} />
        </label>
      )}
      <div className={`flex w-full items-center`}>
        <div
          className={`flex w-full rounded-md items-center border ${borderClass} ${focusBorderClass}`}
          ref={inputRef}
        >
          <div className={`relative w-1/3`}>
            <select
              id="related-to-dropdown"
              name="relatedToDropdown"
              onChange={(selectedOption: React.ChangeEvent<any>) => {
                setFieldValue("relatedToDropdown", selectedOption.target.value);
                handleGetLayout(selectedOption);
              }}
              onBlur={() => setFieldTouched("relatedToDropdown")}
              value={values["relatedToDropdown"]}
              disabled={Boolean(values["relatedToLookup"]) || disabled}
              className={`relative w-full rounded-md rounded-r-none text-sm py-2 px-2 focus:outline-none placeholder-vryno-placeholder`}
            >
              <option value="" disabled hidden>
                Select Module
              </option>
              {modulesFetched.length > 0 &&
                modulesFetched.map(
                  (
                    opt: {
                      label: string;
                      value: string;
                      additionalValues: Array<string>;
                    },
                    index: number
                  ) => (
                    <option
                      className="w-full"
                      id={opt.label}
                      key={index}
                      value={opt.value}
                      label={opt.label}
                    >
                      {opt.value}
                    </option>
                  )
                )}
            </select>
          </div>
          <div className={`relative w-2/3 text-sm break-words`}>
            <input
              ref={inputBox}
              autoComplete="new-password"
              id="relatedToLookup"
              name="relatedToLookup"
              placeholder={`Enter to search`}
              disabled={!values["relatedToDropdown"]}
              className={`relative w-full py-2 border-l placeholder-vryno-placeholder px-2 outline-none`}
              onChange={(e) => {
                handleOnChange(e);
                setFieldValue("relatedToLookup", e.target.value);
              }}
              onFocus={() => {
                handleResultShow();
                setPanelBelowVisible(true);
                setShowSearchScreen(true);
              }}
            />
            {values["relatedToDropdown"] &&
              IconInsideInputBox(
                <SearchIcon
                  size={20}
                  className="text-vryno-icon-gray cursor-pointer"
                />,
                IconLocation.Right,
                () => {
                  setLocalSearchModal("");
                  setShowSearchScreen(true);
                },
                disableSearchButton
              )}
          </div>
        </div>
      </div>
      {rejectRequired ? (
        !isValid || (error && !error?.includes("required")) ? (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {error}
          </label>
        ) : (
          <></>
        )
      ) : (
        !isValid &&
        error && (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {error}
          </label>
        )
      )}
      <div className="relative z-[2000] -top-4">
        <ShowResultsBox
          appName={appName}
          modelName={values["relatedToDropdown"]}
          searchedValue={values["relatedToLookup"]}
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
          fieldLabel={label}
          searchProcessing={searchLoading}
          isPanelBelowVisible={isPanelBelowVisible}
          searchResults={searchResults}
          demoSearchResults={demoSearchResults}
          searchBy={
            modulesFetched.filter(
              (module) => module.value === values["relatedToDropdown"]
            )?.length > 0 && fieldsList?.length > 0
              ? evaluateDisplayExpression(
                  getSearchByList(
                    fieldsList,
                    modulesFetched.filter(
                      (module) => module.value === values["relatedToDropdown"]
                    )[0].additionalValues
                  ),
                  fieldsList,
                  true,
                  true
                )
              : ["name"]
          }
          fieldsList={fieldsList}
          setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
          handleSelectedItem={(item) => {
            handleSelectedItem(item);
          }}
          showModelNameInSearch={false}
          setCurrentFormLayer={(value) =>
            setCurrentFormLayer && setCurrentFormLayer(value)
          }
          handleAddedRecord={(value) => {
            handleSelectedItem({
              rowId: value.id,
              values: { ...value },
              modelName: "",
              moduleUniqueName: "",
            });
          }}
        />
      </div>
      <div className="mt-4 relative overflow-scroll z-1 max-h-[320px]">
        {moduleLoading ? (
          <ItemsLoader currentView="List" loadingItemCount={0} />
        ) : (
          <GenericList
            listSelector={false}
            data={relatedListData}
            stickyHeader={false}
            fieldsList={fieldsList}
            oldGenericListUI={true}
            tableHeaders={[
              {
                columnName: "relatedToModule",
                label: "Related To",
                dataType: SupportedDataTypes.singleline,
                render: (record: any, index: number) => {
                  return (
                    <div className="text-gray-400">
                      {modulesFetched?.length
                        ? modulesFetched?.filter(
                            (module) => module.value === record.relatedToModule
                          )[0].label
                        : record.relatedToModule}
                    </div>
                  );
                },
              },
              {
                columnName: "relatedToName",
                label: "Name",
                dataType: SupportedDataTypes.recordLookup,
                render: (record: any, index: number) => {
                  return (
                    <div className="text-gray-400">
                      <RelatedTo
                        field={{
                          moduleName: record.relatedToModule,
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
              {
                columnName: "actions",
                label: "Actions",
                dataType: SupportedDataTypes.singleline,
                render: (record: any, index: number) => {
                  return (
                    <ActionWrapper
                      index={index}
                      stickyHeader={false}
                      content={
                        <tbody className="w-full">
                          <tr className={`text-sm text-left`}>
                            <td
                              className={`py-5 max-w-table-column truncate flex gap-x-4 text-vryno-theme-light-blue`}
                            >
                              <Button
                                id={`delete-related-to-${record.relatedToName}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const remainingItems = relatedToFields.filter(
                                    (innerField) =>
                                      JSON.stringify(innerField) !==
                                      JSON.stringify({
                                        moduleName: record.relatedToModule,
                                        recordId: record.relatedToName,
                                        createdAt: record.createdAt,
                                      })
                                  );
                                  setFieldValue(
                                    name,
                                    remainingItems?.length === 0
                                      ? null
                                      : remainingItems
                                  );
                                  setRelatedToFields(remainingItems);
                                  setRelatedListData(
                                    relatedListData.filter(
                                      (val: any) =>
                                        JSON.stringify(val) !==
                                        JSON.stringify(record)
                                    )
                                  );
                                }}
                                customStyle="cursor-pointer"
                                userEventName="relatedTo-item-delete:action-click"
                              >
                                <DeleteBinIcon size={20} />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      }
                    />
                  );
                },
              },
            ]}
          />
        )}
      </div>
    </>
  );
};
