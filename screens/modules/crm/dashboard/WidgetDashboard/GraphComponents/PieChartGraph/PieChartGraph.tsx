import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  SectorProps,
} from "recharts";
import _ from "lodash";
import { getColorPallet } from "../../../../../../Shared/colorPallet";
import { ICustomField } from "../../../../../../../models/ICustomField";

declare type PieActiveShape =
  | React.ReactElement<SVGElement>
  | ((props: any) => React.ReactElement<SVGElement>)
  | SectorProps;

export type PieChartGraphProps = {
  data: { name: string; value: number }[];
  fieldsList?: ICustomField[];
  allowDataManipulation?: boolean;
  containerHeight?: number;
  containerWidth?: number;
  outerRadius?: number;
  innerRadius?: number;
  legendWidth?: number;
  cy?: number;
  legendBackgroundColor?: string;
};

const renderActiveShape = (
  props: any,
  showFullValue: boolean,
  setShowFullValue: (value: boolean) => void
) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g data-testid={payload.name}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        data-testid={payload.name}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
        data-testid={payload.name}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        data-testid={payload.name}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      {/* <foreignObject
        x={(cos >= 0 ? 1 : -1) * 10 + (cos >= 0 ? ex : ex - 75)}
        y={ey - 20}
        width={"120"}
        height="25"
      >
        <div
          data-testid={payload.name}
          className="w-full text-sm break-all"
          style={{
            color: "#666",
          }}
          onMouseEnter={() => setShowFullValue(true)}
          onMouseLeave={() => setShowFullValue(false)}
        >
          {`${payload.name}`}
        </div>
      </foreignObject> */}
      <text
        fontSize={13}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={6}
        textAnchor={textAnchor}
        fill="#999"
        data-testid={"value"}
      >
        {`Value : ${value}`}
      </text>
    </g>
  );
};

export const PieChartGraph = ({
  data,
  allowDataManipulation = true,
  fieldsList,
  containerHeight,
  containerWidth,
  outerRadius = 55,
  innerRadius = 30,
  legendWidth = 70,
  cy,
  legendBackgroundColor,
}: PieChartGraphProps) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [showFullValue, setShowFullValue] = React.useState<boolean>(false);

  const onPieEnter = (_: any, index: any) => {
    setActiveIndex(index);
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="flex flex-col justify-center gap-x-4 pr-4 w-full">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className={`text-xsm flex items-center gap-x-2`}
          >
            <p
              className={`w-3 h-3 rounded-full`}
              style={{
                backgroundColor:
                  getColorPallet()[
                    index % 2 !== 0 ? index % 900 : 900 - (index % 900)
                  ],
              }}
            ></p>
            <p className={`w-[${legendWidth}%] max-w-[100px]  truncate`}>
              {entry.value}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      style={{ height: containerHeight ? containerHeight : "100%" }}
      className="w-full"
    >
      <div className={`w-full flex items-center px-4 py-2 gap-x-3`}>
        {data?.length > 0 && (
          <p
            className={`w-3 h-3 rounded-full`}
            style={{
              backgroundColor:
                getColorPallet()[
                  activeIndex % 2 !== 0
                    ? activeIndex % 900
                    : 900 - (activeIndex % 900)
                ],
            }}
          ></p>
        )}
        <p className="text-sm text-gray-600 truncate">{`${
          data[activeIndex]?.name ?? ""
        }`}</p>
      </div>
      <ResponsiveContainer
        height={containerHeight ? containerHeight : "100%"}
        width={"100%"}
      >
        <PieChart>
          <Pie
            data={data}
            activeIndex={activeIndex}
            activeShape={(activeShape: PieActiveShape | undefined) => {
              return renderActiveShape(
                activeShape,
                showFullValue,
                setShowFullValue
              );
            }}
            cx="50%"
            cy={`${cy ?? 33}%`}
            label={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                data-testid={`${entry.name}`}
                fill={
                  getColorPallet()[
                    index % 2 !== 0 ? index % 900 : 900 - (index % 900)
                  ]
                }
                className={`cursor-pointer text-xsm`}
              />
            ))}
          </Pie>
          <Legend
            iconType={"circle"}
            layout="vertical"
            align={"right"}
            verticalAlign="top"
            content={renderLegend}
            wrapperStyle={{
              height: "60%",
              maxWidth: `60%`,
              overflowY: "scroll",
              position: "absolute",
              backgroundColor: legendBackgroundColor ?? "white",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
