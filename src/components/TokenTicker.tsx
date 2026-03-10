import { useEffect, useState } from "react";

// Endereços dos tokens exibidos na faixa
const TICKER_ADDRESSES = [
  "resource_rdx1t4kc2yjdcqprwu70tahua3p8uwvjej9q3rktpxdr8p5pmcp4almd6r", // HYDR
  "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd", // XRD
  "resource_rdx1t580qxc7upat7lww4l2c4jckacafjeudxj5wpjrrct0p3e82sq4y75", // BTC
  "resource_rdx1th88qcj5syl9ghka2g9l7tw497vy5x6zaatyvgfkwcfe8n9jt2npww", // ETH
  "resource_rdx1t5ljlq97xfcewcdjxsqld89443fchqg96xv8a8k8gdftdycy9haxpx", // SOL
  "resource_rdx1t5ywq4c6nd2lxkemkv4uzt8v7x7smjcguzq5sgafwtasa6luq7fclq", // DFP2
  "resource_rdx1t4tjx4g3qzd98nayqxm7qdpj0a0u8ns6a0jrchq49dyfevgh6u0gj3", // ASTRL
  "resource_rdx1t4r86qqjtzl8620ahvsxuxaf366s6rf6cpy24psdkmrlkdqvzn47c2", // ILIS
  "resource_rdx1t5xv44c0u99z096q00mv74emwmxwjw26m98lwlzq6ddlpe9f5cuc7s", // EARLY
  "resource_rdx1t4kc5ljyrwlxvg54s6gnctt7nwwgx89h9r2gvrpm369s23yhzyyzlx", // WOWO
  "resource_rdx1t42hpqvsk4t42l6aw09hwphd2axvetp6gvas9ztue0p30f4hzdwxrp", // DCKS
];


// Logo manual para HYDRA (não está na API Astrolescent)
const HYDRA_LOGO = "https://arweave.net/dYJSMjZlaoVSttypbD46PJumutb0Nb-x1Zz8e7PdqA0";
const HYDRA_ADDRESS = "resource_rdx1t4kc2yjdcqprwu70tahua3p8uwvjej9q3rktpxdr8p5pmcp4almd6r";

interface TokenData {
  address: string;
  symbol: string;
  iconUrl: string;
  price: number | null;   // tokenPriceUSD
  change24h: number | null; // diff24HUSD (em %, ex: -3.11 = -3.11%)
}

const API_URL = "https://api.astrolescent.com/partner/hydraswap/prices";

const fetchTokenPrices = async (): Promise<TokenData[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Astrolescent API error");
  const data: Record<string, any> = await res.json();

  return TICKER_ADDRESSES.map((address) => {
    const entry = data[address];
    const isHydra = address === HYDRA_ADDRESS;

    if (!entry) {
      return {
        address,
        symbol: isHydra ? "HYDR" : address.slice(-6).toUpperCase(),
        iconUrl: isHydra ? HYDRA_LOGO : "",
        price: null,
        change24h: null,
      };
    }

    // diff24HUSD da API já é decimal: -0.0311 = -3.11%
    const rawChange = entry.diff24HUSD ?? null;
    const changePercent = rawChange !== null ? rawChange * 100 : null;

    return {
      address,
      symbol: entry.symbol ?? entry.name ?? "?",
      iconUrl: isHydra ? HYDRA_LOGO : (entry.iconUrl ?? entry.icon_url ?? ""),
      price: entry.tokenPriceUSD ?? null,
      change24h: changePercent,
    };
  });
};

const formatPrice = (price: number | null) => {
  if (price === null) return "$-.--";
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(3)}`;
  if (price >= 0.0001) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
};

const formatChange = (change: number | null) => {
  if (change === null) return "+0.00%";
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
};

const TokenTicker = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const updated = await fetchTokenPrices();
        setTokens(updated);
      } catch (e) {
        console.error("TokenTicker fetch error:", e);
      }
    };
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (tokens.length === 0) return null;

  // Duplica para scroll infinito seamless
  const items = [...tokens, ...tokens];

  return (
    <div
      className="w-full overflow-hidden bg-background/60 border-b border-border/30 backdrop-blur-sm"
      style={{ height: "36px" }}
    >
      <div
        className="ticker-scroll flex items-center h-full"
        style={{ width: "max-content", whiteSpace: "nowrap" }}
      >
        {items.map((token, idx) => {
          const isPositive = (token.change24h ?? 0) >= 0;
          return (
            <div
              key={`${token.address}-${idx}`}
              className="flex items-center gap-1.5 px-5"
              style={{ flexShrink: 0 }}
            >
              {token.iconUrl && (
                <img
                  src={token.iconUrl}
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
              <span className="text-border/40 text-xs ml-1">·</span>
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
