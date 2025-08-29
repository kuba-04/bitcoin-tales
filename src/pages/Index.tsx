const Index = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Bitcoin Tales</h1>
        <p className="text-xl text-muted-foreground">Your Bitcoin adventure starts here!</p>
        <div className="mt-8 p-6 border border-border rounded-lg bg-card">
          <p className="text-muted-foreground">Use arrow keys or top bar navigation to go next to learn the basics.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
