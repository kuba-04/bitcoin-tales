import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const Mining = () => {
  const [isMining, setIsMining] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const startMining = () => {
    setIsMining(true);
    // Start video playback
    if (videoRef.current) {
      videoRef.current.play();
    }
    // Simulate energy consumption
    const interval = setInterval(() => {
      setEnergyLevel((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMining(false);
          // Pause video when mining stops
          if (videoRef.current) {
            videoRef.current.pause();
          }
          return 0;
        }
        return prev + 5;
      });
    }, 380);
  };

  return (
    <div className="mt-10 min-h-[calc(100vh-6rem)] bg-background text-foreground p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">Chapter 1: The Digital Prospector</h1>
        
        <div className="grid md:grid-cols-1 gap-8 items-start">
          {/* Left column - Story and Mining Controls */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Meet Mike the Miner</h2>
              <p className="text-muted-foreground mb-4">
                Our story begins with Mike, an industrious but cautious digital prospector.
                His quest for Bitcoin leads him through the challenging landscape of
                cryptocurrency mining, where success requires both skill and careful resource
                management.
              </p>

              <p className="text-muted-foreground">
                Armed with powerful computers and determination, Mike faces the daily
                challenge of balancing energy costs against potential rewards. Every block
                solved brings him closer to obtaining well deserved rewards, in form of 
                Bitcoin and transaction fees, but the path is never certain.
              </p>

              <div className="space-y-4 mb-10 mt-7">
                <div className="flex justify-between items-center">
                  <span>Energy Consumption</span>
                  <span>{energyLevel}%</span>
                </div>
                <Progress value={energyLevel} className="w-full" />
                <Button 
                  onClick={startMining} 
                  disabled={isMining}
                  className="w-full"
                >
                  {isMining ? "Mining in Progress..." : "Start Mining"}
                </Button>
              </div>

              
              <video 
              ref={videoRef}
              className="w-full rounded-lg h-64 object-cover mb-4"
              loop
              muted
            >
              <source src="../assets/mining.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Mining; 