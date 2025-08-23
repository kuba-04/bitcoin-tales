import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getConfirmedTransaction } from '@/lib/mining-api';
import type { MempoolTransaction } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';

interface TransactionViewerProps {
  transaction: MempoolTransaction | null;
  onClose: () => void;
}

export const TransactionViewer = ({
  transaction,
  onClose,
}: TransactionViewerProps) => {
  const [confirmedTx, setConfirmedTx] = useState<MempoolTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConfirmedTransaction = async () => {
      if (!transaction?.txid) return;

      console.log('TransactionViewer: Fetching confirmed transaction for txid:', transaction.txid);
      setIsLoading(true);
      try {
        const txDetails = await getConfirmedTransaction(transaction.txid);
        console.log('TransactionViewer: Got confirmed transaction data:', txDetails);
        setConfirmedTx(txDetails);
        toast({
          title: "Transaction Found",
          description: "Successfully loaded confirmed transaction details",
        });
      } catch (error) {
        console.error('TransactionViewer: Failed to fetch confirmed transaction:', error);
        toast({
          title: "Not Found",
          description: "Transaction not found in blockchain - it may not be confirmed yet",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (transaction?.txid) {
      fetchConfirmedTransaction();
    }
  }, [transaction]);

  if (!transaction) return null;

  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirmed Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {isLoading ? (
            <Card className="p-4 bg-accent/20">
              <div className="text-center">Loading transaction details...</div>
            </Card>
          ) : confirmedTx ? (
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="space-y-6">
                {/* Transaction ID Header */}
                <div className="border-b border-green-200 pb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Transaction ID:</h3>
                  <p className="font-mono text-sm break-all bg-white/50 p-3 rounded border">
                    {confirmedTx.txid}
                  </p>
                </div>

                {/* Block Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Block Height</span>
                    <div className="text-lg font-bold text-green-700">
                      #{(confirmedTx as any).blockheight}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Confirmations</span>
                    <div className="text-lg font-bold text-green-700">
                      {(confirmedTx as any).confirmations}
                    </div>
                  </div>
                </div>

                {/* Block Hash */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Block Hash</span>
                  <p className="font-mono text-xs break-all bg-white/50 p-3 rounded border text-slate-600">
                    {(confirmedTx as any).blockhash}
                  </p>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">Address</span>
                  <p className="font-mono text-xs break-all bg-white/50 p-3 rounded border text-slate-600">
                    {(confirmedTx as any).address}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Amount</span>
                    <div className="text-xl font-bold text-orange-600">
                      {Math.abs((confirmedTx as any).amount)} BTC
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Fee</span>
                    <div className="text-lg font-semibold text-slate-600">
                      {Math.abs((confirmedTx as any).fee || 0)} BTC
                    </div>
                  </div>
                </div>

                {/* Category and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Category</span>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                      {(confirmedTx as any).category}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ CONFIRMED
                    </div>
                  </div>
                </div>

                {/* Block Time */}
                <div className="space-y-1 pt-2 border-t border-green-200">
                  <span className="text-sm font-medium text-muted-foreground">Block Time</span>
                  <div className="text-sm font-medium text-slate-700">
                    {new Date((confirmedTx as any).blocktime * 1000).toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 bg-red-500/10">
              <div className="text-center text-red-500">
                Transaction not found in blockchain
              </div>
            </Card>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
