import { getCurrentUserId } from "@/lib/auth-utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

export interface UserIssue {
  id: string;
  title: string;
  description: string;
  date?: string;
  status?: string;
  location?: string;
  images?: string[];
}

export const useFetchIssues = () => {
  const userId = getCurrentUserId();
  if (!userId) unauthorized();
  return useSuspenseQuery<UserIssue[]>({
    queryKey: ["user/issues/fetch", userId],
    queryFn: async () => {
      const res = await fetch("/api/user/issue/fetch", {
        headers: { "X-User-Id": userId },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch issues");
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.issues || [];
    },
  });
};
