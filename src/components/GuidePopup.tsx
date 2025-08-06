import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GuidePopupProps {
  isMikeWalletCreated: boolean;
  isMaryWalletCreated: boolean;
  mikeAddress: string;
  maryAddress: string;
}

export const GuidePopup = ({ 
  isMikeWalletCreated, 
  isMaryWalletCreated,
  mikeAddress,
  maryAddress
}: GuidePopupProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [lastState, setLastState] = useState({
    mikeWallet: false,
    maryWallet: false,
    mikeAddress: "",
    maryAddress: ""
  });

  // Reopen the popup when both wallets are created or both addresses are generated
  useEffect(() => {
    const bothWalletsJustCreated = 
      isMikeWalletCreated && 
      isMaryWalletCreated && 
      (!lastState.mikeWallet || !lastState.maryWallet);

    const bothAddressesJustCreated =
      mikeAddress !== "" &&
      maryAddress !== "" &&
      (lastState.mikeAddress === "" || lastState.maryAddress === "");
    
    if (bothWalletsJustCreated || bothAddressesJustCreated) {
      setIsOpen(true);
    }
    
    setLastState({
      mikeWallet: isMikeWalletCreated,
      maryWallet: isMaryWalletCreated,
      mikeAddress,
      maryAddress
    });
  }, [isMikeWalletCreated, isMaryWalletCreated, mikeAddress, maryAddress]);
  
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
                  {mikeAddress !== "" && maryAddress !== ""
                    ? "✅ Great! Both addresses have been created."
                    : "Bitcoin wallets can have multiple addresses, let's create some addresses in both Mike and Mary wallets so they can transfer the money."}
                </p>
              </div>
            )}

            {mikeAddress !== "" && maryAddress !== "" && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Step 3: Start Mining</h4>
                <p className="text-sm text-muted-foreground">
                  Mike needs to mine 101 blocks before he can use his mined funds. This is a special rule in Bitcoin - the miner must wait for 101 blocks to be mined before spending newly mined coins.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};