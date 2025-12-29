import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/components/helpers/auth-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const issueId = params.id;

    if (!issueId) {
      return NextResponse.json(
        { error: "Issue ID is required" },
        { status: 400 }
      );
    }
    const issueDoc = await db.collection("issues").doc(issueId).get();

    if (!issueDoc.exists) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      );
    }

    const issueData = issueDoc.data();

    if (issueData?.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden. You don't have access to this issue." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        id: issueDoc.id,
        ...issueData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { error: "Failed to fetch issue", details: error.message },
      { status: 500 }
    );
  }
}
