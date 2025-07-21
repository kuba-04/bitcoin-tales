const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Coin Comic Tales</h1>
        <p className="text-xl text-muted-foreground">Your adventure starts here!</p>
        <div className="mt-8 p-6 border border-border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground">This is your blank canvas. Start building something amazing!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
