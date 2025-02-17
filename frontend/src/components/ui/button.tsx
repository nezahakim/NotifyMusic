// /components/ui/button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "icon" | 'sm';
  className?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-purple-600 text-white hover:bg-purple-700",
      ghost: "hover:bg-gray-100 text-gray-700",
      outline: "border border-gray-300 hover:bg-gray-100 text-gray-700"
    };
    
    const sizes = {
      default: "h-10 px-4 py-2 rounded-lg",
      icon: "h-10 w-10 rounded-full",
      sm:"sm"
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
