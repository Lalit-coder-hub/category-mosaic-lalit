export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface TrendRawData {
  keyword: string;
  month1: number;
  month2: number;
  month3: number;
  reddit_mentions: number;
  amazon_search: number;
  // Extended fields
  youtube_mentions?: number;
  instagram_mentions?: number;
  amazon_product_count?: number;
  avg_price_band?: string;
  category?: string;
  // Sentiment data
  reddit_sentiment?: SentimentBreakdown;
  youtube_sentiment?: SentimentBreakdown;
  instagram_sentiment?: SentimentBreakdown;
  // Extra months for momentum chart
  month4?: number;
  month5?: number;
  month6?: number;
  // Flag for simulated data
  isSimulated?: boolean;
}

export interface TrendScored extends TrendRawData {
  id: string;
  rank: number;
  overallScore: number;
  tier: 1 | 2 | 3 | 4;
  tierLabel: string;
  growthPct: number;
  competitionIntensity: string;
  timeToMainstream: number;
  sentimentPenalty: number;
  scores: {
    searchGrowth: { raw: number; normalized: number; weighted: number };
    socialSignals: { raw: number; normalized: number; weighted: number };
    commercialIntent: { raw: number; normalized: number; weighted: number };
    signalConsistency: { raw: number; normalized: number; weighted: number };
  };
}

export type TierInfo = {
  label: string;
  variant: 'tier1' | 'tier2' | 'tier3' | 'tier4';
};
