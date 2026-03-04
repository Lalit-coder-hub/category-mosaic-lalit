import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Upload, TrendingUp, Target, BarChart3, Zap } from 'lucide-react';
import { TierBadge } from '@/components/TierBadge';
import { ScoreBar } from '@/components/ScoreBar';
import { CSVUploadModal } from '@/components/CSVUploadModal';

export default function Dashboard() {
  const { trends } = useData();
  const navigate = useNavigate();
  const [uploadOpen, setUploadOpen] = useState(false);

  const tier1Count = trends.filter(t => t.tier === 1).length;
  const avgScore = trends.length > 0 ? Math.round(trends.reduce((s, t) => s + t.overallScore, 0) / trends.length) : 0;
  const highestGrowth = trends.length > 0 ? trends.reduce((a, b) => a.growthPct > b.growthPct ? a : b) : null;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Mosaic Category Intelligence Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Early Signal Detection & Opportunity Prioritization Engine for Wellness Trends in India
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary/10 shrink-0"
          onClick={() => setUploadOpen(true)}
        >
          <Upload className="h-3.5 w-3.5 mr-2" />
          Upload CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={BarChart3} label="Trends Analyzed" value={trends.length.toString()} />
        <SummaryCard icon={Zap} label="Tier 1 Signals" value={tier1Count.toString()} />
        <SummaryCard icon={Target} label="Avg Opportunity Score" value={`${avgScore}/100`} />
        <SummaryCard
          icon={TrendingUp}
          label="Highest Growth Signal"
          value={highestGrowth ? highestGrowth.keyword : '—'}
          sub={highestGrowth ? `+${highestGrowth.growthPct}%` : undefined}
        />
      </div>

      {/* Ranked Opportunity Table */}
      <div className="bg-card rounded-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left p-3 pl-4 w-12">#</th>
                <th className="text-left p-3">Trend Name</th>
                <th className="text-left p-3 w-48">Overall Score</th>
                <th className="text-left p-3">Tier</th>
                <th className="text-right p-3">Growth</th>
                <th className="text-left p-3">Competition</th>
                <th className="text-right p-3 pr-4">TTM (mo)</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors"
                  onClick={() => navigate(`/trend/${t.id}`)}
                >
                  <td className="p-3 pl-4 text-muted-foreground font-mono text-xs">{t.rank}</td>
                  <td className="p-3 font-medium text-foreground">{t.keyword}</td>
                  <td className="p-3"><ScoreBar trend={t} /></td>
                  <td className="p-3"><TierBadge tier={t.tier} label={t.tierLabel} /></td>
                  <td className="p-3 text-right font-mono text-xs">
                    <span className={t.growthPct > 0 ? 'text-primary' : 'text-muted-foreground'}>
                      {t.growthPct > 0 ? '+' : ''}{t.growthPct}%
                    </span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{t.competitionIntensity}</td>
                  <td className="p-3 pr-4 text-right font-mono text-xs text-muted-foreground">{t.timeToMainstream}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CSVUploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string; sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {sub && <p className="text-xs text-primary mt-0.5">{sub}</p>}
    </div>
  );
}
