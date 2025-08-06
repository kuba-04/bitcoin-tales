import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mineBlock, getWalletBalance } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MiningSectionProps {
  onBalanceChange: (amount: number) => void;
  balance: number;
  energyCost: number;
  onEnergyCostChange: (amount: number) => void;
  mikeAddress: string;
  maryAddress: string;
  mikeWallet: string;
}

export const MiningSection = ({
  onBalanceChange,
  balance,
  energyCost,
  onEnergyCostChange,
  mikeAddress,
  maryAddress,
  mikeWallet,
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
      onBalanceChange(newBalance);
      toast({
        title: "Balance Updated",
        description: `Current balance: ${newBalance} BTC`,
      });
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
        const newBalance = await getWalletBalance(mikeWallet);
        onBalanceChange(newBalance);
        toast({
          title: "Mining Successful! 🎉",
          description: `Mining completed! Your new balance is ${newBalance} BTC. Energy cost: ${result.energyCost} units.`,
        });
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
        <img src="../assets/mining-machine.png" alt="mining machine" className="h-20 mb-2 mt-2 mx-auto block" />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-accent/20 p-2 rounded relative">
          <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 absolute top-2  right-20"
              onClick={handleRefreshBalance}
              disabled={isRefreshing || !mikeWallet}
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
            <div className="text-xs text-muted-foreground">Balance:</div>
            <div className="font-mono font-medium">{balance.toFixed(2)} BTC</div>
          </div>
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
      </div>
    </Card>
  );
}; 