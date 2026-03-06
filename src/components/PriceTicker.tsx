import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TokenPrice {
  symbol: string;
  price: number | null;
  change24h: number | null;
}

// Resource addresses for Radix tokens on Astrolescent API
const RADIX_TOKENS: Record<string, string> = {
  HYDR: "resource_rdx1t4h3hq5y3x3qjuqhrmfhrq3zp6yxkhex7cqxeaaj9uagr73f4xsuc",
  XRD:  "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
  ASTRL: "resource_rdx1t5jsgz4j5e0u80v3jhqnkz6v6d0yyh9rvkczze6rnlnqthzunm8um",
};

// CoinGecko IDs for non-Radix tokens (fetched separately)
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
};

const DISPLAY_ORDER = ["HYDR", "XRD", "BTC", "ETH", "SOL", "ASTRL"];

const TOKEN_ICONS: Record<string, string> = {
  HYDR:  "https://assets.radixdlt.com/icons/icon-hydra.png",
  XRD:   "https://assets.radixdlt.com/icons/icon-xrd-32x32.png",
  BTC:   "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
  ETH:   "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
  SOL:   "https://assets.coingecko.com/coins/images/4128/thumb/solana.png",
  ASTRL: "https://assets.radixdlt.com/icons/icon-astrolescent.png",
};

function formatPrice(price: number | null): string {
  if (price === null) return "$-.--";
  if (price < 0.0001) return `$${price.toExponential(2)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatChange(change: number | null): string {
  if (change === null) return "";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string, TokenPrice>>(
    Object.fromEntries(
      DISPLAY_ORDER.map((s) => [s, { symbol: s, price: null, change24h: null }])
    )
  );
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchPrices() {
    try {
      // Fetch Radix token prices from Astrolescent
      const res = await fetch(
        "https://api.astrolescent.com/partner/hydraswap/prices",
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Astrolescent API error");
      const data = await res.json();

      const updated: Record<string, TokenPrice> = { ...prices };

      // Map Radix tokens by resource address
      Object.entries(RADIX_TOKENS).forEach(([symbol, address]) => {
        const entry = data[address] || data[address.toLowerCase()];
        if (entry) {
          updated[symbol] = {
            symbol,
            price: entry.usd ?? entry.price ?? entry.priceUSD ?? null,
            change24h: entry.usd_24h_change ?? entry.change24h ?? null,
          };
        }
      });

      // Fetch BTC, ETH, SOL from CoinGecko (free, no key)
      try {
        const cgRes = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(COINGECKO_IDS).join(",")}&vs_currencies=usd&include_24hr_change=true`
        );
        if (cgRes.ok) {
          const cgData = await cgRes.json();
          Object.entries(COINGECKO_IDS).forEach(([symbol, id]) => {
            if (cgData[id]) {
              updated[symbol] = {
                symbol,
                price: cgData[id].usd ?? null,
                change24h: cgData[id].usd_24h_change ?? null,
              };
            }
          });
        }
      } catch {
        // CoinGecko failed, keep old values
      }

      setPrices(updated);
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const tickerItems = [...DISPLAY_ORDER, ...DISPLAY_ORDER]; // duplicate for seamless loop

  return (
    <div className="w-full bg-[hsl(var(--card)/0.6)] border-b border-border/40 backdrop-blur-md overflow-hidden relative z-50">
      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex gap-0 shrink-0"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {tickerItems.map((symbol, idx) => {
            const token = prices[symbol];
            const isPositive = (token?.change24h ?? 0) >= 0;
            return (
              <div
                key={`${symbol}-${idx}`}
                className="flex items-center gap-2 px-5 py-2 border-r border-border/20 shrink-0"
              >
                <img
                  src={TOKEN_ICONS[symbol]}
                  alt={symbol}
                  className="w-4 h-4 rounded-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-xs font-semibold text-foreground">
                  ${symbol}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatPrice(token?.price ?? null)}
                </span>
                {token?.change24h !== null && (
                  <span
                    className={`text-xs font-medium font-mono ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {formatChange(token?.change24h ?? null)}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <span className="text-xs text-muted-foreground">Unable to fetch prices</span>
        </div>
      )}
    </div>
  );
}
