import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendScored } from '@/lib/types';

interface ScoreBarProps {
  trend: TrendScored;
}

export function ScoreBar({ trend }: ScoreBarProps) {
  const { scores, overallScore } = trend;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${overallScore}%` }}
            />
          </div>
          <span className="text-xs font-medium text-foreground w-8 text-right">{overallScore}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs space-y-1 p-3 max-w-[220px]">
        <p className="font-medium mb-1.5">Score Breakdown</p>
        <div className="flex justify-between"><span>Search Growth (35%)</span><span>{scores.searchGrowth.weighted}</span></div>
        <div className="flex justify-between"><span>Social Signals (25%)</span><span>{scores.socialSignals.weighted}</span></div>
        <div className="flex justify-between"><span>Commercial Intent (20%)</span><span>{scores.commercialIntent.weighted}</span></div>
        <div className="flex justify-between"><span>Signal Consistency (20%)</span><span>{scores.signalConsistency.weighted}</span></div>
        <div className="border-t border-border pt-1 mt-1 flex justify-between font-medium">
          <span>Overall</span><span>{overallScore}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
