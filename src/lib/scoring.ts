import { TrendRawData, TrendScored } from './types';

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.round(((value - min) / (max - min)) * 100);
}

function calcGrowthPct(m1: number, m3: number): number {
  if (m1 === 0) return m3 > 0 ? 100 : 0;
  return Math.round(((m3 - m1) / m1) * 100);
}

function getTier(score: number): { tier: 1 | 2 | 3 | 4; label: string } {
  if (score > 75) return { tier: 1, label: 'Immediate Build Signal' };
  if (score >= 60) return { tier: 2, label: 'Emerging Opportunity' };
  if (score >= 45) return { tier: 3, label: 'Monitor' };
  return { tier: 4, label: 'Low Priority' };
}

function getCompetition(amazonSearch: number, maxAmazon: number): string {
  const ratio = maxAmazon === 0 ? 0 : amazonSearch / maxAmazon;
  if (ratio > 0.7) return 'High';
  if (ratio > 0.4) return 'Medium';
  return 'Low';
}

function getTimeToMainstream(growthPct: number, score: number): number {
  if (score > 75 && growthPct > 50) return Math.round(6 + Math.random() * 6);
  if (score > 60) return Math.round(12 + Math.random() * 6);
  if (score > 45) return Math.round(18 + Math.random() * 6);
  return Math.round(24 + Math.random() * 12);
}

/** Calculate sentiment penalty: if avg negative > 40%, apply up to 15% reduction on social score */
function calcSentimentPenalty(d: TrendRawData): number {
  const sentiments = [d.reddit_sentiment, d.youtube_sentiment, d.instagram_sentiment].filter(Boolean);
  if (sentiments.length === 0) return 0;
  const avgNegative = sentiments.reduce((sum, s) => sum + s!.negative, 0) / sentiments.length;
  if (avgNegative > 40) return Math.min(15, Math.round((avgNegative - 40) * 0.5));
  return 0;
}

export function scoreTrends(rawData: TrendRawData[]): TrendScored[] {
  if (rawData.length === 0) return [];

  const metrics = rawData.map(d => {
    const growthPct = calcGrowthPct(d.month1, d.month3);
    const searchGrowthRaw = growthPct;
    const socialRaw = d.reddit_mentions + (d.youtube_mentions || 0) + (d.instagram_mentions || 0);
    const commercialRaw = d.amazon_search;
    const m1m2Growth = d.month1 === 0 ? (d.month2 > 0 ? 100 : 0) : ((d.month2 - d.month1) / d.month1) * 100;
    const m2m3Growth = d.month2 === 0 ? (d.month3 > 0 ? 100 : 0) : ((d.month3 - d.month2) / d.month2) * 100;
    const consistencyRaw = m1m2Growth > 0 && m2m3Growth > 0
      ? Math.min(100, (m1m2Growth + m2m3Growth) / 2)
      : Math.max(0, (m1m2Growth + m2m3Growth) / 2);

    return { searchGrowthRaw, socialRaw, commercialRaw, consistencyRaw, growthPct };
  });

  const minMax = (arr: number[]) => ({ min: Math.min(...arr), max: Math.max(...arr) });
  const searchMM = minMax(metrics.map(m => m.searchGrowthRaw));
  const socialMM = minMax(metrics.map(m => m.socialRaw));
  const commercialMM = minMax(metrics.map(m => m.commercialRaw));
  const consistencyMM = minMax(metrics.map(m => m.consistencyRaw));
  const maxAmazon = Math.max(...rawData.map(d => d.amazon_search));

  const scored: TrendScored[] = rawData.map((d, i) => {
    const m = metrics[i];
    const searchNorm = normalize(m.searchGrowthRaw, searchMM.min, searchMM.max);
    const socialNorm = normalize(m.socialRaw, socialMM.min, socialMM.max);
    const commercialNorm = normalize(m.commercialRaw, commercialMM.min, commercialMM.max);
    const consistencyNorm = normalize(m.consistencyRaw, consistencyMM.min, consistencyMM.max);

    const sentimentPenalty = calcSentimentPenalty(d);

    const searchWeighted = Math.round(searchNorm * 0.35);
    const socialWeighted = Math.max(0, Math.round(socialNorm * 0.25) - sentimentPenalty);
    const commercialWeighted = Math.round(commercialNorm * 0.20);
    const consistencyWeighted = Math.round(consistencyNorm * 0.20);

    const overallScore = Math.min(100, searchWeighted + socialWeighted + commercialWeighted + consistencyWeighted);
    const { tier, label } = getTier(overallScore);

    return {
      ...d,
      id: d.keyword.toLowerCase().replace(/\s+/g, '-'),
      rank: 0,
      overallScore,
      tier,
      tierLabel: label,
      growthPct: m.growthPct,
      competitionIntensity: getCompetition(d.amazon_search, maxAmazon),
      timeToMainstream: getTimeToMainstream(m.growthPct, overallScore),
      sentimentPenalty,
      scores: {
        searchGrowth: { raw: m.searchGrowthRaw, normalized: searchNorm, weighted: searchWeighted },
        socialSignals: { raw: m.socialRaw, normalized: socialNorm, weighted: socialWeighted },
        commercialIntent: { raw: m.commercialRaw, normalized: commercialNorm, weighted: commercialWeighted },
        signalConsistency: { raw: Math.round(m.consistencyRaw), normalized: consistencyNorm, weighted: consistencyWeighted },
      },
    };
  });

  scored.sort((a, b) => b.overallScore - a.overallScore);
  scored.forEach((s, i) => { s.rank = i + 1; });

  return scored;
}

export function scoreOneTrend(raw: TrendRawData): TrendScored {
  return scoreTrends([raw])[0];
}

export function parseCSV(csvText: string): { data: TrendRawData[]; warnings: string[] } {
  const warnings: string[] = [];
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { data: [], warnings: ['CSV must have a header row and at least one data row.'] };

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const required = ['keyword', 'month1', 'month2', 'month3', 'reddit_mentions', 'amazon_search'];
  const missing = required.filter(r => !header.includes(r));
  if (missing.length > 0) {
    return { data: [], warnings: [`Missing required columns: ${missing.join(', ')}`] };
  }

  const data: TrendRawData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < header.length) {
      warnings.push(`Row ${i + 1}: insufficient columns, skipped.`);
      continue;
    }
    const row: Record<string, string> = {};
    header.forEach((h, j) => { row[h] = values[j]; });

    const numVal = (key: string) => {
      const v = parseFloat(row[key]);
      if (isNaN(v)) {
        warnings.push(`Row ${i + 1}: "${key}" is not a valid number, defaulting to 0.`);
        return 0;
      }
      return v;
    };

    data.push({
      keyword: row['keyword'] || `Unknown Trend ${i}`,
      month1: numVal('month1'),
      month2: numVal('month2'),
      month3: numVal('month3'),
      reddit_mentions: numVal('reddit_mentions'),
      amazon_search: numVal('amazon_search'),
    });
  }

  return { data, warnings };
}
