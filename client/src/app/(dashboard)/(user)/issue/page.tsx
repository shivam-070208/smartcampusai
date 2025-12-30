
 "use client";

import React from 'react'
import { useState } from "react";
import Link from "next/link";
import IssueCard from "../../../../components/common/issue-card";
import ReportIssueDialog from '@/components/common/ReportIssueDialog';




type IssueStatus = "active" | "resolved" | "critical" | "rejected";

interface Issue {
  id: string;
  title: string;
  description: string;
  date: string;
  status: IssueStatus;
  location: string;
  images: string[];
}


const User_issues:Issue[] = [
    {
        id: "101",
    title: "Leaky pipe in Block A",
    description: "Water leaking from ceiling near room 104. It's creating a slippery puddle.",
    date: "2023-12-27",
    status: "active",
    location: "Block A, 2nd Floor",
    images: ["https://images.unsplash.com/photo-1584627147104-f6d902e8e9dc?auto=format&fit=crop&q=80&w=200"],
    },
    {
    id: "102",
    title: "Broken AC - Library",
    description: "AC not cooling on 2nd floor reading hall. It is very hot.",
    date: "2023-12-26",
    status: "critical",
    location: "Central Library",
    images: [], // No image example
  },
  {
    id: "103",
    title: "Lighting issue - Corridor",
    description: "Flickering lights in corridor 3 causing headache.",
    date: "2023-12-25",
    status: "resolved",
    location: "Main Building, Ground Floor",
    images: ["https://images.unsplash.com/photo-1565691081604-0c84c48972e3?auto=format&fit=crop&q=80&w=200"],
  },
  {
    id: "104",
    title: "Request access card",
    description: "Lost access card request denied without reason.",
    date: "2023-12-24",
    status: "rejected",
    location: "Admin Office",
    images: [],
  }
]

const issue = () => {
    const [filter, setFilter] = useState<IssueStatus | "all">("all");

  
  const filteredIssues = User_issues.filter(
    (issue) => filter === "all" || issue.status === filter
  );
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
            <p className="text-gray-500 mt-1">Track the status of your reported problems.</p>
          </div>
          
     
        </div>
        <div><ReportIssueDialog/></div>

        <div className="flex flex-wrap gap-2">
          {["all", "active", "critical", "resolved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as IssueStatus | "all")}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all border ${
                filter === status
                  ? "bg-yellow-500 text-yellow-1000 border-yellow-500 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* LIST Section */}
        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))
          ) : (
            // Empty State
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
              <div className="text-gray-300 text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-gray-900">No issues found</h3>
              <p className="text-gray-500">Try changing the filter or report a new issue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  
  )
}

export default issue
