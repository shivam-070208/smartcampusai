import { useSuspenseQuery } from "@tanstack/react-query";
import { getCurrentUserId} from "@/components/helpers/auth-helper";

const fetchDashboard = async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const res = await fetch("/api/user/dashboard", {
    cache: "no-store",
    headers: {
      "X-User-Id": userId,
    },
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentication required. Please login again.");
    }
    throw new Error("Failed to fetch dashboard data");
  }

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
