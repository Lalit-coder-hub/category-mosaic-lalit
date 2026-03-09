import { SentimentBreakdown } from '@/lib/types';

interface SentimentChartProps {
  label: string;
  sentiment: SentimentBreakdown;
}

export function SentimentChart({ label, sentiment }: SentimentChartProps) {
  return (
    <div className="mb-3">
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <div className="flex h-3 rounded-sm overflow-hidden">
        <div
          className="bg-primary transition-all"
          style={{ width: `${sentiment.positive}%` }}
          title={`Positive: ${sentiment.positive}%`}
        />
        <div
          className="bg-muted-foreground/40 transition-all"
          style={{ width: `${sentiment.neutral}%` }}
          title={`Neutral: ${sentiment.neutral}%`}
        />
        <div
          className="bg-destructive/70 transition-all"
          style={{ width: `${sentiment.negative}%` }}
          title={`Negative: ${sentiment.negative}%`}
        />
      </div>
      <div className="flex gap-4 mt-1 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary inline-block" /> Positive {sentiment.positive}%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-muted-foreground/40 inline-block" /> Neutral {sentiment.neutral}%</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-destructive/70 inline-block" /> Negative {sentiment.negative}%</span>
      </div>
    </div>
  );
}
