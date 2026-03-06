import { useEffect, useState } from "react";

interface TokenData {
  symbol: string;
  address: string;
  logoUrl?: string;
  price: number | null;
  change24h: number | null;
}

const TOKENS: TokenData[] = [
  {
    symbol: "HYDRA",
    address: "resource_rdx1t4dy69k6s0gv040xa64cyadyefczgq9r57jlxhfxcmqnlhpqdc6wx",
    price: null,
    change24h: null,
  },
  {
    symbol: "XRD",
    address: "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
    price: null,
    change24h: null,
  },
  {
    symbol: "MRD",
    address: "resource_rdx1th2zd7pjp8xjmjm9ne3g2l3mjscyltkg97k02g8tzxvamqxrg00k8",
    price: null,
    change24h: null,
  },
  {
    symbol: "DOUBT",
    address: "resource_rdx1t5h5prjm4gv08htpz5c0hg5rw48rszevq2h8yw2ldgvqy0s2c8vvn",
    price: null,
    change24h: null,
  },
  {
    symbol: "DFP2",
    address: "resource_rdx1thrvtlku9p6wpjm5wh7umkgdxg66xjyh0cf0nnwr3rfgztujke3kr",
    price: null,
    change24h: null,
  },
];

const TOKEN_LOGOS: Record<string, string> = {
  XRD: "https://assets.radixdlt.com/icons/icon-xrd-32x32.png",
  HYDRA: "https://www.hydraxrd.com/hydra-logo.png",
  MRD: "https://assets.oci.so/icons/MRD.png",
  DOUBT: "https://assets.oci.so/icons/DOUBT.png",
  DFP2: "https://assets.oci.so/icons/DFP2.png",
};

const fetchTokenPrices = async (): Promise<TokenData[]> => {
  try {
    const addresses = TOKENS.map((t) => t.address);
    const res = await fetch(
      `https://api.ociswap.com/preview/tokens/prices?addresses=${addresses.join(",")}`
    );
    if (!res.ok) throw new Error("OCI API error");
    const data = await res.json();

    return TOKENS.map((token) => {
      const entry = data?.find(
        (d: any) =>
          d.address?.toLowerCase() === token.address.toLowerCase()
      );
      return {
        ...token,
        price: entry?.price_usd ?? null,
        change24h: entry?.change_24h ?? null,
      };
    });
  } catch {
    // Fallback: tentar Astrolescent
    try {
      const updated: TokenData[] = [];
      for (const token of TOKENS) {
        try {
          const r = await fetch(
            `https://api.astrolescent.com/partner/XwGJ5Uq6r5/token-price?tokenAddress=${token.address}`
          );
          const d = await r.json();
          updated.push({
            ...token,
            price: d?.price_usd ?? null,
            change24h: d?.change24h ?? null,
          });
        } catch {
          updated.push(token);
        }
      }
      return updated;
    } catch {
      return TOKENS;
    }
  }
};

const formatPrice = (price: number | null) => {
  if (price === null) return "$-.--";
  if (price < 0.0001) return `$${price.toExponential(2)}`;
  return `$${price.toFixed(price < 0.01 ? 4 : price < 1 ? 3 : 2)}`;
};

const formatChange = (change: number | null) => {
  if (change === null) return "+0.00%";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};

const TokenTicker = () => {
  const [tokens, setTokens] = useState<TokenData[]>(TOKENS);

  useEffect(() => {
    const load = async () => {
      const updated = await fetchTokenPrices();
      setTokens(updated);
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const items = [...tokens, ...tokens]; // duplicate for seamless scroll

  return (
    <div className="w-full overflow-hidden bg-background/60 border-b border-border/30 backdrop-blur-sm" style={{ height: '36px' }}>
      <div
        className="flex items-center h-full ticker-scroll"
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "ticker-scroll 30s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((token, idx) => {
          const change = token.change24h ?? 0;
          const isPositive = change >= 0;
          return (
            <div
              key={`${token.symbol}-${idx}`}
              className="flex items-center gap-1.5 px-5"
              style={{ flexShrink: 0 }}
            >
              {TOKEN_LOGOS[token.symbol] && (
                <img
                  src={TOKEN_LOGOS[token.symbol]}
                  alt={token.symbol}
                  className="rounded-full"
                  style={{ width: 18, height: 18, objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span className="text-xs font-semibold text-foreground/90">
                ${token.symbol}
              </span>
              <span className="text-xs text-foreground/70">
                {formatPrice(token.price)}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: isPositive ? "#22c55e" : "#ef4444" }}
              >
                {formatChange(token.change24h)}
              </span>
              <span className="text-border/50 text-xs ml-2">·</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TokenTicker;
