"use client";

import { useEffect, useState, ReactNode } from "react";
import StatCard from "@/components/common/statcard";

interface Issue {
  id: string;
  title: string;
  description: string;
  status: "active" | "resolved" | "rejected" | "pending";
  severity: "Low" | "Medium" | "Critical";
  reportedBy: string;
  date: string;
}

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error("Error loading issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIssues((prev) => prev.map((i) => i.id === id ? { ...i, status: newStatus as any } : i));
    try {
      await fetch("/api/issues", {
        method: "PATCH",
        body: JSON.stringify({ id, newStatus }),
      });
    } catch (error) { console.error("Update failed", error); }
  };

  const processedIssues = issues
    .filter((issue) => {
      if (filter === "all") return true;
      if (filter === "critical") return issue.severity === "Critical" && issue.status !== "resolved";
      if (filter === "active") return issue.status === "active" || issue.status === "pending";
      return issue.status === filter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const stats = {
    total: issues.length,
    active: issues.filter((i) => i.status === "active" || i.status === "pending").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    critical: issues.filter((i) => i.severity === "Critical" && i.status !== "resolved").length,
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Center 🛡️</h1>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Issues" 
          value={stats.total} 
          color="bg-blue-50 text-blue-700 border-blue-200"
          isActive={filter === "all"}
          onClick={() => setFilter("all")}
          // 📂 Folder Icon
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <StatCard 
          label="Pending Action" 
          value={stats.active} 
          color="bg-yellow-50 text-yellow-700 border-yellow-200"
          isActive={filter === "active"}
          onClick={() => setFilter("active")}
          // ⏳ Clock Icon
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          label="Resolved" 
          value={stats.resolved} 
          color="bg-green-50 text-green-700 border-green-200"
          isActive={filter === "resolved"}
          onClick={() => setFilter("resolved")}
          // ✅ Check Icon
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
          label="Critical Needs" 
          value={stats.critical} 
          color="bg-red-50 text-red-700 border-red-200"
          isActive={filter === "critical"}
          onClick={() => setFilter("critical")}
          // 🔥 Flame/Alert Icon
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-500 self-center mr-2">
              Showing: <span className="text-black font-bold capitalize">{filter}</span>
            </span>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="text-sm border border-gray-300 rounded-md p-1.5 outline-none bg-gray-50"
          >
            <option value="newest">📅 Newest First</option>
            <option value="oldest">⏳ Oldest First</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Issue Details</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{issue.title}</div>
                    <div className="text-sm text-gray-500">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${
                      issue.severity === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                      issue.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize 
                      ${issue.status === "resolved" ? "bg-green-100 text-green-800" : 
                        issue.status === "rejected" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {issue.status !== "resolved" && (
                      <button onClick={() => handleStatusUpdate(issue.id, "resolved")} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded">
                        ✓ Resolve
                      </button>
                    )}
                    {issue.status !== "rejected" && issue.status !== "resolved" && (
                      <button onClick={() => handleStatusUpdate(issue.id, "rejected")} className="text-xs border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded">
                        ✕ Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {processedIssues.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    No {filter} issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




