import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
  icon: ReactNode; // New Prop
}
function StatCard({ label, value, color, isActive, onClick, icon }: StatCardProps) {
  return (
    <button 
      onClick={onClick}
      className={`p-5 rounded-xl border shadow-sm text-left transition-all duration-200 transform hover:scale-105 active:scale-95 flex justify-between items-center
      ${isActive ? `ring-2 ring-offset-2 ring-blue-500 ${color}` : "bg-white border-gray-100 hover:border-blue-300"}`}
    >
      <div>
        <div className={`text-2xl font-bold ${isActive ? "" : "text-gray-800"}`}>{value}</div>
        <div className={`text-sm font-medium ${isActive ? "" : "text-gray-500"}`}>{label}</div>
      </div>
      
      {/* Icon Container */}
      <div className={`p-3 rounded-full bg-white bg-opacity-30 ${isActive ? 'text-current' : 'text-gray-400 bg-gray-50'}`}>
        {icon}
      </div>
    </button>
  );
}

export default StatCard;


