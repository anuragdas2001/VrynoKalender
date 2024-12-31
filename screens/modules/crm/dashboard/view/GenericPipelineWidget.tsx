import React from "react";
import { Formik } from "formik";
import { getSortedArray } from "./getSortedArray";
import ArrowIcon from "remixicon-react/ArrowRightLineIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import _ from "lodash";
import PaginationMini from "../../shared/components/PaginationMini";

export default function GenericPipelineWidget({
  data,
  widgetName,
}: {
  data: any;
  widgetName: string;
}) {
  const [totalRecords, setTotalRecords] = React.useState<number>(0);
  const [currentPipeline, setCurrentPipeline] = React.useState();
  const [currentPipelineData, setCurrentPipelineData] = React.useState([]);
  React.useEffect(() => {
    if (data && data.length > 0) {
      const defaultPipeline = data?.filter((item: any) => item.default);
      setCurrentPipeline(
        defaultPipeline?.length > 0 ? defaultPipeline[0].name : data[0].name
      );
    }
  }, [data]);

  React.useEffect(() => {
    if (data && currentPipeline) {
      setCurrentPipelineData(
        data?.filter(
          (item: Partial<{ name: string }>) => item.name === currentPipeline
        )
      );
    }
  }, [data, currentPipeline]);

  React.useEffect(() => {
    if (currentPipelineData?.length > 0) {
      let totalRecords = 0;
      Object.keys(currentPipelineData[0])?.forEach(
        (key) =>
          (totalRecords += _.get(currentPipelineData[0][key], "count", 0))
      );
      setTotalRecords(totalRecords);
    }
  }, [currentPipelineData]);

  return (
    <div
      className={`bg-white w-full h-full rounded-xl col-span-full flex flex-col`}
    >
      <div className={`w-full h-full flex flex-col`}>
        <div className="w-full h-full flex items-center justify-between border-b py-2 px-4 ">
          <span
            className="font-medium truncate flex items-center"
            data-testid={`${widgetName}-widget-name`}
          >
            {widgetName}
          </span>
          <div className="flex items-center gap-x-3">
            <PaginationMini
              itemsCount={totalRecords}
              currentPageNumber={1}
              onPageChange={() => {}}
              currentPageItemCount={totalRecords}
              showPageChanger={false}
              showPageCount={false}
              pageSize={totalRecords}
            />
            <form onSubmit={(e) => e.preventDefault()} className="">
              <Formik
                initialValues={{ currentPipeline: currentPipeline }}
                enableReinitialize
                onSubmit={(values) => console.log(values)}
              >
                {({ setFieldValue }) => (
                  <FormDropdown
                    name={"currentPipeline"}
                    options={data?.map((item: Partial<{ name: string }>) => {
                      return { value: item.name, label: item.name };
                    })}
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "currentPipeline",
                        selectedOption.currentTarget.value
                      );
                      setCurrentPipeline(selectedOption.currentTarget.value);
                    }}
                    placeholder="Select"
                    allowMargin={false}
                  />
                )}
              </Formik>
            </form>
          </div>
        </div>
      </div>
      <div className={`w-full h-full mt-4 px-4 pb-3`}>
        <div
          className={`w-full h-full flex items-center justify-between gap-x-10 overflow-x-scroll pb-1`}
        >
          {currentPipelineData &&
          currentPipelineData?.length > 0 &&
          Object.keys(currentPipelineData[0]).length > 1 ? (
            getSortedArray(currentPipelineData[0])?.map(
              (item, index: number) => (
                <React.Fragment key={index}>
                  <div
                    className={`w-full flex items-center border border-gray-100 shadow-sm rounded-md py-2.5 max-w-[200px] 2xl:max-w-[250px] mx-2 px-2`}
                  >
                    <div className="w-full flex flex-col items-center justify-center">
                      <span className="text-sm whitespace-nowrap">
                        {item["name"]}
                      </span>
                      <span className="p-2 my-1 bg-vryno-theme-light-blue whitespace-nowrap text-white text-navbar font-medium rounded-md flex">
                        {`+${item["count"]}`}
                      </span>
                      <span className="font-medium">{`${item["amount"]}`}</span>
                    </div>
                  </div>
                  <Button
                    id="pipeline-widget-arrow-action"
                    customStyle={`${
                      index + 1 ===
                      Object.keys(currentPipelineData[0]).filter(
                        (item) => item !== "name" && item !== "default"
                      ).length
                        ? "hidden"
                        : ""
                    }`}
                    userEventName="pipeline-widget-arrow:action-click"
                  >
                    <ArrowIcon className={`text-gray-300 w-7 h-7 `} />
                  </Button>
                </React.Fragment>
              )
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center mb-4">
              <p className="text-sm mt-2 text-vryno-card-heading-text">
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
