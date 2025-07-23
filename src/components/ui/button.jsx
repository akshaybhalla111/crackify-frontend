// src/components/ui/button.jsx
import { cn } from "../../lib/utils";

export function Button({ className = "", variant = "default", size = "md", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-900",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-base"
  };

  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
