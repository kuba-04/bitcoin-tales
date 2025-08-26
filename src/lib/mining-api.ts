// Types
export enum WalletType {
  MINER = "Miner",
  MERCHANT = "Merchant"
}

export interface MempoolTransaction {
  txid: string;
  from_wallet: string;
  to_address: string;
  amount: number;
  message: string;
  status: 'pending' | 'confirmed';
  block_height?: number;
  confirmations?: number;
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
    price: 20_000,
    description: 'A refreshing and exotic treat',
    image: '/assets/mangosalad.jpg'
  },
  {
    id: 'banana-bread',
    name: 'Banana Bread',
    price: 12_000,
    description: 'A hearty and comforting loaf',
    image: '/assets/bananabread.jpg'
  },
  {
    id: 'corn-tortillas',
    name: 'Corn Tortillas',
    price: 8_000,
    description: 'A simple and savory snack',
    image: '/assets/tortillas.webp'
  },
  {
    id: 'apple-pie',
    name: 'Apple Pie',
    price: 15_000,
    description: 'A classic, sweet indulgence',
    image: '/assets/applepie.webp'
  },
  {
    id: 'hummus',
    name: 'Hummus',
    price: 4_000,
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
  fromWallet: string,
  toAddress: string,
  amount: number,
  itemName: string
): Promise<string> => {
  const response = await fetch('http://127.0.0.1:8021/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from_wallet: fromWallet,
      to_address: toAddress,
      amount: amount,
      message: `buying ${itemName}`
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create transaction: ${response.statusText}`);
  }
  
  const txid = await response.text(); // Parse as text instead of JSON
  console.log("txid ", txid.replace(/^"|"$/g, ''));
  return txid.replace(/^"|"$/g, '');
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

export const checkMempoolTransaction = async (
  walletName: string,
  txid: string
): Promise<MempoolTransaction | null> => {
  console.log('checkMempoolTransaction: Making request to /mempool/' + walletName + '/' + txid);
  const response = await fetch(`http://127.0.0.1:8021/mempool/${walletName}/${txid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    // Transaction is no longer in mempool, likely confirmed
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to check transaction status: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    status: data.confirmed ? 'confirmed' : 'pending'
  };
};

export const getConfirmedTransaction = async (
  walletName: string,
  txid: string
): Promise<MempoolTransaction> => {
  console.log('getConfirmedTransaction: Making request to /tx/' + txid);
  const response = await fetch(`http://127.0.0.1:8021/tx/${walletName}/${txid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('getConfirmedTransaction: Response status:', response.status);
  
  if (!response.ok) {
    console.log('getConfirmedTransaction: Request failed with status:', response.statusText);
    throw new Error(`Failed to get transaction details: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('getConfirmedTransaction: Response data:', data);
  return {
    ...data,
    status: 'confirmed'
  };
}; 