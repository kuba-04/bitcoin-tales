import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { confirmTransaction } from '@/lib/mining-api';
import type { Transaction } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';

interface MempoolViewerProps {
  transaction: Transaction | null;
  onTransactionConfirmed: (transaction: Transaction) => void;
}

export const MempoolViewer = ({
  transaction,
  onTransactionConfirmed,
}: MempoolViewerProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmation = async () => {
    if (!transaction) return;

    setIsConfirming(true);
    try {
      const confirmedTransaction = await confirmTransaction(transaction);
      onTransactionConfirmed(confirmedTransaction);
      toast({
        title: "Transaction Confirmed! 🎉",
        description: "Your purchase has been added to the blockchain.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm transaction.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={!!transaction}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transaction in Mempool</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card className="p-4 bg-accent/20">
            <h3 className="font-mono text-sm mb-4">Transaction ID: {transaction.id}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From:</span>
                <span className="font-mono">{transaction.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span className="font-mono">{transaction.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-mono">{transaction.amount} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Fee:</span>
                <span className="font-mono">{transaction.fee} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Change:</span>
                <span className="font-mono">{transaction.change} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-mono uppercase text-yellow-500">
                  {transaction.status}
                </span>
              </div>
            </div>
          </Card>
          <div className="flex justify-end">
            <Button
              onClick={handleConfirmation}
              disabled={isConfirming}
            >
              {isConfirming ? "Confirming..." : "Confirm Transaction"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 