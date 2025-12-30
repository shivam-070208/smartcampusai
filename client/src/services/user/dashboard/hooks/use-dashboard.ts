import { useSuspenseQuery } from "@tanstack/react-query";
import { getCurrentUserId} from "@/lib/auth-utils";
import { unauthorized } from "next/navigation";

const fetchDashboard = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    unauthorized();
  }
  const res = await fetch("/api/user/dashboard", {
    cache: "no-store",
    headers: {
      "X-User-Id": userId,
    },
  });
  
  if (!res.ok) {
    if (res.status === 401) {
     unauthorized();
    }
    throw new Error("Failed to fetch dashboard data");
  }
  return res.json();
};


export const useDashboardData = () => {
  return useSuspenseQuery({
    queryKey: ["user/dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useSummary = () => {
  const { data } = useDashboardData();
  return { summary: data.summary };
};

export const useChartData = () => {
  const { data } = useDashboardData();
  return { chartData: data.chartData };
};

export const useRecents = () => {
  const { data } = useDashboardData();
  return { recents: data.recents };
};