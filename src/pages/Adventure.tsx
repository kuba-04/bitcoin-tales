import { useState } from 'react';
import { MiningSection } from "@/components/MiningSection";
import { MarysStand } from "@/components/MarysStand";
import { MempoolViewer } from "@/components/MempoolViewer";
import { TransactionViewer } from "@/components/TransactionViewer";
import type { MempoolTransaction } from "@/lib/mining-api";
import { createWallet, createAddress, getWalletBalance, WalletType } from "@/lib/mining-api";
import { Button } from "@/components/ui/button";
import { GuidePopup } from "@/components/GuidePopup";
import { MiningGuidanceAlert } from "@/components/MiningGuidanceAlert";

const Adventure = () => {
  const [balance, setBalance] = useState(0);
  const [maryBalance, setMaryBalance] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [pendingTransaction, setPendingTransaction] = useState<MempoolTransaction | null>(null);
  const [showMempoolViewer, setShowMempoolViewer] = useState(false);
  const [showTransactionViewer, setShowTransactionViewer] = useState(false);
  const [showMiningGuidance, setShowMiningGuidance] = useState(false);
  const [mikeWallet, setMikeWallet] = useState<string | null>(null);
  const [maryWallet, setMaryWallet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ mike: boolean; mary: boolean; mikeAddress: boolean; maryAddress: boolean }>({ 
    mike: false, 
    mary: false,
    mikeAddress: false,
    maryAddress: false
  });
  const [addresses, setAddresses] = useState<{ mike: string; mary: string }>({ mike: "", mary: "" });

  const generateWalletName = (type: WalletType) => {
    const prefix = type === WalletType.MINER ? "miner" : "merchant";
    const uuid = crypto.randomUUID();
    return `${prefix}_${uuid}`;
  };

  const handleCreateAddress = async (type: 'mike' | 'mary') => {
    if (!mikeWallet || !maryWallet) return;
    
    const walletName = type === 'mike' ? mikeWallet : maryWallet;
    const addressName = type === 'mike' ? "Mining Rewards" : "Store Income";
    const loadingKey = type === 'mike' ? 'mikeAddress' : 'maryAddress';
    
    try {
      setIsLoading(prev => ({ ...prev, [loadingKey]: true }));
      const { address } = await createAddress(walletName, addressName);
      console.log("Address created:", address);
      setAddresses(prev => ({ ...prev, [type]: address }));
    } catch (error) {
      console.error(`Failed to create address for ${type}:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleCreateWallet = async (type: WalletType) => {
    try {
      const key = type === WalletType.MINER ? "mike" : "mary";
      setIsLoading(prev => ({ ...prev, [key]: true }));
      
      const walletName = generateWalletName(type);
      const { walletId } = await createWallet(walletName);

      if (type === WalletType.MINER) {
        setMikeWallet(walletId);
        console.log("Mike's wallet created:", walletId);
      } else {
        setMaryWallet(walletId);
        console.log("Mary's wallet created:", walletId);
      }
    } catch (error) {
      console.error(`Failed to create wallet for ${type}:`, error);
    } finally {
      const key = type === WalletType.MINER ? "mike" : "mary";
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  };
  
  const handleBalanceChange = (amount: number) => {
    setBalance(amount);
  };

  const handleEnergyCostChange = (amount: number) => {
    setEnergyCost(prev => prev + amount);
  };

  const handlePurchase = (transaction: MempoolTransaction) => {
    setPendingTransaction(transaction);
    setShowMiningGuidance(true); // Show guidance immediately after purchase
  };

  const handleTransactionConfirmed = async (transaction: MempoolTransaction) => {
    // Update Mike's balance after transaction is confirmed
    setBalance(prev => prev - transaction.amount); // Deduct the spent amount
    setPendingTransaction(null);

    // Refresh Mary's balance after transaction is confirmed
    if (maryWallet) {
      try {
        const newBalance = await getWalletBalance(maryWallet);
        setMaryBalance(newBalance);
      } catch (error) {
        console.error('Failed to refresh Mary\'s balance:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 min-h-screen">
      {/* Guide Popup */}
      <GuidePopup 
        isMikeWalletCreated={mikeWallet !== null}
        isMaryWalletCreated={maryWallet !== null}
        mikeAddress={addresses.mike}
        maryAddress={addresses.mary}
      />
      {/* Header Section - Add margin-top to account for fixed nav */}
      <div className="max-w-3xl mx-auto text-center mb-12" style={{ marginTop: 'calc(3.5rem + 2rem)' }}>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Chapter 3: Exchange of goods
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Join Mike on his journey to mine Bitcoin and make delicious purchases from Mary's stand!
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Side - Mining */}
        <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 pb-4 border-b bg-muted/30">
            <h2 className="text-2xl font-semibold">Mike's Mining Operations Ltd.</h2>
            <img src="../assets/mike_face_c.png" alt="Mike" className="h-30 mb-4 mt-10 mx-auto block" />
            <span className="mt-2 text-sm text-muted-foreground leading-relaxed">
            All that mining activity made Mike incredibly hungry. Fortunately, not far from him a Mary's stand is located.
              Help Mike mine Bitcoin by operating his powerful computers. But be careful - 
              mining consumes energy and success isn't guaranteed!
            </span>
            <div className="mt-4">
              <Button
                onClick={() => handleCreateWallet(WalletType.MINER)}
                disabled={isLoading.mike || mikeWallet !== null}
                className="w-full"
              >
                {isLoading.mike ? "Creating wallet..." : mikeWallet ? "✅ Wallet created!" : "Create Mike's wallet"}
              </Button>
              {mikeWallet && (
                <>
                  <p className="mt-2 text-xs text-muted-foreground break-all">
                    Wallet ID: {mikeWallet}
                  </p>
                  {mikeWallet && maryWallet && (
                    <>
                      <Button
                        onClick={() => handleCreateAddress('mike')}
                        disabled={isLoading.mikeAddress || addresses.mike !== ""}
                        className="w-full mt-2"
                      >
                        {isLoading.mikeAddress 
                          ? "Creating address..." 
                          : addresses.mike 
                            ? "✅ Address created!" 
                            : "Create Mike's address"}
                      </Button>
                      {addresses.mike !== "" && (
                        <p className="mt-2 text-xs text-muted-foreground break-all">
                          Mike's address: {addresses.mike}
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="p-6">
            <MiningSection
              balance={balance}
              energyCost={energyCost}
              onBalanceChange={handleBalanceChange}
              onEnergyCostChange={handleEnergyCostChange}
              mikeAddress={addresses.mike}
              maryAddress={addresses.mary}
              mikeWallet={mikeWallet}
              onViewMempool={() => setShowMempoolViewer(true)}
              onViewTransaction={() => setShowTransactionViewer(true)}
              hasPendingTransaction={pendingTransaction !== null}
            />
          </div>
        </div>

        {/* Right Side - Mary's Stand */}
        <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 pb-4 border-b bg-muted/30">
            <h2 className="text-2xl font-semibold">Mary's Fresh & Local Stand</h2>
            <img src="../assets/mary_face_c.png" alt="Mary" className="h-30 mb-4 mt-10 mx-auto block" />
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Mary offers a variety of healthy and delicious goods.
              Help Mike choose something from her stand.
            </p>
            <div className="mt-4">
              <Button
                onClick={() => handleCreateWallet(WalletType.MERCHANT)}
                disabled={isLoading.mary || maryWallet !== null}
                className="w-full"
              >
                {isLoading.mary ? "Creating wallet..." : maryWallet ? "✅ Wallet created!" : "Create Mary's wallet"}
              </Button>
              {maryWallet && (
                <>
                  <p className="mt-2 text-xs text-muted-foreground break-all">
                    Wallet ID: {maryWallet}
                  </p>
                  {mikeWallet && maryWallet && (
                    <>
                      <Button
                        onClick={() => handleCreateAddress('mary')}
                        disabled={isLoading.maryAddress || addresses.mary !== ""}
                        className="w-full mt-2"
                      >
                        {isLoading.maryAddress 
                          ? "Creating address..." 
                          : addresses.mary 
                            ? "✅ Address created!" 
                            : "Create Mary's address"}
                      </Button>
                      {addresses.mary !== "" && (
                        <p className="mt-2 text-xs text-muted-foreground break-all">
                          Mary's address: {addresses.mary}
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="p-6">
            <MarysStand
              balance={balance}
              mikeWallet={mikeWallet}
              maryWallet={maryWallet}
              maryAddress={addresses.mary}
              onPurchase={handlePurchase}
              onBalanceChange={setMaryBalance}
            />
          </div>
        </div>
      </div>

      {/* Mempool Viewer - Modal */}
      <MempoolViewer
        transaction={showMempoolViewer ? pendingTransaction : null}
        onTransactionConfirmed={handleTransactionConfirmed}
        onClose={() => setShowMempoolViewer(false)}
      />

      {/* Transaction Viewer - Modal */}
      <TransactionViewer
        transaction={showTransactionViewer ? pendingTransaction : null}
        onClose={() => setShowTransactionViewer(false)}
      />

      {/* Mining Guidance Alert */}
      <MiningGuidanceAlert
        open={showMiningGuidance}
        onOpenChange={setShowMiningGuidance}
        onViewMempool={() => setShowMempoolViewer(true)}
      />

      {/* Success Message - Small overlay */}
      {pendingTransaction?.status === 'confirmed' && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-card/80 backdrop-blur border shadow-lg rounded-lg p-6 animate-in slide-in-from-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-green-500">Success!</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You've successfully helped Mike mine Bitcoin and make a purchase from Mary's stand.
            This is how the Bitcoin network works - miners like Mike not only earn rewards but
            also help process and confirm transactions for others!
          </p>
        </div>
      )}
    </div>
  );
};

export default Adventure;