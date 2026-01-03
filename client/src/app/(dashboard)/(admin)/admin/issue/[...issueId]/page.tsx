"use client";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/auth-context";
import { unauthorized } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Loader from "@/components/common/loader";
import { Suspense, useState } from "react";
import { PinnedMap } from "@/components/common/pinned-map";
import Container from "@/components/common/container";

interface Issue {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: "active" | "resolved" | "critical" | "rejected";
  location: string; // Must be a string like "77.216721,28.6448"
  images: string[];
  userId: string;
  date: string;
  ai_summary?: string;
}

// Helper to parse "lng,lat" string
function parseLocation(location: string): [number, number] | null {
  if (!location) return null;
  const parts = location.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return null;
}

const useFetchIssue = (issueId: string) => {
  const { user } = useAuth();

  return useSuspenseQuery<Issue>({
    queryKey: ["user/issue", issueId, user?.uid],
    queryFn: async () => {
      if (!user?.uid) {
        unauthorized();
      }
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/issue/${issueId}`, {
        headers: { "X-User-Id": token },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch issue");
      }
      return await res.json();
    },
  });
};

const getStatusStyle = (status: Issue["status"]) => {
  switch (status) {
    case "active": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "resolved": return "bg-green-100 text-green-800 border-green-200";
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "rejected": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-blue-100 text-blue-800";
  }
};

const IssueDetailContent = ({ issueId }: { issueId: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: issue } = useFetchIssue(issueId);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState<string | null>(null);

  // Mutation for resolving/rejecting
  const resolveOrRejectMutation = useMutation({
    mutationFn: async ({ status }: { status: "resolved" | "rejected" }) => {
      if (!user?.uid) throw new Error("Not authenticated");
      setActionPending(status);
      setActionError(null);
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/dashboard`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": token,
        },
        body: JSON.stringify({ id: issueId, newStatus: status }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      return await res.json();
    },
    onSuccess: () => {
      setActionPending(null);
      queryClient.invalidateQueries({ queryKey: ["user/issue", issueId, user?.uid] });
    },
    onError: (error) => {
      if (error instanceof Error) setActionError(error.message);
      setActionPending(null);
    },
  });

  // Parse the location field for map use
  const coords: [number, number][] = (() => {
    const parsed = parseLocation(issue.location);
    return parsed ? [parsed] : [];
  })();

  // Button disabled logic
  const canModify = issue.status === "active" || issue.status === "critical";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusStyle(issue.status)} uppercase tracking-wide`}>
                {issue.status}
              </span>
            </div>
            <div className="mb-2">
              <span className="block text-sm text-gray-700 font-semibold mb-1">Description:</span>
              <p className="text-gray-600 text-base leading-relaxed">{issue.description}</p>
            </div>
            {issue.ai_summary && (
              <div>
                <span className="block text-sm text-indigo-700 font-semibold mb-1">AI Description:</span>
                <div className="bg-indigo-50 border border-indigo-200 rounded px-3 py-2 text-indigo-800 text-sm">
                  {issue.ai_summary}
                </div>
              </div>
            )}
            {/* Action buttons for admins */}
            {canModify && (
              <div className="flex gap-3 mt-4">
                <button
                  className="px-4 py-2 text-sm rounded bg-green-600 hover:bg-green-700 text-white font-bold shadow disabled:opacity-50 transition"
                  disabled={actionPending === "resolved"}
                  onClick={() => resolveOrRejectMutation.mutate({ status: "resolved" })}
                >
                  {actionPending === "resolved" ? "Resolving..." : "Mark as Resolved"}
                </button>
                <button
                  className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white font-bold shadow disabled:opacity-50 transition"
                  disabled={actionPending === "rejected"}
                  onClick={() => resolveOrRejectMutation.mutate({ status: "rejected" })}
                >
                  {actionPending === "rejected" ? "Rejecting..." : "Reject Issue"}
                </button>
              </div>
            )}
            {actionError && (
              <div className="mt-2 text-red-600 text-sm font-semibold">{actionError}</div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(issue.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
            <div className="text-xs text-gray-400">
              Created {new Date(issue.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm text-blue-600 font-medium gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Coordinates: {issue.location}
        </div>
      </div>
      {issue.images.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Images</h2>
          <div className="space-y-6">
            {issue.images.map((image, index) => {
              const enhancedImageUrl = image.replace('/upload/', '/upload/c_fill,w_800,h_600,q_auto,f_auto/');
              return (
                <div key={index} className="flex justify-center">
                  <div className="max-w-4xl w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-lg">
                    <img
                      src={enhancedImageUrl}
                      alt={`Issue image ${index + 1}`}
                      className="w-full h-auto max-h-96 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex flex-col justify-center">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center md:text-left">Status</label>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(issue.status)} uppercase tracking-wide`}>
                {issue.status}
              </span>
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col items-start">
            <label className="block text-sm font-medium text-gray-700 mb-2 w-full text-center">Location</label>
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border w-full">
              <PinnedMap className="w-full" coords={coords} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const IssueDetailPage = () => {
  const params = useParams();
  const issueId = Array.isArray(params.issueId) ? params.issueId[0] : params.issueId;

  if (!issueId) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
        <div className="text-gray-300 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-medium text-gray-900">Invalid Issue ID</h3>
        <p className="text-gray-500">The issue ID provided is not valid.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Loader />}>
      <Container size="full" >
      <IssueDetailContent issueId={issueId} />
      </Container>
    </Suspense>
  );
};

export default IssueDetailPage;
