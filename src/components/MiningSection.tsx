import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { mineBlock } from '@/lib/mining-api';
import { toast } from '@/components/ui/use-toast';

interface MiningSectionProps {
  onBalanceChange: (amount: number) => void;
  balance: number;
  energyCost: number;
  onEnergyCostChange: (amount: number) => void;
}

export const MiningSection = ({
  onBalanceChange,
  balance,
  energyCost,
  onEnergyCostChange
}: MiningSectionProps) => {
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState(0);

  const handleMining = async () => {
    setIsMining(true);
    setMiningProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setMiningProgress(prev => Math.min(prev + 10, 95));
    }, 200);

    try {
      const result = await mineBlock();
      setMiningProgress(100);
      
      onEnergyCostChange(result.energyCost);
      
      if (result.success && result.reward) {
        onBalanceChange(result.reward);
        toast({
          title: "Mining Successful! 🎉",
          description: `You earned ${result.reward} BTC but spent ${result.energyCost} energy units.`,
        });
      } else {
        toast({
          title: "Mining Failed",
          description: `No reward this time. You spent ${result.energyCost} energy units.`,
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
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-accent/20 p-2 rounded">
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
        <Button 
          onClick={handleMining} 
          disabled={isMining}
          className="w-full h-8 text-sm"
          variant={isMining ? "secondary" : "default"}
        >
          {isMining ? "Mining..." : "Start Mining"}
        </Button>
      </div>
    </Card>
  );
}; 