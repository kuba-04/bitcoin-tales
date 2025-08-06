// Types
export enum WalletType {
  MINER = "Miner",
  MERCHANT = "Merchant"
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  change: number;
  status: 'pending' | 'confirmed';
  timestamp: number;
}

export interface MiningResult {
  success: boolean;
  energyCost: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

// Mock menu items
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'mango-salad',
    name: 'Mango Salad',
    price: 20,
    description: 'A refreshing and exotic treat',
    image: '/assets/mangosalad.jpg'
  },
  {
    id: 'banana-bread',
    name: 'Banana Bread',
    price: 12,
    description: 'A hearty and comforting loaf',
    image: '/assets/bananabread.jpg'
  },
  {
    id: 'corn-tortillas',
    name: 'Corn Tortillas',
    price: 8,
    description: 'A simple and savory snack',
    image: '/assets/tortillas.webp'
  },
  {
    id: 'apple-pie',
    name: 'Apple Pie',
    price: 15,
    description: 'A classic, sweet indulgence',
    image: '/assets/applepie.webp'
  },
  {
    id: 'hummus',
    name: 'Hummus',
    price: 4,
    description: 'A healthy and flavorful dip',
    image: '/assets/hummus.webp'
  }
];

// Mock API functions
export const createWallet = async (name: string): Promise<{ walletId: string }> => {
  const response = await fetch('http://127.0.0.1:8021/wallet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create wallet: ${response.statusText}`);
  }

  const data = await response.json();

  return { walletId: data.name };
};

export const mineBlock = async (walletName: string, address: string, blocks: number = 101): Promise<MiningResult> => {
  try {
    const response = await fetch('http://127.0.0.1:8021/mine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet_name: walletName,
        address: address,
        blocks: blocks
      }),
    });

    if (!response.ok) {
      throw new Error(`Mining failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      energyCost: blocks // Energy cost scales with blocks mined
    };
  } catch (error) {
    console.error('Mining error:', error);
    return {
      success: false,
      energyCost: blocks // Still consume energy even on failure
    };
  }
};

export const createTransaction = async (
  amount: number,
  itemId: string
): Promise<Transaction> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const fee = 1; // Fixed network fee
  const change = amount - MENU_ITEMS.find(item => item.id === itemId)!.price - fee;
  
  return {
    id: Math.random().toString(36).substring(7),
    from: "Mike's Wallet",
    to: "Mary's Stand",
    amount,
    fee,
    change,
    status: 'pending',
    timestamp: Date.now()
  };
};

export const createAddress = async (walletName: string, addressName: string): Promise<{ address: string }> => {
  const response = await fetch('http://127.0.0.1:8021/address', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wallet_name: walletName,
      name: addressName
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create address: ${response.statusText}`);
  }

  const data = await response.json();
  return { address: data };
};

export const getWalletBalance = async (walletName: string): Promise<number> => {
  try {
    const response = await fetch(`http://127.0.0.1:8021/wallet/${walletName}/balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get balance: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Balance check error:', error);
    throw error;
  }
};

export const confirmTransaction = async (
  transaction: Transaction
): Promise<Transaction> => {
  // Simulate confirmation delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    ...transaction,
    status: 'confirmed'
  };
}; 