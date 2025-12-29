import { NextRequest } from "next/server";
import { auth } from "../../lib/firebase-config";

export async function getUserIdFromRequest(request: NextRequest): Promise<{ userId: string | null; email: string | null }> {
  try {
    const userId = request.headers.get("X-User-Id");
    return { userId};
  } catch (error) {
    console.error("Error getting user info from request:", error);
    return { userId: null, email: null };
  }
}

export function getCurrentUserId(): string | null {
  try {
    const user = auth.currentUser;
    return user?.uid || null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}



