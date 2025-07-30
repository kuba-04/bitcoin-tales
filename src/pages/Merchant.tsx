import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Merchant = () => {
  
  return (
    <div className="mt-10 min-h-[calc(100vh-6rem)] bg-background text-foreground p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">Chapter 2: The Local Merchant</h1>
        
        <div className="grid md:grid-cols-1 gap-8 items-start">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">Meet Mary the Merchant</h2>
              <p className="text-muted-foreground mb-4">
                Mary's Fresh & Local Stand is a charming spot in the community known for its delightful homemade goods. Mary, the
                friendly owner, has embraced Bitcoin as a means of exchange, bridging the gap between traditional commerce and digital currency.
              </p>

              <p className="text-muted-foreground">
                Unlike the high-tech world of mining, Mary's stand represents the practical,
                everyday use of Bitcoin. Her acceptance of digital currency has made her stand
                a favorite spot for local crypto enthusiasts, while maintaining the warm,
                personal touch of a community vendor.
              </p>

              <img src="/assets/mary.jpg" alt="Mary the Merchant" className="w-full h-64 object-cover mb-4 mt-10" />

            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchant; 