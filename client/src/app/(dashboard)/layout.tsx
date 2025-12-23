import { AuthProvider } from "@/components/providers/auth-context";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
 return <AuthProvider require={true}>{children}</AuthProvider>;
}
