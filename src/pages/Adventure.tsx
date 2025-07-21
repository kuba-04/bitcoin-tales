import { useState } from 'react';
import { MiningSection } from "@/components/MiningSection";
import { MarysStand } from "@/components/MarysStand";
import { MempoolViewer } from "@/components/MempoolViewer";
import type { Transaction } from "@/lib/mining-api";

const Adventure = () => {
  const [balance, setBalance] = useState(0);
  const [energyCost, setEnergyCost] = useState(0);
  const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null);
  
  const handleBalanceChange = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const handleEnergyCostChange = (amount: number) => {
    setEnergyCost(prev => prev + amount);
  };

  const handlePurchase = (transaction: Transaction) => {
    setPendingTransaction(transaction);
  };

  const handleTransactionConfirmed = (transaction: Transaction) => {
    // Update balance after transaction is confirmed
    setBalance(transaction.change);
    setPendingTransaction(null);
  };

  return (
    <div className="container mx-auto px-4 min-h-screen">
      {/* Header Section - Add margin-top to account for fixed nav */}
      <div className="max-w-3xl mx-auto text-center mb-12" style={{ marginTop: 'calc(3.5rem + 2rem)' }}>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Mike's High-Stakes Mining Adventure
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
            <h2 className="text-2xl font-semibold">The Mining Operation</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Help Mike mine Bitcoin by operating his powerful computers. But be careful - 
              mining consumes energy and success isn't guaranteed!
            </p>
          </div>
          <div className="p-6">
            <MiningSection
              balance={balance}
              energyCost={energyCost}
              onBalanceChange={handleBalanceChange}
              onEnergyCostChange={handleEnergyCostChange}
            />
          </div>
        </div>

        {/* Right Side - Mary's Stand */}
        <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 pb-4 border-b bg-muted/30">
            <h2 className="text-2xl font-semibold">Mary's Fresh & Local Stand</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              After all that mining, it's time for a delicious treat! Visit Mary's stand to 
              spend your hard-earned Bitcoin.
            </p>
          </div>
          <div className="p-6">
            <MarysStand
              balance={balance}
              onPurchase={handlePurchase}
            />
          </div>
        </div>
      </div>

      {/* Mempool Viewer - Modal */}
      <MempoolViewer
        transaction={pendingTransaction}
        onTransactionConfirmed={handleTransactionConfirmed}
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