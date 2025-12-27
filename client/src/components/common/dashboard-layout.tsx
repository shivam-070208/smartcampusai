import {
  IconCircleX,
  IconBan,
  IconBolt,
  IconCircleCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Container from "./container";
import type { ContainerProps } from "./container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Heading } from "../ui/heading";
import { SubHeading } from "../ui/sub-heading";

const DashboardContainer = ({
  className = "",
  size = "full",
  padding = "medium",
  ...props
}: Readonly<ContainerProps>) => {
  return (
    <Container
      padding={padding}
      size={size}
      className={cn("flex-1 flex-col ", className)}
      {...props}
    />
  );
};
interface DashboardHeaderProps extends ContainerProps {
  title: string;
  description: string;
}
const DashboardHeader = ({
  className = "",
  title,
  description,
  children,
  size = "full",
  padding = "small",
  ...props
}: Readonly<DashboardHeaderProps>) => {
  return (
    <Container
      className={cn("flex flex-col  gap-4")}
      padding={padding}
      size={size}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <Heading as={"h3"}>{title}</Heading>
        <SubHeading size="sm" className="font-semibold" as="p">
          {description}
        </SubHeading>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </Container>
  );
};

interface DashboardHeaderCardProps {
  status: "critical" | "resolved" | "rejected" | "active";
  title: string;
  description?: string;
  data: string | number;
}
const statusColorMap: Record<DashboardHeaderCardProps["status"], string> = {
  critical: "text-destructive",
  resolved: "text-success",
  rejected: "text-warning",
  active: "text-primary",
};

const statusIconMap: Record<
  DashboardHeaderCardProps["status"],
  React.ReactNode
> = {
  critical: (
    <IconCircleX className="h-6 w-6 text-destructive" aria-label="Critical" />
  ),
  resolved: (
    <IconCircleCheck className="h-6 w-6 text-success" aria-label="Resolved" />
  ),
  rejected: <IconBan className="h-6 w-6 text-warning" aria-label="Rejected" />,
  active: <IconBolt className="h-6 w-6 text-primary" aria-label="Active" />,
};

const DashboardHeaderCard = ({
  status,
  title,
  description,
  data,
}: Readonly<DashboardHeaderCardProps>) => {
  const dataColorClass = statusColorMap[status] ?? "";
  const icon = statusIconMap[status];
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <Heading className={cn(dataColorClass, "text-4xl")} as="h1" size="2xl">
          {data}
        </Heading>
        {icon}
      </CardContent>
    </Card>
  );
};

const DashboardContent = ({
  className = "",
  size = "full",
  padding = "small",
  ...props
}: Readonly<ContainerProps>) => {
  return (
    <Container
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[400px]", className)}
      size={size}
      padding={padding}
      {...props}
    />
  );
};

export {
  DashboardContainer,
  DashboardHeader,
  DashboardHeaderCard,
  DashboardContent,
};
