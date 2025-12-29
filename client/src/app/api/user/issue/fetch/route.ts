import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/components/helpers/auth-helper";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please provide a valid authentication token." },
        { status: 401 }
      );
    }

    try {
      const issuesSnapshot = await db
        .collection("issues")
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .get();

      const issues = issuesSnapshot.docs.map(
        (doc: { id: string; data: () => Record<string, unknown> }) => ({
          id: doc.id,
          ...doc.data(),
        })
      );
      return NextResponse.json(issues, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch user issues", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
