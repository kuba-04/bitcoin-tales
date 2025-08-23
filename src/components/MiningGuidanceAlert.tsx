import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MiningGuidanceAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewMempool: () => void;
}

export const MiningGuidanceAlert = ({
  open,
  onOpenChange,
  onViewMempool,
}: MiningGuidanceAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transaction Pending Confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Your transaction is now in the mempool waiting to be confirmed. Check the mempool to see your pending transaction, then mine 1 block to confirm it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            onViewMempool();
            onOpenChange(false);
          }}>
            View Mempool
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
