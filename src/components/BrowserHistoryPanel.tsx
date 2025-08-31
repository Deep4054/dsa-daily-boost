import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ExternalLink, Clock, Trash2 } from "lucide-react";

interface BrowserHistoryEntry {
  url: string;
  title: string;
  timestamp: string;
  visitDuration?: number;
}

interface BrowserHistoryPanelProps {
  history: BrowserHistoryEntry[];
  onClear: () => void;
  title?: string;
}

export const BrowserHistoryPanel = ({ history, onClear, title = "Study Session History" }: BrowserHistoryPanelProps) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getPageTitle = (entry: BrowserHistoryEntry) => {
    if (entry.title && entry.title !== entry.url) {
      return entry.title;
    }
    return getDomainFromUrl(entry.url);
  };

  const isProductiveUrl = (url: string) => {
    const productiveDomains = ['leetcode.com', 'github.com', 'stackoverflow.com', 'geeksforgeeks.org'];
    return productiveDomains.some(domain => url.includes(domain));
  };

  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-800 text-purple-200">
              {history.length} visits
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No browsing history recorded yet. Start a study session to track your activity.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((entry, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  isProductiveUrl(entry.url)
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white truncate">
                        {getPageTitle(entry)}
                      </h4>
                      {isProductiveUrl(entry.url) && (
                        <Badge variant="secondary" className="bg-green-800 text-green-200 text-xs">
                          Productive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {getDomainFromUrl(entry.url)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{formatTime(entry.timestamp)}</span>
                      {entry.visitDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(entry.visitDuration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(entry.url, '_blank')}
                    className="text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};