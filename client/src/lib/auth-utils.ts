import { NextRequest } from "next/server";
import { auth } from "./firebase-config";

export async function getUserIdFromRequest(request: NextRequest): Promise<{ userId: string | null; email: string | null }> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { userId: null, email: null };
    }
    
    const token = authHeader.substring(7);
    const admin = await import("firebase-admin");
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    return { 
      userId: decodedToken.uid,
      email: decodedToken.email || null
    };
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



