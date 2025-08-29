import type { MempoolTransaction } from './mining-api';

const STORAGE_KEYS = {
  MIKE_WALLET: 'mike_wallet',
  MARY_WALLET: 'mary_wallet',
  MIKE_ADDRESS: 'mike_address',
  MARY_ADDRESS: 'mary_address',
  MIKE_BALANCE: 'mike_balance',
  MARY_BALANCE: 'mary_balance',
  MENU_PRICES: 'menu_prices',
  TRANSACTIONS: 'transactions',
} as const;

export const storage = {
  // Wallet Management
  getMikeWallet: () => localStorage.getItem(STORAGE_KEYS.MIKE_WALLET),
  setMikeWallet: (walletId: string) => localStorage.setItem(STORAGE_KEYS.MIKE_WALLET, walletId),
  getMaryWallet: () => localStorage.getItem(STORAGE_KEYS.MARY_WALLET),
  setMaryWallet: (walletId: string) => localStorage.setItem(STORAGE_KEYS.MARY_WALLET, walletId),

  // Address Management
  getMikeAddress: () => localStorage.getItem(STORAGE_KEYS.MIKE_ADDRESS) || '',
  setMikeAddress: (address: string) => localStorage.setItem(STORAGE_KEYS.MIKE_ADDRESS, address),
  getMaryAddress: () => localStorage.getItem(STORAGE_KEYS.MARY_ADDRESS) || '',
  setMaryAddress: (address: string) => localStorage.setItem(STORAGE_KEYS.MARY_ADDRESS, address),

  // Balance Management
  getMikeBalance: () => Number(localStorage.getItem(STORAGE_KEYS.MIKE_BALANCE)) || 0,
  setMikeBalance: (balance: number) => localStorage.setItem(STORAGE_KEYS.MIKE_BALANCE, balance.toString()),
  getMaryBalance: () => Number(localStorage.getItem(STORAGE_KEYS.MARY_BALANCE)) || 0,
  setMaryBalance: (balance: number) => localStorage.setItem(STORAGE_KEYS.MARY_BALANCE, balance.toString()),

  // Menu Prices Management
  getMenuPrices: () => {
    const prices = localStorage.getItem(STORAGE_KEYS.MENU_PRICES);
    return prices ? JSON.parse(prices) : {};
  },
  setMenuPrices: (prices: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEYS.MENU_PRICES, JSON.stringify(prices));
  },

  // Transaction History Management
  getTransactions: () => {
    const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactions ? JSON.parse(transactions) as MempoolTransaction[] : [];
  },
  setTransactions: (transactions: MempoolTransaction[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },
  addTransaction: (transaction: MempoolTransaction) => {
    const transactions = storage.getTransactions();
    transactions.push(transaction);
    storage.setTransactions(transactions);
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
