import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";
  import Chart from "react-apexcharts";
  import { ReactNode } from "react";
  import { ApexOptions } from "apexcharts";
  
  type ColorVariant =
    | "white"
    | "blue-gray"
    | "gray"
    | "brown"
    | "deep-orange"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "light-green"
    | "green"
    | "teal"
    | "cyan"
    | "light-blue"
    | "blue"
    | "indigo"
    | "deep-purple"
    | "purple"
    | "pink"
    | "red";
  
  interface ChartProps {
    type: "line" | "area" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "treemap";
    height?: number | string;
    width?: number | string;
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  }
  
  interface StatisticsChartProps {
    color?: ColorVariant;
    chart: ChartProps;
    title: ReactNode;
    description: ReactNode;
    footer?: ReactNode;
  }
  
  export function StatisticsChart({
    color = "blue",
    chart,
    title,
    description,
    footer = null,
  }: StatisticsChartProps) {
    return (
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader variant="gradient" color={color} floated={false} shadow={false}>
          <Chart {...chart} />
        </CardHeader>
        <CardBody className="px-6 pt-0">
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
          <Typography variant="small" className="font-normal text-blue-gray-600">
            {description}
          </Typography>
        </CardBody>
        {footer && (
          <CardFooter className="border-t border-blue-gray-50 px-6 py-5">
            {footer}
          </CardFooter>
        )}
      </Card>
    );
  }
  
  export default StatisticsChart;
  