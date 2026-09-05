import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-body font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-terracotta text-cream hover:bg-terracotta-dark hover:-translate-y-0.5 shadow-sm",
    outline: "border border-terracotta text-terracotta hover:bg-terracotta hover:text-cream",
    ghost: "text-ink hover:text-terracotta",
  };
  return (
    <Component className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
