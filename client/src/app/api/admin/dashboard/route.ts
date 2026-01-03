import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const { userId: uid } = await getUserIdFromRequest(request);

    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDoc = await db
      .collection("admin")
      .where("uid", "==", uid)
      .limit(1)
      .get();
    const isAdmin = !adminDoc.empty;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Not an admin" },
        { status: 403 }
      );
    }
    const issuesSnapshot = await db.collection("issues").get();
    const issues = issuesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues for admin dashboard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { userId: uid } = await getUserIdFromRequest(request);

  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminDoc = await db
    .collection("admin")
    .where("uid", "==", uid)
    .limit(1)
    .get();
  const isAdmin = !adminDoc.empty;
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Not an admin" },
      { status: 403 }
    );
  }
  const body = await request.json();
  const { id, newStatus } = body;

  const issueRef = db.collection("issues").doc(id);
  const issueDoc = await issueRef.get();

  if (!issueDoc.exists) {
    return NextResponse.json(
      { message: "Issue not found", success: false },
      { status: 404 }
    );
  }

  await issueRef.update({ status: newStatus });

  return NextResponse.json({ message: "Status Updated", success: true });
}
