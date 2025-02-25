"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState } from "react";
dayjs.extend(isoWeek);

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const groupByDay = (data: any) => {
  const dailyData: Record<string, { total_quantity: number; total_price: number }> = {};

  data.forEach((sale: any) => {
    const date = sale.sale_date;
    if (!dailyData[date]) {
      dailyData[date] = { total_quantity: 0, total_price: 0 };
    }

    dailyData[date].total_quantity += Number(sale.quantity_sold);
    dailyData[date].total_price += Number(sale.total_price);
  });

  return Object.fromEntries(
    Object.entries(dailyData).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
  );
};


const groupByWeek = (dailyData: Record<string, { total_quantity: number; total_price: number }>) => {
  const weeklyData: Record<string, { week_start: string, week_end: string, total_quantity: number; total_price: number; details: any[] }> = {};

  Object.entries(dailyData).forEach(([date, values]) => {
    const weekStart = dayjs(date).startOf("isoWeek").format("YYYY-MM-DD");
    const weekEnd = dayjs(date).endOf("isoWeek").format("YYYY-MM-DD");
    const weekKey = `${weekStart} -> ${weekEnd}`;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        week_start: weekStart,
        week_end: weekEnd,
        total_quantity: 0,
        total_price: 0,
        details: []
      };
    }

    weeklyData[weekKey].total_quantity += values.total_quantity;
    weeklyData[weekKey].total_price += values.total_price;
    weeklyData[weekKey].details.push({
      date,
      total_quantity: values.total_quantity,
      total_price: values.total_price
    });
  });

  return Object.entries(weeklyData)
    .sort(
      ([a], [b]) => dayjs(a.split(" -> ")[0]).unix() - dayjs(b.split(" -> ")[0]).unix()
    )
    .map(([key, values]) => ({ key, ...values }));
};

export default function ChartPage() {

  const [checkAllWeek, setCheckAllWeek] = useState(true);
  const [week, setWeek] = useState('');

  const { data, error, isLoading } = useQuery({
    queryKey: ["customerChartData"],
    queryFn: async () => {
      const res = await fetch("/api/customer");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const dailyDayData = groupByDay(data);
  console.log(dailyDayData);
  const dailyWeekData = groupByWeek(dailyDayData);
  console.log(dailyWeekData);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Bar Chart - Multiple</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <div>
          <Button asChild>
            <Link href="/dashboard/product">Table Page</Link>
          </Button>
        </div>

      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={checkAllWeek ? dailyWeekData : dailyWeekData.find((item) => item.key === week)?.details || []}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={checkAllWeek ? "key" : "date"}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide={checkAllWeek ? true : false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="total_quantity" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="total_price" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 text-sm">
        <div>
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </div>

        <div>
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                setCheckAllWeek(true);
                setWeek('');
              } else {
                setWeek(value);
                setCheckAllWeek(false);
              }
            }}
          >
            <SelectTrigger className="w-[220px] ml-auto">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Week</SelectItem>
                {dailyWeekData.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.key}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>

  )
}
