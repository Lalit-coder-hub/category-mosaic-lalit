export default function Methodology() {
  return (
    <div className="p-6 lg:p-8 max-w-[800px]">
      <h1 className="text-xl font-semibold text-foreground mb-1">Methodology</h1>
      <p className="text-sm text-muted-foreground mb-8">Scoring model and signal evaluation framework</p>

      <Section title="Weighted Multi-Factor Scoring Model">
        <p>
          Each trend is evaluated using a deterministic weighted scoring model across four dimensions.
          Raw values are normalized (0–100) relative to the dataset, then multiplied by their respective weights
          to produce a composite opportunity score.
        </p>
        <div className="mt-4 space-y-3">
          <Factor name="Growth Velocity" weight="35%" description="Three-month search volume trajectory. Measures the rate of consumer interest acceleration. Higher weight reflects the primacy of demand-side signals in early category formation." />
          <Factor name="Cross-Platform Social Validation" weight="25%" description="Aggregate of Reddit community mentions and YouTube content creation. Validates whether search interest is accompanied by organic community discussion and content creation — a leading indicator of sustained relevance." />
          <Factor name="Commercial Intent Proxy" weight="20%" description="Amazon search index as a proxy for purchase-intent behavior. Distinguishes between awareness-stage curiosity and conversion-ready demand." />
          <Factor name="Signal Consistency & Momentum" weight="20%" description="Month-over-month growth consistency. Penalizes volatile spikes and rewards steady directional momentum. Designed to filter out short-term viral artifacts from genuine emerging trends." />
        </div>
      </Section>

      <Section title="Normalization">
        <p>
          All raw metrics are min-max normalized within the current dataset to a 0–100 scale.
          This ensures cross-factor comparability regardless of absolute magnitude differences between metrics
          (e.g., search volume in thousands vs. Reddit mentions in hundreds).
        </p>
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          normalized = ((value - min) / (max - min)) × 100
        </p>
      </Section>

      <Section title="Tier Classification">
        <div className="space-y-2">
          <TierRow tier="Tier 1" range="> 75" label="Immediate Build Signal" />
          <TierRow tier="Tier 2" range="60–75" label="Emerging Opportunity" />
          <TierRow tier="Tier 3" range="45–59" label="Monitor" />
          <TierRow tier="Tier 4" range="< 45" label="Low Priority" />
        </div>
      </Section>

      <Section title="Spike vs. Sustained Trend Detection">
        <p>
          The Signal Consistency factor specifically addresses the challenge of distinguishing
          short-term viral spikes from sustainable emerging trends. By measuring month-over-month
          growth consistency rather than absolute growth, the model penalizes trends that show
          a single explosive month followed by plateau or decline. A trend with steady 15–20%
          monthly growth will score higher on consistency than one with 0% followed by 200%.
        </p>
      </Section>

      <Section title="Limitations">
        <ul className="space-y-1.5 text-sm text-secondary-foreground">
          <li className="flex gap-2"><span className="text-primary">·</span>Scores are relative to the uploaded dataset. Adding or removing trends will shift all normalized values.</li>
          <li className="flex gap-2"><span className="text-primary">·</span>The model does not incorporate qualitative factors such as regulatory barriers, brand equity, or supply chain complexity.</li>
          <li className="flex gap-2"><span className="text-primary">·</span>Three-month trailing data provides a limited window. Longer time series would improve confidence.</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 bg-card border border-border rounded-md p-5">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">{title}</h2>
      <div className="text-sm text-secondary-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function Factor({ name, weight, description }: { name: string; weight: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">{weight}</span>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function TierRow({ tier, range, label }: { tier: string; range: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="font-medium text-foreground w-14">{tier}</span>
      <span className="font-mono text-xs text-muted-foreground w-16">{range}</span>
      <span className="text-secondary-foreground">{label}</span>
    </div>
  );
}
