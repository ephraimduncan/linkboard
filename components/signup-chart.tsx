import {
  Area as AreaBase,
  AreaChart,
  CartesianGrid,
  XAxis as XAxisBase,
  type AreaProps,
  type XAxisProps,
} from "recharts";
import type { ComponentType } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const XAxis = XAxisBase as unknown as ComponentType<XAxisProps>;
const Area = AreaBase as unknown as ComponentType<AreaProps>;

const chartConfig = {
  count: {
    label: "Signups",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function SignupChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(5)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillSignups" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-count)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-count)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="monotone"
          fill="url(#fillSignups)"
          stroke="var(--color-count)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
