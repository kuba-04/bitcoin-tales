import { useScrollNavigation } from "@/hooks/useScrollNavigation";

const Adventure = () => {
  useScrollNavigation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Chapter 2: The Quest</h1>
        <p className="text-xl text-muted-foreground">The adventure deepens...</p>
        <div className="mt-8 p-6 border border-border rounded-lg bg-card max-w-2xl">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Into the Unknown</h2>
          <p className="text-muted-foreground mb-4">
            Armed with courage and the mystical coin compass, our hero ventures into the 
            enchanted forest where digital spirits guard ancient secrets.
          </p>
          <p className="text-muted-foreground">
            Continue scrolling to unveil the mystery...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Adventure;