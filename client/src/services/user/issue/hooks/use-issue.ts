import { useAuth } from "@/components/providers/auth-context";
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
  const { user } = useAuth();

  return useSuspenseQuery<UserIssue[]>({
    queryKey: ["user/issues/fetch", user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        unauthorized();
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/user/issue/fetch", {
        headers: { "X-User-Id": token },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch issues");
      }
      const data = await res.json();
      return Array.isArray(data) ? data : data.issues || [];
    },
  });
};



import { useMutation } from "@tanstack/react-query";

export const usePublishIssue = () => {
  const { user } = useAuth();
  if(!user){
    unauthorized()
  }
  return useMutation({
    mutationFn: async (form: FormData) => {
      try {
        const userId =await user.getIdToken()
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/user/issue/publish`,
          {
            method: "POST",
            body: form,
            credentials: "same-origin",
            headers: {
              "X-User-Id": userId,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          return { success: false, error: text || "Failed to publish issue" };
        }
        const data = await response.json();
        return { success: true, data };
      } catch (error: any) {
        return {
          success: false,
          error: error?.message || "Failed to submit issue",
        };
      }
    }
  });
};
