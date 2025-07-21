// Types
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
  reward?: number;
  energyCost: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Mock menu items
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'mango-salad',
    name: 'Mango Salad',
    price: 20,
    description: 'A refreshing and exotic treat'
  },
  {
    id: 'banana-bread',
    name: 'Banana Bread',
    price: 12,
    description: 'A hearty and comforting loaf'
  },
  {
    id: 'corn-tortillas',
    name: 'Corn Tortillas',
    price: 8,
    description: 'A simple and savory snack'
  },
  {
    id: 'apple-pie',
    name: 'Apple Pie',
    price: 15,
    description: 'A classic, sweet indulgence'
  },
  {
    id: 'hummus',
    name: 'Hummus',
    price: 4,
    description: 'A healthy and flavorful dip'
  }
];

// Mock API functions
export const mineBlock = async (): Promise<MiningResult> => {
  // Simulate mining delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 30% chance of successful mining
  const success = Math.random() < 0.3;
  const energyCost = Math.floor(Math.random() * 3) + 1; // 1-3 energy cost
  
  return {
    success,
    reward: success ? 10 : 0, // 10 BTC reward for successful mining
    energyCost
  };
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