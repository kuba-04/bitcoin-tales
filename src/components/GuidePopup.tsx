import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GuidePopupProps {
  isMikeWalletCreated: boolean;
  isMaryWalletCreated: boolean;
}

export const GuidePopup = ({ 
  isMikeWalletCreated, 
  isMaryWalletCreated 
}: GuidePopupProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [lastWalletState, setLastWalletState] = useState({ mike: false, mary: false });

  // Reopen the popup when both wallets are created
  useEffect(() => {
    const bothWalletsJustCreated = 
      isMikeWalletCreated && 
      isMaryWalletCreated && 
      (!lastWalletState.mike || !lastWalletState.mary);
    
    if (bothWalletsJustCreated) {
      setIsOpen(true);
    }
    
    setLastWalletState({ mike: isMikeWalletCreated, mary: isMaryWalletCreated });
  }, [isMikeWalletCreated, isMaryWalletCreated]);
  
  return (
    <>
      {/* Help button - always visible */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg z-50 text-primary hover:text-primary/80 border-primary/20"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-2xl font-semibold">?</span>
      </Button>

      {/* Guide Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Let's practice the basics!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-2">Step 1: Create Wallets for Mike and Mary</h4>
              <p className="text-sm text-muted-foreground">
                {isMikeWalletCreated && isMaryWalletCreated
                  ? "✅ Great! Both wallets have been created."
                  : "Click the 'Create Mike's wallet' button to generate a new Bitcoin wallet. Then do the same for Mary"}
              </p>
            </div>

            {isMikeWalletCreated && isMaryWalletCreated && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Step 2: Create Wallet Addresses</h4>
                <p className="text-sm text-muted-foreground">
                  Bitcoin wallets can have multiple addresses, let's create some addresses in both Mike and Mary wallets so they can transfer the money.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};