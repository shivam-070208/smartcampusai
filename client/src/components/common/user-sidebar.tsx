"use client";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import {  SidebarBody, SidebarLink, useSidebar } from "../ui/sidebar";
import { useAuth } from "../providers/auth-context";
import Image from "next/image";


const UserSidebar = () => {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Issue",
      href: "/issue",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    }
  ];
  const {open} = useSidebar();
  const {user} = useAuth()
  return (
        <SidebarBody className="justify-between gap-10 h-dvh">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? "SmartCampusAi" : "s"}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
          {user &&  <SidebarLink
              link={{
                label: user.displayName||"",
                href: "#",
                icon: (
                  <Image
                    src={user.photoURL||"/user-placeholder.png"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />}
          </div>
        </SidebarBody>
  );
};

export { UserSidebar };
