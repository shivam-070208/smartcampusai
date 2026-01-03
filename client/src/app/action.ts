"use server"

import { db } from "@/lib/firebase-admin";
import { redirect, unauthorized } from "next/navigation";

export async function checkIsAdmin(token:string|undefined, isRedirect = false) {
    try {
      if (!token) {
        unauthorized();
        return false;
      }

      const adminDoc = await db.collection("admin").where("uid", "==", token).limit(1).get();
      const isAdmin = !adminDoc.empty;
      if (!isAdmin) {
      return  unauthorized();
      
      }
  
      if (isAdmin && isRedirect) {
       redirect("/admin");
      
      }
  
  
    } catch (error) {
      console.error("Error checking admin:", error);
      unauthorized();
    }
  }
  