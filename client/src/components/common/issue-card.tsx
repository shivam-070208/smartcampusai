"use client";
import { motion } from "motion/react";
type IssueStatus = "active" | "resolved" | "critical" | "rejected";

interface Issue {
  id: string;
  title: string;
  issueKey?: string; 
   description: string;
  date: string;
  status: IssueStatus;
  location: string;
  images: string[];
}

const IssueCard = ({ issue }: { issue: Issue }) => {
    const getStatusStyle = (status: IssueStatus) => {
    switch (status) {
      case "active": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "rejected": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-blue-100 text-blue-800";
    }
  };    
  return (
    <motion.div layoutId={`issueCard-${issue.id}`} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
      
      <div className="w-full md:w-32 h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
        {issue.images.length > 0 ? (
          <img 
            src={issue.images[0]} 
            alt={issue.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="flex-1 w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(issue.status)} uppercase tracking-wide`}>
                {issue.status}
              </span>
            </div>
            {/* Location with Icon */}
            <div className="flex items-center text-sm text-blue-600 font-medium gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {issue.location}
            </div>
          </div>

          {/* Date */}
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {new Date(issue.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {issue.description}
        </p>
        <div className="flex gap-3 border-t border-gray-100 pt-3 mt-auto">
          <button className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            View Details 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default IssueCard
