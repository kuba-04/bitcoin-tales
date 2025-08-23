import { Button } from '@/components/ui/button';

interface BalanceDisplayProps {
  balance: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  showRefresh?: boolean;
}

export const BalanceDisplay = ({
  balance,
  onRefresh,
  isRefreshing = false,
  showRefresh = false,
}: BalanceDisplayProps) => {
  return (
    <div className="bg-accent/20 p-2 rounded relative">
      {showRefresh && onRefresh && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 absolute top-2 right-2"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <svg
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Button>
      )}
      <div className="text-xs text-muted-foreground">Balance:</div>
      <div className="font-mono font-medium">{balance.toFixed(2)} BTC</div>
    </div>
  );
};
