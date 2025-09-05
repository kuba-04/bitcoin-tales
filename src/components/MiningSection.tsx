import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mineBlock, getWalletBalance } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BalanceDisplay } from '@/components/BalanceDisplay';

interface MiningSectionProps {
  onMikeBalanceChange: (amount: number) => void;
  onMaryBalanceChange: (amount: number) => void;
  mikeBalance: number;
  energyCost: number;
  onEnergyCostChange: (amount: number) => void;
  mikeAddress: string;
  maryAddress: string;
  mikeWallet: string;
  maryWallet: string;
  onViewMempool: () => void;
  onViewTransaction: () => void;
  hasPendingTransaction: boolean;
}

export const MiningSection = ({
  onMikeBalanceChange,
  onMaryBalanceChange,
  mikeBalance,
  energyCost,
  onEnergyCostChange,
  mikeAddress,
  maryAddress,
  mikeWallet,
  maryWallet,
  onViewMempool,
  onViewTransaction,
}: MiningSectionProps) => {
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);
  const [blocks, setBlocks] = useState(101);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshBalance = async () => {
    if (!mikeWallet) return;
    
    setIsRefreshing(true);
    try {
      const newBalance = await getWalletBalance(mikeWallet);
      onMikeBalanceChange(newBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      toast({
        title: "Error",
        description: "Failed to refresh balance",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMining = async () => {
    setIsMining(true);
    setMiningProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setMiningProgress(prev => Math.min(prev + 10, 95));
    }, 200);

    try {
      const result = await mineBlock(mikeWallet, mikeAddress, blocks);
      setMiningProgress(100);
      
      onEnergyCostChange(result.energyCost);
      
      if (result.success) {
        // Get the new balance after successful mining
        const newMikesBalance = await getWalletBalance(mikeWallet);
        const newMarysBalance = await getWalletBalance(maryWallet);
        onMikeBalanceChange(newMikesBalance);
        onMaryBalanceChange(newMarysBalance);
        // toast({
        //   title: "Mining Successful! 🎉",
        //   description: `Mining completed! Your new balance is ${newMikesBalance} BTC. Energy cost: ${result.energyCost} units.`,
        // });
      } else {
        toast({
          title: "Mining Failed",
          description: `Mining failed. You spent ${result.energyCost} energy units.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while mining.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsMining(false);
        setMiningProgress(0);
      }, 1000);
    }
  };

  return (
    <Card className="p-3">
      <div className="flex justify-center text-xs">
        <img src="mining-machine.png" alt="mining machine" className="h-20 mb-2 mt-2 mx-auto block" />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <BalanceDisplay
            balance={mikeBalance}
            onRefresh={handleRefreshBalance}
            isRefreshing={isRefreshing}
            showRefresh={true}
          />
          <div className="bg-accent/20 p-2 rounded">
            <div className="text-xs text-muted-foreground">Energy Cost:</div>
            <div className="font-mono font-medium text-red-500">{energyCost} units</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Mining Progress</span>
            <span>{miningProgress}%</span>
          </div>
          <Progress value={miningProgress} className="h-2" />
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            min="1"
            value={blocks}
            onChange={(e) => setBlocks(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 h-8"
            disabled={isMining}
          />
          <span className="text-xs text-muted-foreground flex-1">blocks to mine</span>
        </div>
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleMining} 
                disabled={isMining || mikeAddress === "" || maryAddress === ""}
                className="w-full h-8 text-sm"
                variant={isMining ? "secondary" : "default"}
              >
                {isMining ? "Mining..." : "Start Mining"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {mikeAddress === "" || maryAddress === "" 
                ? "Generate both Mike's and Mary's addresses first to start mining"
                : "Mine 101 blocks to be able to use the mined funds"}
            </TooltipContent>
          </Tooltip>

          <Button 
            onClick={onViewMempool}
            variant="outline"
            className="w-full h-8 text-sm"
          >
            View Mempool
          </Button>

          <Button 
            onClick={onViewTransaction}
            variant="outline"
            className="w-full h-8 text-sm"
          >
            View Transaction
          </Button>
        </div>
      </div>
    </Card>
  );
}; 