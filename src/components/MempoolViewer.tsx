import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { checkMempoolTransaction, getConfirmedTransaction } from '@/lib/mining-api';
import type { MempoolTransaction } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';

interface MempoolViewerProps {
  transaction: MempoolTransaction | null;
  onTransactionConfirmed: (transaction: MempoolTransaction) => void;
  onClose: () => void;
}

export const MempoolViewer = ({
  transaction,
  onTransactionConfirmed,
  onClose,
}: MempoolViewerProps) => {
  const [isPolling, setIsPolling] = useState(false);
  const [mempoolTx, setMempoolTx] = useState<MempoolTransaction | null>(null);
  const [confirmedTx, setConfirmedTx] = useState<MempoolTransaction | null>(null);
  const [showConfirmedDetails, setShowConfirmedDetails] = useState(false);

  // Fetch mempool transaction status
  const checkMempoolStatus = async (txid: string) => {
    try {
      const mempoolData = await checkMempoolTransaction(txid);
      
      if (mempoolData === null) {
        // Transaction not in mempool, check if it's confirmed
        try {
          const confirmedData = await getConfirmedTransaction(txid);
          setMempoolTx(confirmedData);
          if (transaction?.status !== 'confirmed') {
            onTransactionConfirmed(confirmedData);
            toast({
              title: "Transaction Confirmed! 🎉",
              description: "Your purchase has been added to the blockchain.",
            });
          }
          setIsPolling(false);
        } catch (error) {
          console.error('Failed to get confirmed transaction:', error);
          toast({
            title: "Transaction Status Unknown",
            description: "Transaction is not in mempool but couldn't verify confirmation.",
            variant: "destructive",
          });
        }
      } else {
        setMempoolTx(mempoolData);
        if (mempoolData.status === 'confirmed' && transaction?.status !== 'confirmed') {
          onTransactionConfirmed(mempoolData);
          toast({
            title: "Transaction Confirmed! 🎉",
            description: "Your purchase has been added to the blockchain.",
          });
          setIsPolling(false);
        }
      }
    } catch (error) {
      console.error('Failed to check mempool status:', error);
      toast({
        title: "Error",
        description: "Failed to check transaction status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkMempoolStatus = async () => {
      if (!transaction?.txid) return;

      try {
        const mempoolData = await checkMempoolTransaction(transaction.txid);
        
        if (mempoolData === null) {
          // Transaction not in mempool, check if it's confirmed
          try {
            const confirmedData = await getConfirmedTransaction(transaction.txid);
            setMempoolTx(confirmedData);
            if (transaction?.status !== 'confirmed') {
              onTransactionConfirmed(confirmedData);
              toast({
                title: "Transaction Confirmed! 🎉",
                description: "Your purchase has been added to the blockchain.",
              });
            }
            setIsPolling(false);
          } catch (error) {
            console.error('Failed to get confirmed transaction:', error);
            toast({
              title: "Transaction Status Unknown",
              description: "Transaction is not in mempool but couldn't verify confirmation.",
              variant: "destructive",
            });
          }
        } else {
          setMempoolTx(mempoolData);
          if (mempoolData.status === 'confirmed' && transaction?.status !== 'confirmed') {
            onTransactionConfirmed(mempoolData);
            toast({
              title: "Transaction Confirmed! 🎉",
              description: "Your purchase has been added to the blockchain.",
            });
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error('Failed to check mempool status:', error);
        toast({
          title: "Error",
          description: "Failed to check transaction status.",
          variant: "destructive",
        });
      }
    };

    // Check status immediately when transaction changes
    if (transaction?.txid) {
      checkMempoolStatus();
    }

    // Set up polling if transaction is pending
    if (transaction?.status === 'pending' && !isPolling) {
      setIsPolling(true);
      intervalId = setInterval(checkMempoolStatus, 2000); // Poll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transaction, isPolling]);

  if (!transaction) return null;

  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transaction in Mempool</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card className="p-4 bg-accent/20">
            <h3 className="font-mono text-sm mb-4">Transaction ID: {transaction.txid}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From Wallet:</span>
                <span className="font-mono">{mempoolTx?.from_wallet || transaction.from_wallet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To Address:</span>
                <span className="font-mono">{mempoolTx?.to_address || transaction.to_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-mono">{mempoolTx?.amount || transaction.amount} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Message:</span>
                <span className="font-mono">{mempoolTx?.message || transaction.message}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-mono uppercase ${
                  (mempoolTx?.status || transaction.status) === 'confirmed' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {mempoolTx?.status || transaction.status}
                </span>
              </div>
            </div>
          </Card>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {transaction.status === 'pending' ? 'Waiting for confirmation...' : 'Transaction confirmed!'}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 