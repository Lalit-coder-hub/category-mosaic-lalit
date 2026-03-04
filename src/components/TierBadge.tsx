import { cn } from '@/lib/utils';

interface TierBadgeProps {
  tier: 1 | 2 | 3 | 4;
  label: string;
  className?: string;
}

export function TierBadge({ tier, label, className }: TierBadgeProps) {
  const variants: Record<number, string> = {
    1: 'bg-primary text-primary-foreground',
    2: 'border border-primary text-primary bg-transparent',
    3: 'border border-muted-foreground/40 text-muted-foreground bg-transparent',
    4: 'bg-muted text-muted-foreground',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded',
      variants[tier],
      className
    )}>
      Tier {tier} — {label}
    </span>
  );
}
