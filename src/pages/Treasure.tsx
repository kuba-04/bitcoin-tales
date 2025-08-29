const Treasure = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-foreground">Chapter 4: Your own Journey</h1>
        <p className="text-xl text-muted-foreground">The treasures await...</p>
        <div className="mt-8 p-6 border border-border rounded-lg bg-card max-w-2xl">
          <p className="text-muted-foreground mb-4">
            You have learned how the bitcoin economy works. Mike the Miner is happy with his work, becuase he can buy the real items he wants.
            Mary the Merchant is happy because she can sell her goods. Now she also has bitcoin and can buy the things she needs. 
            The bitcoin circulates and is used for all transactions. 
          </p>
          <p className="text-muted-foreground">
            The tale concludes here, but new adventures await. Now you can start your own journey and participate in the bitcoin economy. 
            Most likely you can be like Mary and offer your goods for sale. Remember, bitcoin's nature is deflationary, you keep it and only use it when you need it. 
            Unlike in fiat currency, you don't have to worry about inflation and buy things you don't need!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Treasure;