
// /components/ui/badge.tsx
import React, { MouseEventHandler } from "react";

interface BadgeProps {
  variant?: "default" | "secondary";
  className?: string;
  children: React.ReactNode;
  onClick: MouseEventHandler;
}

export const Badge = ({
  variant = "default",
  className = "",
  onClick,
  children,
}: BadgeProps) => {
  const variants = {
    default: "bg-purple-100 text-purple-800",
    secondary: "bg-gray-100 text-gray-800"
  };

  return (
    <span onClick={onClick}
      className={`inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};