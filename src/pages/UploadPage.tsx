import { useState } from 'react';
import { CSVUploadModal } from '@/components/CSVUploadModal';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function UploadPage() {
  const [open, setOpen] = useState(false);
  const { warnings, trends } = useData();

  return (
    <div className="p-6 lg:p-8 max-w-[800px]">
      <h1 className="text-xl font-semibold text-foreground mb-1">Upload Data</h1>
      <p className="text-sm text-muted-foreground mb-8">Import trend data via CSV to recalculate opportunity scores</p>

      <div className="bg-card border border-border rounded-md p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">CSV Format</h2>
        <p className="text-sm text-secondary-foreground mb-4">
          Your CSV must include the following columns:
        </p>
        <code className="block text-xs bg-muted/50 p-3 rounded text-muted-foreground mb-4">
          keyword, month1, month2, month3, reddit_mentions, amazon_search
        </code>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => setOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload CSV
        </Button>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>Current dataset: <strong className="text-foreground">{trends.length} trends</strong> loaded</p>
          {warnings.length > 0 && (
            <p className="text-destructive mt-1">{warnings.length} warning(s) from last upload</p>
          )}
        </div>
      </div>

      <CSVUploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
