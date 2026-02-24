import { useEffect, useState } from "react";
import type { WalletDataState } from "@radixdlt/radix-dapp-toolkit";

export const useRadixWallet = () => {
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<WalletDataState["accounts"]>([]);

  useEffect(() => {
    const rdt = (globalThis as any).__rdt;
    if (!rdt) return;

    // Subscribe to wallet data changes
    const subscription = rdt.walletApi.walletData$.subscribe((data: WalletDataState) => {
      const accs = data?.accounts ?? [];
      setAccounts(accs);
      setConnected(accs.length > 0);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return { connected, accounts, shortenAddress };
};
