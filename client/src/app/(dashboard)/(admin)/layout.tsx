import { AppHeader } from "@/components/common/app-header";
import Container from "@/components/common/container";
import { UserSidebar } from "@/components/common/user-sidebar";
import { AuthProvider } from "@/components/providers/auth-context";
import { Sidebar } from "@/components/ui/sidebar";
import React from "react";
import {
  IconBrandTabler,
} from "@tabler/icons-react";
export default function layout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Dashboard",
      href: "/admin/",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  
  ];
  return (
    <AuthProvider require={true}>
      <Sidebar>
        <Container className="flex-1 flex p-0!" size="full">
          <UserSidebar links={links} />
          <Container className="flex-1 p-0! flex flex-col min-h-dvh" size="full">
            <AppHeader />
            {children}
            </Container>
        </Container>
      </Sidebar>
    </AuthProvider>
  );
}
