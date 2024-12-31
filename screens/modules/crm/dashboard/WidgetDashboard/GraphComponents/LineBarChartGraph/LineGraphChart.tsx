import _, { isNumber } from "lodash";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getColorPallet } from "../../../../../../Shared/colorPallet";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { BaseGenericObjectType } from "../../../../../../../models/shared";

export type LineChartGraphProps = {
  data: BaseGenericObjectType[];
  fieldsList?: ICustomField[];
  allowDataManipulation?: boolean;
  changeGraphToStack?: boolean;
};

export const LineGraphChart = ({
  data,
  fieldsList = [],
  allowDataManipulation = true,
  changeGraphToStack = false,
}: LineChartGraphProps) => {
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
        if (
          typeof unqiueKeyValues[key] === "number" &&
          String(unqiueKeyValues[key]) !== "NaN"
        ) {
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

      setXAxisDataKeys(xaxisKeyList);
      setYAxisDataKeys(yaxisKeyList);

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
          transform={props.rotate ? props.rotate : ""}
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
      <LineChart
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
            yAxisId={index % 2 === 0 ? "left" : "right"}
            orientation={index % 2 === 0 ? "left" : "right"}
            tick={<CustomXAxisTick />}
            dy={0}
            dx={index % 2 === 0 ? 0 : 30}
          />
        ))}
        <Tooltip wrapperStyle={{ overflowY: "scroll" }} />
        <Legend
          iconType={"circle"}
          verticalAlign="bottom"
          content={renderLegend}
          align="center"
          wrapperStyle={{
            maxWidth: `100%`,
            overflowX: "scroll",
            position: "absolute",
            padding: "0 10px",
          }}
        />
        {yaxisDataKeys.map((dataKey, index) => (
          <Line
            key={index}
            yAxisId={index % 2 === 0 ? "left" : "right"}
            type="monotone"
            dataKey={dataKey}
            stroke={
              getColorPallet()[
                index % 2 !== 0 ? index % 900 : 900 - (index % 900)
              ]
            }
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
