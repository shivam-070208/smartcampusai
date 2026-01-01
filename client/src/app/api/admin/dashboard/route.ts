import { NextResponse } from "next/server";

// Mock data (for checking purpose)
let issuesDB = [
  {
    id: "101",
    title: "Leaky pipe in Block A",
    description: "Water leaking near room 104.",
    status: "active",
    reportedBy: "student1@college.edu",
    date: "2023-12-27",
  },
  {
    id: "102",
    title: "Broken Projector",
    description: "Projector in Lab 3 is not turning on.",
    status: "pending",
    reportedBy: "student2@college.edu",
    date: "2023-12-28",
  },
];

export async function GET() {
  return NextResponse.json(issuesDB);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, newStatus } = body;

  const issueIndex = issuesDB.findIndex((issue) => issue.id === id);
  if (issueIndex > -1) {
    issuesDB[issueIndex].status = newStatus;
  }

  return NextResponse.json({ message: "Status Updated", success: true });
}