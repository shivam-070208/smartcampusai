"use client";
import { useState } from "react";
import IssueCard from "@/components/common/issue-card";
import ReportIssueDialog from "@/services/user/issue/component/report-issue-dialog";
import {
  DashboardContainer,
  DashboardContent,
  DashboardHeader,
} from "@/components/common/dashboard-layout";
import { useFetchIssues } from "@/services/user/issue/hooks/use-issue";

type IssueStatus = "active" | "resolved" | "critical" | "rejected";

const UserIssue = () => {
  const [filter, setFilter] = useState<IssueStatus | "all">("all");
  const { data: issues = [] } = useFetchIssues();

  const normalizedIssues = issues.map((issue) => ({
    ...issue,
    status: (issue.status as IssueStatus) || "active", 
    location: issue.location || "",
    date: issue.date || "",
    images: issue.images || [],
  }));

  const filteredIssues = normalizedIssues.filter(
    (issue) => filter === "all" || issue.status === filter
  );

  return (
    <DashboardContainer>
      <DashboardHeader
        title="My Issues"
        description="Track the status of your reported problems."
      />
      <DashboardContent>
        <div className="flex flex-wrap-reverse justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["all", "active", "critical", "resolved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as IssueStatus | "all")}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all border ${
                  filter === status
                    ? "bg-yellow-500 text-yellow-900 border-yellow-500 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}              >
                {status}
              </button>
            ))}
          </div>
          <ReportIssueDialog />
        </div>
        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
              <div className="text-gray-300 text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-gray-900">
                No issues found
              </h3>
              <p className="text-gray-500">
                Try changing the filter or report a new issue.
              </p>
            </div>
          )}
        </div>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default UserIssue;
