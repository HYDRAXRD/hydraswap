import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronDown, Info, Loader2 } from "lucide-react";
import { useRadixWallet } from "@/hooks/useRadixWallet";
import { getSwapQuote, TOKEN_ADDRESSES, type SwapQuoteResponse } from "@/lib/astrolescent";

import xrdIcon from "@/assets/tokens/xrd.png";
import hydraIcon from "@/assets/tokens/hydra.png";
import ociIcon from "@/assets/tokens/oci.png";
import astrlIcon from "@/assets/tokens/astrl.png";
import hugIcon from "@/assets/tokens/hug.png";

const RadixConnectButton = "radix-connect-button" as any;

const TOKENS = [
  { symbol: "XRD", name: "Radix", icon: xrdIcon, address: TOKEN_ADDRESSES.XRD },
  { symbol: "HYDRA", name: "Hydra", icon: hydraIcon, address: TOKEN_ADDRESSES.HYDRA },
  { symbol: "OCI", name: "Ociswap", icon: ociIcon, address: TOKEN_ADDRESSES.OCI },
  { symbol: "ASTRL", name: "Astrolescent", icon: astrlIcon, address: TOKEN_ADDRESSES.ASTRL },
  { symbol: "HUG", name: "HugCoin", icon: hugIcon, address: TOKEN_ADDRESSES.HUG },
];

type Token = typeof TOKENS[0];

const TokenSelector = ({
  token,
  onSelect,
  isOpen,
  onToggle,
}: {
  token: Token;
  onSelect: (t: Token) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-xl transition-all duration-200 group"
    >
      <img src={token.icon} alt={token.symbol} className="w-5 h-5 rounded-full" />
      <span className="font-semibold text-foreground text-sm">{token.symbol}</span>
      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search token..."
              className="w-full bg-surface-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 mb-1"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {TOKENS.map((t) => (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelect(t);
                  onToggle();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/60 transition-colors text-left"
              >
                <img src={t.icon} alt={t.symbol} className="w-6 h-6 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{t.symbol}</div>
                  <div className="text-xs text-muted-foreground">{t.name}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SwapCard = () => {
  const { connected, accounts, shortenAddress } = useRadixWallet();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [openSelector, setOpenSelector] = useState<"from" | "to" | null>(null);
  const [quote, setQuote] = useState<SwapQuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    const amount = parseFloat(fromAmount.replace(/,/g, ""));
    if (!amount || amount <= 0 || !connected || accounts.length === 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getSwapQuote({
        inputToken: fromToken.address,
        outputToken: toToken.address,
        inputAmount: amount,
        fromAddress: accounts[0].address,
      });
      setQuote(result);
    } catch (err) {
      setError("Failed to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [fromAmount, fromToken, toToken, connected, accounts]);

  // Debounced quote fetch
  useEffect(() => {
    const amount = parseFloat(fromAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      setQuote(null);
      return;
    }

    const timer = setTimeout(fetchQuote, 600);
    return () => clearTimeout(timer);
  }, [fetchQuote, fromAmount]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setQuote(null);
  };

  const handleSwap = () => {
    if (!quote?.manifest) return;
    const rdt = (globalThis as any).__rdt;
    if (rdt) {
      rdt.walletApi.sendTransaction({
        transactionManifest: quote.manifest,
      });
    }
  };

  const outputAmount = quote ? quote.outputTokens.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "";
  const priceImpact = quote ? `${quote.priceImpact}%` : "—";
  const rate = quote
    ? `1 ${fromToken.symbol} = ${(quote.outputTokens / quote.inputTokens).toFixed(4)} ${toToken.symbol}`
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[460px] mx-auto"
    >
      {/* Card */}
      <div className="hydra-card-gradient rounded-2xl p-1 hydra-glow">
        <div className="bg-card rounded-[14px] p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-foreground">Swap</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
              Fee: 0.5%
            </span>
          </div>

          {/* From Input */}
          <div className="hydra-input-bg rounded-xl p-4 border border-border/50 hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">From</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-2xl font-semibold text-foreground w-full focus:outline-none placeholder:text-muted-foreground/50"
                placeholder="0.0"
              />
              <TokenSelector
                token={fromToken}
                onSelect={setFromToken}
                isOpen={openSelector === "from"}
                onToggle={() => setOpenSelector(openSelector === "from" ? null : "from")}
              />
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-3 relative z-10">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSwapTokens}
              className="w-10 h-10 rounded-xl bg-secondary border-4 border-card flex items-center justify-center text-primary hover:bg-secondary/80 transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          </div>

          {/* To Input */}
          <div className="hydra-input-bg rounded-xl p-4 border border-border/50 hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">To</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={loading ? "" : outputAmount}
                  readOnly
                  className="bg-transparent text-2xl font-semibold text-foreground w-full focus:outline-none"
                  placeholder={loading ? "..." : "0.0"}
                />
                {loading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
              </div>
              <TokenSelector
                token={toToken}
                onSelect={setToToken}
                isOpen={openSelector === "to"}
                onToggle={() => setOpenSelector(openSelector === "to" ? null : "to")}
              />
            </div>
          </div>

          {/* Rate Info */}
          {quote && (
            <div className="mt-4 bg-surface-input rounded-xl p-3 border border-border/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" /> Rate
                </span>
                <span className="text-foreground/90 font-medium">{rate}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-muted-foreground">Price Impact</span>
                <span className="text-primary font-medium">{priceImpact}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-muted-foreground">Hydra Fee</span>
                <span className="text-foreground/90 font-medium">0.5%</span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive mt-3 text-center">{error}</p>
          )}

          {/* Swap Button */}
          {connected ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwap}
              disabled={!quote || loading}
              className="w-full mt-4 hydra-gradient-cyan text-accent-foreground py-4 rounded-xl font-display font-bold text-base transition-all duration-200 hover:opacity-95 hydra-btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Fetching Quote..." : !quote ? "Enter an amount" : "Swap"}
            </motion.button>
          ) : (
            <div className="w-full mt-4 flex justify-center">
              <RadixConnectButton />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Route Info */}
      {quote && quote.routes && quote.routes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 bg-card/50 border border-border/30 rounded-xl p-3"
        >
          <p className="text-xs font-medium text-muted-foreground mb-2">Route</p>
          <div className="space-y-1.5">
            {quote.routes.map((route, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {route.pools.map((pool, pidx) => (
                    <span key={pidx} className="text-foreground/80">
                      {pool.name || pool.type || pool.dex || `Pool ${pidx + 1}`}
                    </span>
                  ))}
                </div>
                {route.pools[0]?.percentage && (
                  <span className="text-primary font-semibold">{route.pools[0].percentage}%</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwapCard;
