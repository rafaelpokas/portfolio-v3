interface SectionBadgeProps {
  children: React.ReactNode;
}

export default function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <div className="inline-block border border-accent text-accent px-3 py-1 text-xs tracking-widest uppercase -skew-x-12 mb-6">
      <span className="block skew-x-12 font-semibold">{children}</span>
    </div>
  );
}
