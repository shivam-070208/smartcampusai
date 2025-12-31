import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getUserIdFromRequest } from "@/lib/auth-utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary-utils";


import {generateSlug } from "random-word-slugs"
import { inngest } from "@/inngest/client";


export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await getUserIdFromRequest(request);
    if (!authUserId) {
      return NextResponse.json(
        { error: "Unauthorized. Please provide a valid authentication token." },
        { status: 401 }
      );
    }
    const formData = await request.formData();
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const location = (formData.get("location") as string) || null;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const rawFiles = formData.getAll("images");
    const files: File[] = rawFiles.filter(
      (f): f is File => typeof File !== "undefined" && f instanceof File
    );

    let imageUrls: string[] = [];
    if (files.length > 0) {
      imageUrls = await Promise.all(files.map(uploadImageToCloudinary));
    }
    const date = new Date().toISOString().split("T")[0];

    const issueData = {
      title: title.trim(),
      description: description.trim(),
      userId: authUserId,
      status: "active",
      date,
      images: imageUrls,
      location: location || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("issues").add(issueData);
    try {
     inngest.send({
      name:"user/issue.created",
      data:{
        issueId:docRef.id
      }
     })

    } catch (queueError) {
      console.error("Failed to enqueue issue for processing:", queueError);
    }

    return NextResponse.json(
      {
        ...issueData,
        id: docRef.id,
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
