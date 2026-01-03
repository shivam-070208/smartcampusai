import { NextResponse } from "next/server";

import { db } from "@/lib/firebase-admin";



export async function GET() {
  const issuesSnapshot = await db.collection("issues").get();
  const issues = issuesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(issues);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, newStatus } = body;

  const issueRef = db.collection("issues").doc(id);
  const issueDoc = await issueRef.get();

  if (!issueDoc.exists) {
    return NextResponse.json({ message: "Issue not found", success: false }, { status: 404 });
  }

  await issueRef.update({ status: newStatus });

  return NextResponse.json({ message: "Status Updated", success: true });
}