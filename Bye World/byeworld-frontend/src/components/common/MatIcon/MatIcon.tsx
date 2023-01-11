import { Icon } from "@mui/material";
import React from "react";

interface MatIconsProps {
  children: string;
  style?: React.CSSProperties;
  className?: string;
  color?:
    | "inherit"
    | "disabled"
    | "action"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | undefined;
}

const MatIcon = ({
  children,
  style,
  className,
  color = "inherit",
}: MatIconsProps) => {
  return (
    <Icon
      className={`material-symbols-outlined ${className}`}
      style={style}
      color={color}
    >
      {children}
    </Icon>
  );
};

export default MatIcon;
