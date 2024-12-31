import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Text,
} from "recharts";

const blues = ["#D6E5FA", "#F2F8FF"];
const getColor = (length: number) => {
  if (length) {
    return blues[0];
  } else {
    return blues[1];
  }
};

export type EmailStatsBarGraphProps = {
  data: ({ name: string; value: any } | undefined)[];
  xKey?: string;
  yKey?: string;
};

let ctx: any;

export const measureTextWidth = (text: string) => {
  if (!ctx) {
    ctx = document.createElement("canvas").getContext("2d");
  }
  return ctx.measureText(text).width;
};

const BAR_AXIS_SPACE = 10;

export const EmailStatsBarGraph = ({
  data,
  xKey = "name",
  yKey = "value",
}: EmailStatsBarGraphProps) => {
  const maxTextWidth = useMemo(
    () =>
      data.reduce((acc, cur: any) => {
        const value = cur[yKey];
        const width = measureTextWidth(value.toLocaleString());
        if (width > acc) {
          return width;
        }
        return acc;
      }, 0),
    [data, yKey]
  );

  return (
    <ResponsiveContainer width={"100%"} height={50 * data.length} debounce={50}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 36, right: maxTextWidth + (BAR_AXIS_SPACE - 8) }}
      >
        <XAxis
          hide
          axisLine={false}
          type="number"
          padding={{ right: 10, left: 10 }}
        />
        <YAxis
          orientation="left"
          yAxisId={0}
          dataKey={xKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <YAxis
          orientation="right"
          yAxisId={1}
          dataKey={yKey}
          type="category"
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
          mirror
          tick={{
            transform: `translate(${maxTextWidth + BAR_AXIS_SPACE}, 0)`,
          }}
        />
        <Bar dataKey={yKey} minPointSize={2} barSize={32}>
          {data.length > 0 &&
            data.map((d: any) => {
              return <Cell key={d[xKey]} fill={getColor(d[yKey])} />;
            })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
