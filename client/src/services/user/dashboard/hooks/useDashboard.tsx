import { useSuspenseQuery } from "@tanstack/react-query";

const fetchDashboard = async () => {
  const res = await fetch("/api/user/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
};


export const useDashboardData = () => {
  return useSuspenseQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useSummary = () => {
  const { data,isLoading,isError } = useDashboardData();
  return {summary:data.summary,isLoading,isError};
};

export const useChartData = () => {
    const { data,isLoading,isError } = useDashboardData();
    return {chartData:data.chartData,isLoading,isError};
};

export const useRecents = () => {
    const { data,isLoading,isError } = useDashboardData();
  return {recents:data.recents,isLoading,isError};
};
