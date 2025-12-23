import React, { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  "data-testid"?: string;
};


const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  as: Component = "div",
  style,
  "data-testid": dataTestId,
}) => {
  return (
    <Component
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
      style={style}
      data-testid={dataTestId}
    >
      {children}
    </Component>
  );
};

export default Container;
