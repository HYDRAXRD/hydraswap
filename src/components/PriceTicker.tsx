import { useEffect, useState } from "react";
import { ASTROLESCENT_BASE_URL } from "@/lib/astrolescent";

interface TokenPrice {
  symbol: string;
  tokenPriceUSD: number;
  diff24HUSD: number;
  iconUrl: string;
}

const TRACKED_SYMBOLS = ["xwBTC", "xETH", "hSOL", "XRD", "HYDR", "ASTRL", "DFP2", "ILIS", "EARLY", "WOWO", "DCKS"];

};

const PriceTicker = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(`${ASTROLESCENT_BASE_URL}/tokens`);
        if (!res.ok) return;
        const data = await res.json();
        const filtered = TRACKED_SYMBOLS
          .map((sym) => data.find((t: any) => t.symbol === sym))
          .filter((t): t is TokenPrice => !!t && typeof t.tokenPriceUSD === "number");
        setPrices(filtered);
      } catch {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (prices.length === 0) return null;

  const formatPrice = (price: number) => {
      if (price < 0.01) return Number(price.toPrecision(4)).toFixed(20).replace(/\.?0+$/, "");
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

const renderItem = (token: TokenPrice, i: number) => {
  const pctChange = token.diff24HUSD * 100;
  const isPositive = pctChange >= 0;
  
  // Mapeamento simples com if/else (sem Record lookup dinâmico)
  let displaySymbol = token.symbol;
  const upperSymbol = token.symbol.toUpperCase();
  
  if (upperSymbol === 'XWBTC' || upperSymbol === 'xwbtc') displaySymbol = 'BTC';
  else if (upperSymbol === 'XETH' || upperSymbol === 'xeth') displaySymbol = 'ETH';
  else if (upperSymbol === 'HSOL' || upperSymbol === 'hsol') displaySymbol = 'SOL';
  
  console.log(`"${token.symbol}" → "${displaySymbol}"`); // Remova depois
  
  return (
    <div key={`${token.symbol}-${i}`} className="flex items-center gap-2 shrink-0 px-4 py-2">
      <img src={token.iconUrl} alt={displaySymbol} className="w-4 h-4 rounded-full flex-shrink-0" />
      <span className="text-xs font-semibold text-foreground min-w-[20px]">{displaySymbol}</span>
      <span className="text-xs text-muted-foreground min-w-[60px]">${formatPrice(token.tokenPriceUSD)}</span>
      <span className={`text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"} min-w-[45px]`}>
        {isPositive ? "+" : ""}{pctChange.toFixed(2)}%
      </span>
    </div>
  );
};
