import { ReactNode } from "react";

interface IssueLayoutProps {
  children: ReactNode;
}

export default function IssueLayout({ children }: IssueLayoutProps) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
