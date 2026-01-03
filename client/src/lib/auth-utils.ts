import { unauthorized } from "next/navigation";
import { NextRequest } from "next/server";

export async function getUserIdFromRequest(request: NextRequest): Promise<{ userId: string | null; email: string | null }> {
  try {
    const authHeader = request.headers.get("X-User-Id");
  
    const token = authHeader;
    if(!token) unauthorized();
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


