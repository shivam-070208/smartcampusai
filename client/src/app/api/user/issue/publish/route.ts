import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/components/helpers/auth-helper";

export async function POST(request: NextRequest) {
  try {

    const { userId : authUserId } = await getUserIdFromRequest(request);
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized. Please provide a valid authentication token." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const {title, description, images, location} = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const issueData = {
      title: title.trim(),
      description: description.trim(),
      userId: authUserId,
      status: "active", 
      date: new Date().toISOString().split("T")[0], 
      images: images || [],
      location: location || null,
      createdAt: new Date().toISOString(), 
    };

    const docRef = await db.collection("issues").add(issueData);

    return NextResponse.json(
      {
        id: docRef.id,
        ...issueData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error publishing issue:", error);
    return NextResponse.json(
      { error: "Failed to publish issue", details: error.message },
      { status: 500 }
    );
  }
}
