import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Bitcoin, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDisplayStore } from '@/lib/utils';
import { Switch } from './switch';
import { storage } from '@/lib/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const pages = ['/', '/mining', '/merchant', '/exchange', '/treasure'];
const pageNames = ['Introduction', 'Mining', 'Merchant', 'Exchange', 'Treasure'];

export function TimelineNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPageIndex = pages.indexOf(location.pathname);
  const { displayInBTC, toggleDisplay } = useDisplayStore();

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      navigate(pages[currentPageIndex + 1]);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      navigate(pages[currentPageIndex - 1]);
    }
  };

  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-sm border-b">
      <div className="container h-full mx-auto px-4">
        <div className="flex items-center justify-between gap-2 h-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPageIndex === 0}
            className="shrink-0 h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative max-w-md mx-auto">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              {pageNames.map((name, index) => (
                <button
                  key={name}
                  onClick={() => navigate(pages[index])}
                  className={cn(
                    "text-[10px] transition-colors px-1 py-0.5",
                    index === currentPageIndex
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <Bitcoin className="h-4 w-4" />
              <Switch
                checked={displayInBTC}
                onCheckedChange={toggleDisplay}
                className="data-[state=checked]:bg-orange-500"
              />
              <span className="text-xs font-medium">
                {displayInBTC ? 'BTC' : 'sats'}
              </span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 h-8 px-2 flex items-center gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs">Reset</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all your data including wallets, addresses, balances, and transaction history.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    storage.clearAll();
                    window.location.reload();
                  }}>
                    Reset Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              className="shrink-0 h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 