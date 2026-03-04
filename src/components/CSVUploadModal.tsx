import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, AlertTriangle } from 'lucide-react';
import { parseCSV } from '@/lib/scoring';
import { useData } from '@/context/DataContext';

interface CSVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CSVUploadModal({ open, onOpenChange }: CSVUploadModalProps) {
  const { setRawData, setWarnings } = useData();
  const [localWarnings, setLocalWarnings] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { data, warnings } = parseCSV(text);
      if (data.length > 0) {
        setRawData(data);
        setWarnings(warnings);
        setLocalWarnings(warnings);
        if (warnings.length === 0) {
          onOpenChange(false);
        }
      } else {
        setLocalWarnings(warnings.length > 0 ? warnings : ['No valid data found in CSV.']);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Trend Data</DialogTitle>
          <DialogDescription>
            Upload a CSV with columns: keyword, month1, month2, month3, reddit_mentions, amazon_search
          </DialogDescription>
        </DialogHeader>

        <div
          className={`mt-4 border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop CSV file here or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {localWarnings.length > 0 && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Warnings</span>
            </div>
            <ul className="text-xs text-destructive/80 space-y-1">
              {localWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
