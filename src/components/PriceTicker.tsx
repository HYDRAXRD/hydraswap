import { useEffect, useState } from "react";
import { ASTROLESCENT_BASE_URL } from "@/lib/astrolescent";

interface TokenPrice {
  symbol: string;
  tokenPriceUSD: number;
  diff24HUSD: number;
  iconUrl: string;
}

const TRACKED_SYMBOLS = ["xwBTC", "xETH", "hSOL", "XRD", "HYDR", "ASTRL", "DFP2", "ILIS", "EARLY", "WOWO", "DCKS"];

const PriceTicker = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true); // Para evitar sumir

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${ASTROLESCENT_BASE_URL}/tokens`);
        if (!res.ok) {
          console.error("API falhou:", res.status);
          return;
        }
        const data = await res.json();
        console.log("API ", data); // Debug API
        
        const filtered = TRACKED_SYMBOLS
          .map((sym) => data.find((t: any) => t.symbol === sym))
          .filter((t): t is TokenPrice => !!t && typeof t.tokenPriceUSD === "number");
        
        console.log("Filtered tokens:", filtered);
        setPrices(filtered);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // MOSTRA loading enquanto carrega (não some)
  if (loading) {
    return (
      <div className="w-full bg-secondary/40 border-b border-border/30 backdrop-blur-sm h-10 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="w-full bg-secondary/40 border-b border-border/30 backdrop-blur-sm h-10 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Sem dados</span>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return Number(price.toPrecision(4)).toFixed(20).replace(/\.?0+$/, "");
    if (price < 1) return price.toFixed(4);
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const renderItem = (token: TokenPrice, i: number) => {
    const pctChange = token.diff24HUSD * 100;
    const isPositive = pctChange >= 0;
    
    // Case-insensitive mapping simples
    let displaySymbol = token.symbol;
    const upperSymbol = token.symbol.toUpperCase();
    if (upperSymbol.includes('BTC')) displaySymbol = 'BTC';
    else if (upperSymbol.includes('ETH')) displaySymbol = 'ETH';
    else if (upperSymbol.includes('SOL')) displaySymbol = 'SOL';
    
    console.log(`"${token.symbol}" → "${displaySymbol}"`);
    
    return (
      <div key={`${token.symbol}-${i}`} className="flex items-center gap-2 shrink-0 px-4 py-2">
        <img 
          src={token.iconUrl} 
          alt={displaySymbol} 
          className="w-4 h-4 rounded-full flex-shrink-0"
          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
        />
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
      <div className="flex animate-ticker-scroll gap-8">
        {prices.map((t, i) => renderItem(t, i))}
        {prices.map((t, i) => renderItem(t, i + prices.length))}
      </div>
    </div>
  );
};

export default PriceTicker;
