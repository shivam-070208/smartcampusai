"use client";

import {  SidebarBody, SidebarLink, useSidebar } from "../ui/sidebar";
import { useAuth } from "../providers/auth-context";
import Image from "next/image";
import Logo from "./logo";


type SidebarLinkType = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const UserSidebar = ({
  links,
}: {
  links: SidebarLinkType[];
}) => {

  const {user} = useAuth()
  return (
        <SidebarBody className="justify-between gap-10 h-dvh">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                <Logo className="scale-40" />
     
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            {user && (
              <SidebarLink
                link={{
                  label: user.displayName || user.email || "",
                  href: "#",
                  icon: (
                    <Image
                      src={user.photoURL || "/user-placeholder.png"}
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            )}
          </div>
        </SidebarBody>
  );
};

export { UserSidebar };
