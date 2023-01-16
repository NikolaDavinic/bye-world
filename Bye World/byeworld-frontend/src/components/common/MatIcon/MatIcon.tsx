import { Icon } from "@mui/material";
import React from "react";
import vars from "./mat.module.css";

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
  variant?: "contained" | "outlined";
}

const MatIcon = ({
  children,
  style,
  className,
  color = "inherit",
  variant = "outlined",
}: MatIconsProps) => {
  return (
    <Icon
      className={`material-symbols-outlined ${className} ${
        variant === "contained" ? vars.contained : vars.outlined
      }`}
      style={style}
      color={color}
    >
      {children}
    </Icon>
  );
};

export default MatIcon;
