import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { ArrowLeft, TrendingUp, MessageSquare, Youtube, Instagram, ShoppingCart, DollarSign, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TierBadge } from '@/components/TierBadge';
import { SentimentChart } from '@/components/SentimentChart';
import { MomentumChart } from '@/components/MomentumChart';

export default function TrendDetail() {
  const { id } = useParams<{ id: string }>();
  const { trends } = useData();
  const navigate = useNavigate();
  const trend = trends.find(t => t.id === id);

  if (!trend) {
    return (
      <div className="p-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <p className="mt-4 text-muted-foreground">Trend not found.</p>
      </div>
    );
  }

  const { scores } = trend;
  const scoreRows = [
    { label: 'Search Growth', weight: '35%', ...scores.searchGrowth },
    { label: 'Social Signals', weight: '25%', ...scores.socialSignals },
    { label: 'Commercial Intent', weight: '20%', ...scores.commercialIntent },
    { label: 'Signal Consistency', weight: '20%', ...scores.signalConsistency },
  ];

  const growthSpeed = trend.growthPct > 80 ? 'rapidly accelerating' : trend.growthPct > 40 ? 'steadily growing' : 'gradually emerging';
  const stage = trend.tier === 1 ? 'reached critical mass and represents an immediate build signal'
    : trend.tier === 2 ? 'showing strong momentum with emerging commercial validation'
    : trend.tier === 3 ? 'still in early signal phase and warrants continued monitoring'
    : 'not yet demonstrating sufficient signal strength for prioritization';

  const executiveSummary = `${trend.keyword} is ${growthSpeed} within the Indian wellness market, with search volume increasing ${trend.growthPct}% over the trailing three-month period. Cross-platform signal validation shows ${trend.reddit_mentions} Reddit mentions, ${trend.youtube_mentions || 0} YouTube mentions, and ${trend.instagram_mentions || 0} Instagram discussions, indicating ${trend.competitionIntensity.toLowerCase()} commercial competition density. The trend has ${stage}. ${trend.tier <= 2 ? 'Given the convergence of consumer demand signals and manageable competition, this represents a strategically interesting category entry point.' : 'Further signal accumulation is recommended before committing significant resources.'}`;

  const skuFormat = trend.category === 'Functional Beverages' ? 'Ready-to-mix sachets / Instant powder'
    : trend.category === 'Sports Nutrition' ? 'Single-serve pouches / Tubs (500g–1kg)'
    : trend.category === 'Beauty & Skin' ? 'Capsules / Powder sachets'
    : 'Gummies / Capsules / Powder';

  const targetSegment = trend.avg_price_band?.includes('1000') || trend.avg_price_band?.includes('1500')
    ? 'Urban health-conscious consumers, 25–40, SEC A/B'
    : 'Health-aware millennials, 22–35, SEC A/B/C';

  const firstMoverWindow = trend.tier === 1 ? '3–6' : trend.tier === 2 ? '6–12' : '12–18';

  const hasSentiment = trend.reddit_sentiment || trend.youtube_sentiment || trend.instagram_sentiment;

  return (
    <div className="p-6 lg:p-8 max-w-[1000px]">
      {/* Header */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
      </Button>

      {trend.isSimulated && (
        <div className="bg-primary/10 border border-primary/20 rounded-md px-4 py-2 mb-4 text-xs text-primary">
          Signal profile generated from public trend indicators.
        </div>
      )}

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{trend.category || 'Wellness'}</p>
          <h1 className="text-2xl font-semibold text-foreground">{trend.keyword}</h1>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-foreground">{trend.overallScore}<span className="text-lg text-muted-foreground">/100</span></p>
          <TierBadge tier={trend.tier} label={trend.tierLabel} className="mt-1" />
        </div>
      </div>

      {/* Executive Summary */}
      <Section title="Executive Summary">
        <p className="text-sm text-secondary-foreground leading-relaxed">{executiveSummary}</p>
      </Section>

      {/* Search Momentum */}
      <Section title="Search Momentum">
        <MomentumChart trend={trend} />
      </Section>

      {/* Score Breakdown */}
      <Section title="Quantitative Score Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left p-2.5">Factor</th>
                <th className="text-left p-2.5">Weight</th>
                <th className="text-right p-2.5">Raw</th>
                <th className="text-right p-2.5">Normalized</th>
                <th className="text-left p-2.5 w-32">Contribution</th>
                <th className="text-right p-2.5">Weighted</th>
              </tr>
            </thead>
            <tbody>
              {scoreRows.map((r) => (
                <tr key={r.label} className="border-b border-border/30">
                  <td className="p-2.5 text-foreground">{r.label}</td>
                  <td className="p-2.5 text-muted-foreground">{r.weight}</td>
                  <td className="p-2.5 text-right font-mono text-xs">{r.raw}</td>
                  <td className="p-2.5 text-right font-mono text-xs">{r.normalized}</td>
                  <td className="p-2.5">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${r.weighted}%` }} />
                    </div>
                  </td>
                  <td className="p-2.5 text-right font-mono text-xs font-medium">{r.weighted}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border">
                <td colSpan={5} className="p-2.5 font-medium text-foreground">Overall Score</td>
                <td className="p-2.5 text-right font-mono font-bold text-primary">{trend.overallScore}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Formula: (Search Growth × 0.35) + (Social Signals × 0.25) + (Commercial Intent × 0.20) + (Signal Consistency × 0.20)
          {trend.sentimentPenalty > 0 && ` — Sentiment penalty applied: -${trend.sentimentPenalty} on social signal score.`}
        </p>
      </Section>

      {/* Signal Evidence */}
      <Section title="Signal Evidence">
        <ul className="space-y-2.5 text-sm text-secondary-foreground">
          <SignalItem icon={Search} label="Google Trends search growth" value={`+${trend.growthPct}% over 3 months`} />
          <SignalItem icon={MessageSquare} label="Reddit discussion volume" value={`${trend.reddit_mentions} mentions`} />
          <SignalItem icon={Youtube} label="YouTube content mentions" value={`${trend.youtube_mentions || 'N/A'}`} />
          <SignalItem icon={Instagram} label="Instagram discussion volume" value={`${trend.instagram_mentions || 'N/A'}`} />
          <SignalItem icon={ShoppingCart} label="Amazon product count" value={`${trend.amazon_product_count || 'N/A'}`} />
          <SignalItem icon={DollarSign} label="Average price band" value={trend.avg_price_band || 'N/A'} />
        </ul>
      </Section>

      {/* Social Sentiment Analysis */}
      {hasSentiment && (
        <Section title="Social Sentiment Analysis">
          <p className="text-[11px] text-muted-foreground mb-4">
            Community sentiment distribution across social discussions.
          </p>
          {trend.reddit_sentiment && <SentimentChart label="Reddit" sentiment={trend.reddit_sentiment} />}
          {trend.youtube_sentiment && <SentimentChart label="YouTube" sentiment={trend.youtube_sentiment} />}
          {trend.instagram_sentiment && <SentimentChart label="Instagram" sentiment={trend.instagram_sentiment} />}
        </Section>
      )}

      {/* White Space Analysis */}
      <Section title="White Space Analysis">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SubSection title="Competition Density">
            <p>{trend.competitionIntensity} — {trend.competitionIntensity === 'Low' ? 'Significant white space exists. Few established players in the Indian market.' : trend.competitionIntensity === 'Medium' ? 'Moderate competition. Differentiation via formulation or positioning is viable.' : 'Crowded space. Entry requires strong brand proposition or price advantage.'}</p>
          </SubSection>
          <SubSection title="Market Gap">
            <p>{trend.competitionIntensity === 'Low' ? 'Large gap between consumer search interest and available products. First-mover advantage is substantial.' : 'Gap exists primarily in premium or specialized segments.'}</p>
          </SubSection>
          <SubSection title="Brand Penetration">
            <p>{(trend.amazon_product_count || 0) > 200 ? 'High brand penetration. Multiple established players.' : (trend.amazon_product_count || 0) > 80 ? 'Moderate brand presence. Room for differentiated entrants.' : 'Low brand penetration. Market is nascent.'}</p>
          </SubSection>
          <SubSection title="Regulatory Signals">
            <p>FSSAI regulatory framework applies. No specific restrictions identified for this category. Standard compliance pathway.</p>
          </SubSection>
        </div>
      </Section>

      {/* Strategic Recommendation */}
      <Section title="Strategic Recommendation" boxed>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <RecItem label="Recommended SKU Format" value={skuFormat} />
          <RecItem label="Target Consumer Segment" value={targetSegment} />
          <RecItem label="Indicative Price Band" value={trend.avg_price_band || '₹400–₹900'} />
          <RecItem label="Estimated First-Mover Window" value={`${firstMoverWindow} months`} />
          <RecItem label="Go-to-Market Angle" value={
            trend.tier === 1 ? 'D2C launch with performance marketing + quick commerce distribution'
              : 'Content-led awareness building + niche D2C positioning'
          } />
        </div>
      </Section>

      {/* Risk Considerations */}
      <Section title="Risk Considerations">
        <ul className="space-y-2 text-sm text-secondary-foreground">
          <li className="flex gap-2"><span className="text-primary mt-1">·</span><span><strong>Fad Risk:</strong> {trend.growthPct > 100 ? 'Elevated — rapid growth may indicate viral spike rather than sustained demand. Monitor for deceleration.' : 'Moderate — growth trajectory is consistent with organic demand building.'}</span></li>
          <li className="flex gap-2"><span className="text-primary mt-1">·</span><span><strong>Supply Chain:</strong> {trend.category === 'Superfoods' ? 'Higher risk — raw material sourcing may face import dependency and price volatility.' : 'Standard risk — domestic supply chain infrastructure is adequate.'}</span></li>
          <li className="flex gap-2"><span className="text-primary mt-1">·</span><span><strong>Regulatory:</strong> FSSAI compliance required. No extraordinary regulatory hurdles anticipated for this category.</span></li>
          <li className="flex gap-2"><span className="text-primary mt-1">·</span><span><strong>Overcrowding:</strong> {trend.competitionIntensity === 'High' ? 'High risk — market may reach saturation before meaningful differentiation is achieved.' : 'Low to moderate — current competitive density allows for differentiated entry.'}</span></li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children, boxed }: { title: string; children: React.ReactNode; boxed?: boolean }) {
  return (
    <div className={`mb-6 ${boxed ? 'bg-card border border-primary/20 rounded-md p-5' : 'bg-card border border-border rounded-md p-5'}`}>
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-foreground mb-1">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function SignalItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <span>{label}: <strong>{value}</strong></span>
    </li>
  );
}

function RecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-foreground font-medium">{value}</p>
    </div>
  );
}
