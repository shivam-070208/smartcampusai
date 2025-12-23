// "use client";

// import { auth } from "@/lib/firebase-config";


// const page = ()=>{
//     return(
//       <div>
//         Create Other page in dashboard for use
//         <button onClick={async ()=>{
//         await  auth.signOut()
//         }}>
//           SignOut</button>
//       </div>
//     )
// }

// export default page;

"use client";

import { auth } from "@/lib/firebase-config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Hardcoded Data for the frontend demo
  const hardcodedIssues = [
    {
      id: 1,
      category: "Infrastructure",
      description: "Water cooler on 2nd floor leaking badly.",
      status: "In Progress",
      severity: "Medium",
      date: "2 hours ago",
    },
    {
      id: 2,
      category: "Safety",
      description: "Street light near the library entrance is broken.",
      status: "Open",
      severity: "Critical",
      date: "5 hours ago",
    },
    {
      id: 3,
      category: "Cleanliness",
      description: "Overflowing dustbins in the cafeteria.",
      status: "Resolved",
      severity: "Low",
      date: "1 day ago",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Fake loading delay
    setTimeout(() => {
      alert("Issue Reported Successfully! (Frontend Demo)");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">SMARTCAMPUS AI</h1>
          <p className="text-sm text-gray-500">Student Dashboard</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50"
        >
          Sign Out
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT SIDE: Report Issue Form */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            📝 Report New Issue
          </h2>

          <form onSubmit={handleFakeSubmit} className="space-y-5">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category
              </label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Infrastructure (Broken items, leaks)</option>
                <option>Cleanliness (Garbage, washrooms)</option>
                <option>Safety (Hazards, lighting)</option>
                <option>Energy (Wastage)</option>
              </select>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe the Issue
              </label>
              <textarea
                rows={4}
                placeholder="Explain what is wrong..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Image Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Photo (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? "Analyzing..." : "🚀 Submit Report"}
            </button>
          </form>
        </section>

        {/* RIGHT SIDE: Hardcoded Issue List */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            📊 Your Reports
          </h2>

          <div className="space-y-4">
            {hardcodedIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{issue.category}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      issue.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : issue.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-200 pt-2">
                  <span>{issue.date}</span>
                  <span className="font-medium text-gray-500">
                    Severity: {issue.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;