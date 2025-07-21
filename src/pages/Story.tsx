import { useScrollNavigation } from "@/hooks/useScrollNavigation";

const Story = () => {
  useScrollNavigation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Chapter 1: The Beginning</h1>
        <p className="text-xl text-muted-foreground">Once upon a time in the digital realm...</p>
        <div className="mt-8 p-6 border border-border rounded-lg bg-card max-w-2xl">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">The Tale Unfolds</h2>
          <p className="text-muted-foreground mb-4">
            In a world where coins held magical powers, our hero discovers an ancient treasure map
            that leads to the legendary Crypto Vault.
          </p>
          <p className="text-muted-foreground">
            Scroll down to continue the adventure...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Story;