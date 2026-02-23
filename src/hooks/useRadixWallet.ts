import { useEffect, useState } from "react";
import type { WalletDataState } from "@radixdlt/radix-dapp-toolkit";

export const useRadixWallet = () => {
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState<WalletDataState["accounts"]>([]);

  useEffect(() => {
    // The RDT is initialized in main.tsx. The connect button handles wallet interaction.
    // We listen for wallet data changes via custom events dispatched by RDT.
    const checkConnection = () => {
      const rdt = (globalThis as any).__rdt;
      if (rdt) {
        rdt.walletApi.walletData$.subscribe((data: WalletDataState) => {
          setAccounts(data?.accounts ?? []);
          setConnected((data?.accounts?.length ?? 0) > 0);
        });
      }
    };
    
    // Small delay to let RDT initialize
    const timer = setTimeout(checkConnection, 500);
    return () => clearTimeout(timer);
  }, []);

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return { connected, accounts, shortenAddress };
};
