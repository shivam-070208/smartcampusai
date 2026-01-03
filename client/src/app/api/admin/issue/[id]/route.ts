import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { db } from "@/lib/firebase-admin";


export async function GET(request: NextRequest,   { params }: { params: Promise<{ id: string }> }) {
  const { userId: uid } = await getUserIdFromRequest(request);

  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(uid)
  const adminDoc = await db.collection("admin").where("uid", "==", uid).limit(1).get();
  const isAdmin = !adminDoc.empty;
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Not an admin" }, { status: 403 });
  }

  const { id: issueId } = await params;
  if (!issueId) {
    return NextResponse.json({ error: "Missing issue ID" }, { status: 400 });
  }
  const issueDoc = await db.collection("issues").doc(issueId).get();
  if (!issueDoc.exists) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
  const issueData = issueDoc.data();
  return NextResponse.json({ id: issueDoc.id, ...issueData });
}
