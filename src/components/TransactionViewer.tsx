import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getConfirmedTransaction } from '@/lib/mining-api';
import type { MempoolTransaction } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';

interface TransactionViewerProps {
  walletName: string;
  txid: string | null;
  onClose: () => void;
}

export const TransactionViewer = ({
  txid,
  walletName,
  onClose,
}: TransactionViewerProps) => {
  const [confirmedTx, setConfirmedTx] = useState<MempoolTransaction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!txid) return;

    const fetchConfirmedTransaction = async () => {
      setLoading(true);
      try {
        const txDetails = await getConfirmedTransaction(walletName, txid);
        setConfirmedTx(txDetails);
      } catch (error) {
        console.error('Failed to fetch confirmed transaction:', error);
        toast({
          title: "Error",
          description: "Transaction not found in blockchain. It may not be confirmed yet. Mine 1 more block to confirm it.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedTransaction();
  }, [txid, walletName]);

  if (!txid) return null;

  return (
    <Dialog open={!!txid} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirmed Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading transaction...</div>
            </div>
          ) : confirmedTx ? (
            <Card className="p-4 bg-accent/20">
              <h3 className="font-mono text-sm mb-4">Complete Transaction Data:</h3>
              <div className="bg-slate-50 border rounded-lg p-4 max-h-96 overflow-auto w-full">
                <pre 
                  className="text-xs font-mono" 
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    overflowWrap: 'anywhere',
                    maxWidth: '100%'
                  }}
                >
                  {JSON.stringify(confirmedTx, null, 2)}
                </pre>
              </div>
            </Card>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Transaction not found in blockchain</div>
            </div>
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
