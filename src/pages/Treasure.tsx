import { useScrollNavigation } from "@/hooks/useScrollNavigation";

const Treasure = () => {
  useScrollNavigation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Chapter 3: The Discovery</h1>
        <p className="text-xl text-muted-foreground">The treasure awaits...</p>
        <div className="mt-8 p-6 border border-border rounded-lg bg-card max-w-2xl">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">The Golden Vault</h2>
          <p className="text-muted-foreground mb-4">
            At last! The legendary Crypto Vault stands before our hero, shimmering with 
            ethereal light. But the greatest treasures are not always made of gold...
          </p>
          <p className="text-muted-foreground">
            The tale concludes here, but new adventures await. Scroll to begin anew!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Treasure;