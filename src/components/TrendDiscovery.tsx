import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { simulateTrendData } from '@/lib/simulate';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrendRawData } from '@/lib/types';

export function TrendDiscovery() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { rawData, setRawData } = useData();

  const handleAnalyze = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const existingId = trimmed.toLowerCase().replace(/\s+/g, '-');
    const exists = rawData.some(d => d.keyword.toLowerCase().replace(/\s+/g, '-') === existingId);

    if (exists) {
      navigate(`/trend/${existingId}`);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-trend', {
        body: { keyword: trimmed },
      });

      if (error) throw error;

      if (data && !data.error) {
        // Merge real data with simulated fallbacks for missing fields
        const simulated = simulateTrendData(trimmed);
        const merged: TrendRawData = {
          keyword: trimmed,
          month1: data.month1 ?? simulated.month1,
          month2: data.month2 ?? simulated.month2,
          month3: data.month3 ?? simulated.month3,
          month4: data.month4 ?? simulated.month4,
          month5: data.month5 ?? simulated.month5,
          month6: data.month6 ?? simulated.month6,
          reddit_mentions: data.reddit_mentions ?? simulated.reddit_mentions,
          amazon_search: data.amazon_search ?? simulated.amazon_search,
          youtube_mentions: data.youtube_mentions ?? simulated.youtube_mentions,
          instagram_mentions: data.instagram_mentions ?? simulated.instagram_mentions,
          youtube_sentiment: data.youtube_sentiment ?? simulated.youtube_sentiment,
          reddit_sentiment: simulated.reddit_sentiment,
          instagram_sentiment: simulated.instagram_sentiment,
          amazon_product_count: simulated.amazon_product_count,
          avg_price_band: simulated.avg_price_band,
          category: simulated.category,
          isSimulated: false,
        };

        setRawData([...rawData, merged]);

        const sources = [];
        if (data.source?.youtube) sources.push('YouTube');
        if (data.source?.googleTrends) sources.push('Google Trends');
        toast.success(`Real-time data loaded from ${sources.join(' & ') || 'APIs'}`);
      } else {
        // Fallback to simulation
        const simulated = simulateTrendData(trimmed);
        setRawData([...rawData, simulated]);
        toast.info('Using simulated data (API unavailable)');
      }

      navigate(`/trend/${existingId}`);
      setKeyword('');
    } catch (err) {
      console.error('Analyze trend error:', err);
      // Fallback to simulation
      const simulated = simulateTrendData(trimmed);
      setRawData([...rawData, simulated]);
      toast.info('Using simulated data (API unavailable)');
      navigate(`/trend/${existingId}`);
      setKeyword('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <div className="bg-card border border-border rounded-md p-5 mb-8">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
        Trend Discovery — Live Data
      </h2>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Enter a wellness keyword to scan for emerging signals (e.g., sea moss, collagen peptides, mushroom coffee)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 shrink-0"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze Trend'
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Powered by YouTube Data API & Google Trends via SerpAPI
      </p>
    </div>
  );
}
