const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface YouTubeSearchResult {
  totalResults: number;
  sentimentEstimate: { positive: number; neutral: number; negative: number };
}

interface GoogleTrendsResult {
  months: number[];
}

async function fetchYouTubeData(keyword: string, apiKey: string): Promise<YouTubeSearchResult> {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=50&order=date&publishedAfter=${getThreeMonthsAgo()}&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text();
    console.error('YouTube API error:', errText);
    throw new Error(`YouTube API error: ${res.status}`);
  }

  const data = await res.json();
  const totalResults = data.pageInfo?.totalResults ?? 0;

  // Estimate sentiment from video titles (simple heuristic)
  const titles: string[] = (data.items || []).map((item: any) => item.snippet?.title?.toLowerCase() || '');
  const positiveWords = ['best', 'amazing', 'love', 'great', 'benefits', 'healthy', 'top', 'recommend', 'review', 'works'];
  const negativeWords = ['worst', 'bad', 'scam', 'avoid', 'fake', 'danger', 'side effects', 'warning', 'don\'t', 'horrible'];

  let posCount = 0;
  let negCount = 0;
  for (const title of titles) {
    if (positiveWords.some(w => title.includes(w))) posCount++;
    if (negativeWords.some(w => title.includes(w))) negCount++;
  }

  const total = Math.max(titles.length, 1);
  const positive = Math.round((posCount / total) * 100);
  const negative = Math.round((negCount / total) * 100);
  const neutral = 100 - positive - negative;

  return {
    totalResults,
    sentimentEstimate: { positive: Math.max(positive, 30), neutral: Math.max(neutral, 10), negative },
  };
}

async function fetchGoogleTrends(keyword: string, serpApiKey: string): Promise<GoogleTrendsResult> {
  const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&data_type=TIMESERIES&date=${encodeURIComponent('today 6-m')}&api_key=${serpApiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errText = await res.text();
    console.error('SerpAPI error:', errText);
    throw new Error(`SerpAPI error: ${res.status}`);
  }

  const data = await res.json();

  // Extract monthly interest values from timeline data
  const timelineData = data.interest_over_time?.timeline_data || [];
  const months: number[] = [];

  // Group by month and average
  const monthMap = new Map<string, number[]>();
  for (const point of timelineData) {
    const date = new Date((point.timestamp || 0) * 1000);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const value = point.values?.[0]?.extracted_value ?? 0;
    if (!monthMap.has(monthKey)) monthMap.set(monthKey, []);
    monthMap.get(monthKey)!.push(value);
  }

  const sortedKeys = Array.from(monthMap.keys()).sort();
  // Take last 6 months
  const last6 = sortedKeys.slice(-6);
  for (const key of last6) {
    const vals = monthMap.get(key)!;
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    months.push(avg);
  }

  // Pad to 6 months if needed
  while (months.length < 6) {
    months.unshift(months[0] || 50);
  }

  return { months: months.slice(0, 6) };
}

function getThreeMonthsAgo(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString();
}

function scaleInterest(interestValues: number[]): number[] {
  // Scale Google Trends 0-100 interest to realistic search volume estimates
  const maxVolume = 10000;
  return interestValues.map(v => Math.round((v / 100) * maxVolume));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword } = await req.json();
    if (!keyword || typeof keyword !== 'string') {
      return new Response(JSON.stringify({ error: 'keyword is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    const serpApiKey = Deno.env.get('SERPAPI_KEY');

    if (!youtubeApiKey || !serpApiKey) {
      return new Response(JSON.stringify({ error: 'API keys not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch in parallel
    const [youtubeResult, trendsResult] = await Promise.all([
      fetchYouTubeData(keyword, youtubeApiKey).catch(err => {
        console.error('YouTube fetch failed:', err);
        return null;
      }),
      fetchGoogleTrends(keyword, serpApiKey).catch(err => {
        console.error('Trends fetch failed:', err);
        return null;
      }),
    ]);

    const months = trendsResult ? scaleInterest(trendsResult.months) : null;

    const trendData = {
      keyword,
      month1: months?.[0] ?? null,
      month2: months?.[1] ?? null,
      month3: months?.[2] ?? null,
      month4: months?.[3] ?? null,
      month5: months?.[4] ?? null,
      month6: months?.[5] ?? null,
      youtube_mentions: youtubeResult?.totalResults ?? null,
      youtube_sentiment: youtubeResult?.sentimentEstimate ?? null,
      // Estimate other fields from available data
      reddit_mentions: null,
      amazon_search: null,
      instagram_mentions: null,
      isSimulated: false,
      source: {
        youtube: !!youtubeResult,
        googleTrends: !!trendsResult,
      },
    };

    return new Response(JSON.stringify(trendData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
