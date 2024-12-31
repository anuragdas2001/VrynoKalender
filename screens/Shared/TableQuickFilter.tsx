import { Formik } from "formik";
import React from "react";
import FormInputBox from "../../components/TailwindControls/Form/InputBox/FormInputBox";
import SearchIcon from "remixicon-react/SearchLineIcon";

export const TableQuickFilter = ({
  filterName,
  hideSearchBar = false,
  setFilterValue = () => {},
}: {
  filterName: string;
  hideSearchBar?: boolean;
  setFilterValue?: (value: string) => void;
}) => {
  return (
    <Formik
      initialValues={{ "table-quick-filter": "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, setFieldValue }) => (
        <div
          className={`w-full max-w-[300px] ${hideSearchBar ? "hidden" : ""}`}
        >
          <FormInputBox
            name="table-quick-filter"
            onChange={(e) => {
              setFieldValue("table-quick-filter", e.currentTarget.value);
              setFilterValue(e.currentTarget.value);
            }}
            placeholder={`Search`}
            allowMargin={false}
            rightIcon={<SearchIcon size={16} className="text-gray-400" />}
          />
        </div>
      )}
    </Formik>
  );
};
