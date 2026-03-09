import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { simulateTrendData } from '@/lib/simulate';

export function TrendDiscovery() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const { rawData, setRawData } = useData();

  const handleAnalyze = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    // Check if keyword already exists
    const existingId = trimmed.toLowerCase().replace(/\s+/g, '-');
    const exists = rawData.some(d => d.keyword.toLowerCase().replace(/\s+/g, '-') === existingId);

    if (exists) {
      navigate(`/trend/${existingId}`);
      return;
    }

    // Simulate and add to dataset
    const simulated = simulateTrendData(trimmed);
    setRawData([...rawData, simulated]);
    navigate(`/trend/${existingId}`);
    setKeyword('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  return (
    <div className="bg-card border border-border rounded-md p-5 mb-8">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
        Trend Discovery
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
          />
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 shrink-0"
          onClick={handleAnalyze}
        >
          Analyze Trend
        </Button>
      </div>
    </div>
  );
}
