import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { checkMempoolTransaction } from '@/lib/mining-api';
import type { MempoolTransaction } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';

interface MempoolViewerProps {
  walletName: string;
  txid: string | null;
  onClose: () => void;
}

export const MempoolViewer = ({
  txid,
  walletName,
  onClose,
}: MempoolViewerProps) => {
  const [mempoolTx, setMempoolTx] = useState<MempoolTransaction | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch mempool transaction when txid changes
  useEffect(() => {
    if (!txid) return;

    const fetchMempoolTransaction = async () => {
      setLoading(true);
      try {
        const mempoolData = await checkMempoolTransaction(walletName, txid);
        setMempoolTx(mempoolData);
      } catch (error) {
        console.error('Failed to fetch mempool transaction:', error);
        toast({
          title: "Error",
          description: "Failed to fetch transaction from mempool.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMempoolTransaction();
  }, [txid, walletName]);

  if (!txid) return null;

  return (
    <Dialog open={!!txid} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Transaction in Mempool</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading transaction...</div>
            </div>
          ) : mempoolTx ? (
            <Card className="p-4 bg-accent/20">
              <h3 className="font-mono text-sm mb-4">Complete Mempool Data:</h3>
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
                  {JSON.stringify(mempoolTx, null, 2)}
                </pre>
              </div>
            </Card>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Transaction not found in mempool</div>
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