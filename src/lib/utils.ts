import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { create } from 'zustand'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SATS_PER_BTC = 100_000_000;

export function satoshisToBTC(satoshis: number): number {
  return satoshis / SATS_PER_BTC;
}

export function formatBTCValue(btc: number): string {
  return btc.toFixed(8);
}

interface DisplayStore {
  displayInBTC: boolean;
  toggleDisplay: () => void;
}

export const useDisplayStore = create<DisplayStore>((set) => ({
  displayInBTC: false,
  toggleDisplay: () => set((state) => ({ displayInBTC: !state.displayInBTC })),
}));
