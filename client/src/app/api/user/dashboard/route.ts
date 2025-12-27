import { NextResponse } from "next/server";

const userDashboardDummyData = {
  summary: {
    critical: 1,
    active: 5,
    rejected: 3,
    resolved: 27,
  },
  recents: [
    {
      title: "Leaky pipe in Block A",
      description: "Water leaking from ceiling near room 104.",
      date: "2025-12-27",
      status: "active",
    },
    {
      title: "Broken AC - Library",
      description: "AC not cooling on 2nd floor.",
      date: "2025-12-26",
      status: "critical",
    },
    {
      title: "Lighting issue - Corridor",
      description: "Flickering lights in corridor 3.",
      date: "2025-12-25",
      status: "resolved",
    },
    {
      title: "Request access card",
      description: "Lost access card request denied.",
      date: "2025-12-24",
      status: "rejected",
    },
    {
      title: "Overflowing trash bins",
      description: "Bins near main cafeteria overflowing.",
      date: "2025-12-23",
      status: "active",
    },
  ],
  chartData: [
    { date: "2025-12-01", active: 1, resolved: 0, critical: 0, rejected: 0 },
    { date: "2025-12-02", active: 2, resolved: 0, critical: 0, rejected: 0 },
    { date: "2025-12-03", active: 2, resolved: 1, critical: 0, rejected: 0 },
    { date: "2025-12-04", active: 3, resolved: 2, critical: 0, rejected: 0 },
    { date: "2025-12-05", active: 3, resolved: 3, critical: 0, rejected: 0 },
    { date: "2025-12-06", active: 4, resolved: 4, critical: 0, rejected: 0 },
    { date: "2025-12-07", active: 4, resolved: 4, critical: 1, rejected: 0 },
    { date: "2025-12-08", active: 5, resolved: 5, critical: 1, rejected: 0 },
    { date: "2025-12-09", active: 5, resolved: 6, critical: 1, rejected: 0 },
    { date: "2025-12-10", active: 6, resolved: 6, critical: 1, rejected: 0 },
    { date: "2025-12-11", active: 7, resolved: 7, critical: 1, rejected: 0 },
    { date: "2025-12-12", active: 8, resolved: 8, critical: 1, rejected: 0 },
    { date: "2025-12-13", active: 8, resolved: 9, critical: 1, rejected: 1 },
    { date: "2025-12-14", active: 8, resolved: 10, critical: 2, rejected: 1 },
    { date: "2025-12-15", active: 8, resolved: 11, critical: 2, rejected: 1 },
    { date: "2025-12-16", active: 9, resolved: 13, critical: 2, rejected: 1 },
    { date: "2025-12-17", active: 7, resolved: 13, critical: 2, rejected: 1 },
    { date: "2025-12-18", active: 7, resolved: 14, critical: 2, rejected: 1 },
    { date: "2025-12-19", active: 8, resolved: 15, critical: 2, rejected: 2 },
    { date: "2025-12-20", active: 9, resolved: 16, critical: 2, rejected: 2 },
    { date: "2025-12-21", active: 9, resolved: 17, critical: 2, rejected: 2 },
    { date: "2025-12-22", active: 10, resolved: 18, critical: 2, rejected: 2 },
    { date: "2025-12-23", active: 10, resolved: 19, critical: 2, rejected: 2 },
    { date: "2025-12-24", active: 10, resolved: 20, critical: 2, rejected: 2 },
    { date: "2025-12-25", active: 9, resolved: 21, critical: 2, rejected: 3 },
    { date: "2025-12-26", active: 8, resolved: 23, critical: 1, rejected: 3 },
    { date: "2025-12-27", active: 7, resolved: 25, critical: 1, rejected: 3 },
    { date: "2025-12-28", active: 6, resolved: 26, critical: 1, rejected: 3 },
    { date: "2025-12-29", active: 5, resolved: 27, critical: 1, rejected: 3 },
    { date: "2025-12-30", active: 5, resolved: 27, critical: 1, rejected: 3 },
    { date: "2025-12-31", active: 5, resolved: 27, critical: 1, rejected: 3 },
  ],
};


export async function GET() {
/*********************************************************************************************************************
 *                                                       TODO:                                                       *
 * USE FIREBASE ADMIN FOR USER ID FETCH AND FROM CORRESPONDING ID FECTH DATA FORM FIRESTIRE AND CONVERT IT IN ABOVE FORMAT *
 *********************************************************************************************************************/
await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(userDashboardDummyData, { status: 200 });
}
