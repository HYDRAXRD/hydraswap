import { useEffect, useState } from "react";
import { ASTROLESCENT_BASE_URL } from "@/lib/astrolescent";

interface TokenPrice {
  symbol: string;
  tokenPriceUSD: number;
  diff24HUSD: number;
  iconUrl: string;
}

const TRACKED_SYMBOLS = ["XRD", "HYDR", "ASTRL", "XWBTC", "XETH", "DFP2", "ILIS", "EARLY", "HSOL", "WOWO"];

const DISPLAY_NAMES: Record<string, string> = {
  XWBTC: "BTC",
  XETH: "ETH",
  HSOL: "SOL",
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
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderItem = (token: TokenPrice, i: number) => {
    const pctChange = token.diff24HUSD * 100;
    const isPositive = pctChange >= 0;
    const displaySymbol = DISPLAY_NAMES[token.symbol] || token.symbol;
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

  return (
    <div className="w-full bg-secondary/40 border-b border-border/30 backdrop-blur-sm overflow-hidden">
      {/* Container com gap para separação suave entre loops */}
      <div className="flex animate-ticker-scroll gap-8">
        {prices.map((t, i) => renderItem(t, i))}
        {prices.map((t, i) => renderItem(t, i + prices.length))}
      </div>
    </div>
  );
};

export default PriceTicker;
