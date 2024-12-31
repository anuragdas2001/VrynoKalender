import _ from "lodash";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getColorPallet } from "../../../../../../Shared/colorPallet";
import { ICustomField } from "../../../../../../../models/ICustomField";

export type BarChartGraphProps = {
  data: Record<string, string | number>[];
  fieldsList?: ICustomField[];
  allowDataManipulation?: boolean;
  changeGraphToStack?: boolean;
};

export const BarGraphChart = ({
  data,
  fieldsList = [],
  allowDataManipulation = true,
  changeGraphToStack = false,
}: BarChartGraphProps) => {
  const [updatedData, setUpdatedData] = React.useState<
    Record<string, string | number>[]
  >([...data]);
  const [xaxisDataKeys, setXAxisDataKeys] = React.useState<string[]>([]);
  const [yaxisDataKeys, setYAxisDataKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (data?.length > 0) {
      let yaxisKeyList: string[] = [];
      let xaxisKeyList: string[] = [];
      let unqiueKeyValues: Record<string, string | number> = {};
      data?.forEach(
        (data) => (unqiueKeyValues = { ...unqiueKeyValues, ...data })
      );
      Object.keys(unqiueKeyValues)?.map((key: string) => {
        const findIndex = fieldsList?.findIndex((field) => field.name === key);
        if (typeof unqiueKeyValues[key] === "number") {
          if (findIndex !== -1 && allowDataManipulation) {
            yaxisKeyList.push(
              _.get(
                fieldsList[findIndex]?.label,
                "en",
                fieldsList[findIndex]?.name
              )
            );
          } else {
            yaxisKeyList.push(key);
          }
        } else if (typeof unqiueKeyValues[key] === "string" && key !== "name") {
          if (findIndex !== -1 && allowDataManipulation) {
            xaxisKeyList.push(
              _.get(
                fieldsList[findIndex]?.label,
                "en",
                fieldsList[findIndex]?.name
              )
            );
          } else {
            xaxisKeyList.push(key);
          }
        }
      });

      setXAxisDataKeys(xaxisKeyList?.filter((key) => key));
      setYAxisDataKeys(yaxisKeyList?.filter((key) => key));

      if (allowDataManipulation) {
        setUpdatedData([
          ...data?.map((item) => {
            let updatedObject: Record<string, string | number> = {};
            Object.keys(item)?.map((key: string) => {
              if (typeof item[key] === "number") {
                const findIndex = fieldsList?.findIndex(
                  (field) => field.name === key
                );
                if (findIndex !== -1) {
                  updatedObject[
                    _.get(
                      fieldsList[findIndex]?.label,
                      "en",
                      fieldsList[findIndex]?.name
                    )
                  ] = item[key];
                }
              } else {
                updatedObject[key] = item[key];
              }
            });
            return updatedObject;
          }),
        ]);
      } else {
        setUpdatedData([...data]);
      }
    }
  }, [data]);

  const CustomXAxisTick = (props: any) => {
    const { x, y, dx, dy, payload } = props;
    const payloadValue =
      typeof payload.value === "number"
        ? new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
          }).format(payload.value)
        : payload.value;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={dy ?? 16}
          dx={dx ?? 16}
          textAnchor="end"
          fill="#000"
          style={{ fontSize: "12px", width: "20px" }}
        >
          {payloadValue}
        </text>
      </g>
    );
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-row gap-x-4 w-full">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className={`text-xsm flex items-center gap-x-2 break-keep`}
          >
            <p
              className={`w-3 h-3 rounded-full inline-block`}
              style={{
                backgroundColor:
                  getColorPallet()[
                    index % 2 !== 0 ? index % 900 : 900 - (index % 900)
                  ],
              }}
            ></p>
            <p className="inline-block break-keep whitespace-nowrap">
              {entry.value}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer height={250} width="100%">
      <BarChart
        width={300}
        height={250}
        data={updatedData}
        barSize={20}
        style={{ overflow: "hidden" }}
      >
        {["name", ...xaxisDataKeys].map((dataKey, index) => (
          <XAxis key={dataKey} dataKey={dataKey} tick={<CustomXAxisTick />} />
        ))}
        {yaxisDataKeys.map((dataKey, index) => (
          <YAxis
            key={dataKey}
            yAxisId={
              !changeGraphToStack
                ? index % 2 === 0
                  ? "left"
                  : "right"
                : "left"
            }
            orientation={
              !changeGraphToStack
                ? index % 2 === 0
                  ? "left"
                  : "right"
                : "left"
            }
            tick={<CustomXAxisTick />}
            dy={0}
            dx={!changeGraphToStack ? (index % 2 === 0 ? 0 : 30) : 0}
          />
        ))}
        <Tooltip wrapperStyle={{ overflowY: "scroll" }} />
        <Legend
          iconType={"circle"}
          verticalAlign="bottom"
          content={renderLegend}
          align="center"
          wrapperStyle={{
            maxWidth: `80%`,
            overflowX: "scroll",
            position: "absolute",
            padding: "0 10px",
          }}
        />
        {yaxisDataKeys.map((dataKey, index) => (
          <Bar
            key={index}
            yAxisId={
              !changeGraphToStack
                ? index % 2 === 0
                  ? "left"
                  : "right"
                : "left"
            }
            stackId={changeGraphToStack ? "" : "a"}
            dataKey={dataKey}
            fill={
              getColorPallet()[
                index % 2 !== 0 ? index % 900 : 900 - (index % 900)
              ]
            }
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
