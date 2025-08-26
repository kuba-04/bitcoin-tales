import { useState, useEffect } from 'react';
import { MENU_ITEMS, createTransaction, getWalletBalance } from '@/lib/mining-api';
import { Button } from '@/components/ui/button';
import { useDisplayStore, satoshisToBTC, formatBTCValue } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import type { MempoolTransaction } from '@/lib/mining-api';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { Input } from '@/components/ui/input';

interface MarysStandProps {
  balance: number;
  mikeWallet: string | null;
  maryWallet: string | null;
  maryAddress: string;
  onPurchase: (transaction: MempoolTransaction) => void;
  onBalanceChange: (balance: number) => void;
  maryBalance?: number;
}

export const MarysStand = ({ balance, mikeWallet, maryWallet, maryAddress, onPurchase, onBalanceChange, maryBalance = 0 }: MarysStandProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const displayInBTC = useDisplayStore((state) => state.displayInBTC);
  const [prices, setPrices] = useState<{ [key: string]: number }>(() => {
    const initialPrices: { [key: string]: number } = {};
    MENU_ITEMS.forEach(item => {
      initialPrices[item.id] = item.price;
    });
    return initialPrices;
  });

  useEffect(() => {
    if (maryWallet) {
      handleRefreshBalance();
    }
  }, [maryWallet]);

  const handleRefreshBalance = async () => {
    if (!maryWallet) return;
    
    setIsRefreshing(true);
    try {
      const newBalance = await getWalletBalance(maryWallet);
      onBalanceChange(newBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      toast({
        title: "Error",
        description: "Failed to refresh Mary's balance",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  const handlePriceChange = (itemId: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price) && price > 0) {
      // If in BTC mode, convert to sats for storage
      const priceInSats = displayInBTC ? Math.floor(price * 100_000_000) : price;
      setPrices(prev => ({
        ...prev,
        [itemId]: priceInSats
      }));
    }
  };

  const handlePurchase = async (itemId: string, price: number, itemName: string) => {
    if (!mikeWallet) {
      toast({
        title: "Wallet Not Ready",
        description: "Please create Mike's wallet first!",
        variant: "destructive",
      });
      return;
    }

    if (!maryAddress) {
      toast({
        title: "Address Not Ready",
        description: "Please create Mary's address first!",
        variant: "destructive",
      });
      return;
    }

    if (balance < price) {
      toast({
        title: "Insufficient Balance",
        description: "You need more BTC to make this purchase. Try mining more!",
        variant: "destructive",
      });
      return;
    }

    try {
      const txid = await createTransaction(mikeWallet, maryAddress, price, itemName);
      // Pass the txid to parent component
      onPurchase({
        txid,
        from_wallet: mikeWallet,
        to_address: maryAddress,
        amount: price,
        message: `buying ${itemName}`,
        status: 'pending'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-3">
      <div className="space-y-3">
        <BalanceDisplay
          balance={maryBalance}
          onRefresh={handleRefreshBalance}
          isRefreshing={isRefreshing}
          showRefresh={false}
        />
        {MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 border rounded bg-accent/5 hover:bg-accent/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <img src={item.image} alt={item.name} className="w-10 h-10" />
              <div className="min-w-0 mr-10">
                <h3 className="text-sm font-medium truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
            </div>
                          <div className="text-right flex flex-col items-end gap-1 ml-2">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={displayInBTC ? "0.00000001" : "1"}
                    step={displayInBTC ? "0.00000001" : "1"}
                    placeholder={displayInBTC ? "0.00000001" : "1"}
                    value={displayInBTC ? formatBTCValue(satoshisToBTC(prices[item.id])) : prices[item.id]}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    className="w-21 h-6 text-xs px-2"
                  />
                  <span className="text-xs font-mono">
                    {displayInBTC ? 'BTC' : 'sats'}
                  </span>
                </div>
                <Button
                  onClick={() => handlePurchase(item.id, prices[item.id], item.name)}
                  disabled={balance < prices[item.id] + 1}
                  size="sm"
                  variant="secondary"
                  className="h-6 text-xs px-2"
                >
                  Buy
                </Button>
              </div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 