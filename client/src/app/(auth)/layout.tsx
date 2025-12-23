import { AuthProvider } from "@/components/providers/auth-context";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
