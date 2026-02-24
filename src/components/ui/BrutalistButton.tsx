interface BrutalistButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  target?: string;
  ariaLabel?: string;
}

export default function BrutalistButton({
  href,
  children,
  variant = "solid",
  target,
  ariaLabel,
}: BrutalistButtonProps) {
  const baseClasses =
    "min-w-[44px] min-h-[44px] px-6 py-3 inline-flex items-center justify-center font-display text-xs font-bold tracking-wider hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-border-subtle)] transition-transform";

  const variantClasses =
    variant === "solid"
      ? "bg-accent text-bg"
      : "bg-transparent border-2 border-accent text-accent";

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
    </a>
  );
}
