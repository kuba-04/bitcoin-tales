import { MENU_ITEMS, createTransaction } from '@/lib/mining-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import type { Transaction } from '@/lib/mining-api';

interface MarysStandProps {
  balance: number;
  onPurchase: (transaction: Transaction) => void;
}

export const MarysStand = ({ balance, onPurchase }: MarysStandProps) => {
  const handlePurchase = async (itemId: string, price: number) => {
    if (balance < price + 1) { // +1 for network fee
      toast({
        title: "Insufficient Balance",
        description: "You need more BTC to make this purchase. Try mining more!",
        variant: "destructive",
      });
      return;
    }

    try {
      const transaction = await createTransaction(balance, itemId);
      onPurchase(transaction);
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
              <div className="text-xs font-mono">{item.price} BTC</div>
              <Button
                onClick={() => handlePurchase(item.id, item.price)}
                disabled={balance < item.price + 1}
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