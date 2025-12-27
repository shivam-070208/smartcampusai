import { AppHeader } from "@/components/common/app-header";
import Container from "@/components/common/container";
import { UserSidebar } from "@/components/common/user-sidebar";
import { AuthProvider } from "@/components/providers/auth-context";
import { Sidebar } from "@/components/ui/sidebar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider require={true}>
      <Sidebar>
        <Container className="flex-1 flex p-0!" size="full">
          <UserSidebar />
          <Container className="flex-1 p-0! flex flex-col min-h-dvh" size="full">
            <AppHeader />
            {children}
            </Container>
        </Container>
      </Sidebar>
    </AuthProvider>
  );
}
