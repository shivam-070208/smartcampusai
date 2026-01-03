"use client";
import {
  DashboardContainer,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderCard,
} from "@/components/common/dashboard-layout";
import { PinnedMap } from "@/components/common/pinned-map";
import {
  Item,
  ItemGroup,
  ItemTitle,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
} from "@/components/ui/item";
import React, { Suspense } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useChartData, useRecents, useSummary } from "../hooks/use-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Loader from "@/components/common/loader";

type SeriesKey = "active" | "resolved" | "critical" | "rejected";

const COLORS: Record<SeriesKey, string> = {
  active: "#06b6d4",
  resolved: "#10b981",
  critical: "#ef4444",
  rejected: "#f59e0b",
};

// Helper: parse "lng,lat" (string) as [number, number], null if invalid
function parseLocation(location: string): [number, number] | null {
  if (!location || typeof location !== "string") return null;
  const [lng, lat] = location.split(",").map(Number);
  if (
    typeof lng === "number" &&
    typeof lat === "number" &&
    !isNaN(lng) &&
    !isNaN(lat)
  ) {
    return [lng, lat];
  }
  return null;
}

const InlineChart = ({ className = "" }: { className?: string }) => {
  const { chartData } = useChartData();
  return (
    <Card className={cn("w-full h-full ", className)}>
      <CardHeader>
        <CardTitle>Graph</CardTitle>
        <CardDescription>
          Graphical Repersentation of issue posting over time
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-full">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => (d as string).slice(5)}
              stroke="#7b8794"
            />
            <YAxis stroke="#7b8794" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="active"
              stroke={COLORS.active}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke={COLORS.resolved}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="critical"
              stroke={COLORS.critical}
              strokeWidth={2}
              dot
            />
            <Line
              type="monotone"
              dataKey="rejected"
              stroke={COLORS.rejected}
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="mt-3 flex gap-3 flex-wrap text-sm">
        {(Object.keys(COLORS) as SeriesKey[]).map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span
              style={{ background: COLORS[k] }}
              className="w-3 h-3 rounded-full inline-block"
            />
            <span className="capitalize">{k}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
};

const RecentIssues = ({ className = "" }: { className?: string }) => {
  const { recents } = useRecents();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
          <CardTitle >
            Recent Issues
            </CardTitle>
        <CardDescription>
          Recent issue reported by you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="px-2">
          {(recents ?? []).slice(0, 4).map((it: any, idx: number) => (
            <React.Fragment key={idx}>
              <Item className="p-3">
                <ItemMedia variant="icon">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: COLORS[it.status as SeriesKey],
                    }}
                  />
                </ItemMedia>
                <div className="flex-1">
                  <ItemTitle>{it.title}</ItemTitle>
                  <ItemDescription>{it.description}</ItemDescription>
                </div>
                <div className="text-xs text-muted-foreground">
                  {it.date?.slice(5)}
                </div>
              </Item>
              {idx < 3 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

const UserDashBoard = () => {
  const { summary } = useSummary();
  const { recents } = useRecents();

  // Collect coordinates from recents for the map
  const coords =
    (recents ?? [])
      .map((it: { location: any }) => parseLocation(it.location))
      .filter((c: unknown): c is [number, number] => Array.isArray(c) && c.length === 2);

  const summaryData = [
    {
      status: "active",
      title: "Active Sessions",
      description: "Issue that you reported and are active.",
      data: summary.active || 0,
    },
    {
      status: "resolved",
      title: "Completed Tasks",
      description: "Issue that you reported and are succesfully resolved.",
      data: summary.resolved || 0,
    },
    {
      status: "critical",
      title: "Critical Alerts",
      description: "Issue that you reported and are critical.",
      data: summary.critical || 0,
    },
    {
      status: "rejected",
      title: "Rejected Requests",
      description: "Issue that you reported and are rejected.",
      data: summary.rejected || 0,
    },
  ];

  return (
    <DashboardContainer>
      <DashboardHeader title="SmartCampusAi" description="SmartCampusAi">
        {summaryData.map((item, idx) => (
          <DashboardHeaderCard
            key={idx}
            status={
              item.status as "active" | "resolved" | "critical" | "rejected"
            }
            title={item.title}
            description={item.description}
            data={item.data}
          />
        ))}
      </DashboardHeader>
      <DashboardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[400px]">
        <Suspense fallback={<Loader />}>
          <PinnedMap
            className="h-full w-full rounded-md md:row-span-2 overflow-hidden"
            coords={coords}
          />
        </Suspense>
        <InlineChart />
        <RecentIssues className="flex flex-col gap-4 w-full overflow-y-auto" />
      </DashboardContent>
    </DashboardContainer>
  );
};

export { UserDashBoard };
