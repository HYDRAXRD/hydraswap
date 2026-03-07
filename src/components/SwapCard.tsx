import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronDown, Info, Loader2 } from "lucide-react";
import { useRadixWallet } from "@/hooks/useRadixWallet";
import { getSwapQuote, getTokenList, PREFERRED_SYMBOLS, type SwapQuoteResponse, type AstrolescentToken } from "@/lib/astrolescent";

const RadixConnectButton = "radix-connect-button" as any;

interface Token {
  symbol: string;
  name: string;
  icon: string;
  address: string;
  priceXRD: number;
}

const TokenSelector = ({
  token,
  onSelect,
  isOpen,
  onToggle,
  tokens,
}: {
  token: Token;
  onSelect: (t: Token) => void;
  isOpen: boolean;
  onToggle: () => void;
  tokens: Token[];
}) => {
  const [search, setSearch] = useState("");
  const filtered = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 mb-1"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((t) => (
                <button
                  key={t.address}
                  onClick={() => {
                    onSelect(t);
                    onToggle();
                    setSearch("");
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
};

const SwapCard = () => {
  const { connected, accounts } = useRadixWallet();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("1000");
  const [openSelector, setOpenSelector] = useState<"from" | "to" | null>(null);
  const [quote, setQuote] = useState<SwapQuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tokens from Astrolescent API
  useEffect(() => {
    async function fetchTokens() {
      try {
        const apiTokens = await getTokenList();
        // Map preferred tokens first, then all others
        const preferred = PREFERRED_SYMBOLS
          .map((sym) => apiTokens.find((t) => t.symbol.toUpperCase() === sym))
          .filter(Boolean) as AstrolescentToken[];

        const others = apiTokens.filter(
          (t) => !PREFERRED_SYMBOLS.includes(t.symbol.toUpperCase())
        );

        const allTokens = [...preferred, ...others].map((t) => ({
          symbol: t.symbol,
          name: t.name,
          icon: t.iconUrl || t.icon_url,
          address: t.address,
          priceXRD: t.tokenPriceXRD || 0,
        }));

        setTokens(allTokens);
        // Default pair: XRD -> HYDRA
        const xrd = allTokens.find((t) => t.symbol.toUpperCase() === "XRD");
        const hydra = allTokens.find((t) => ["HYDR", "HYDRA"].includes(t.symbol.toUpperCase()));
        setFromToken(xrd || allTokens[0]);
        setToToken(hydra || allTokens[1] || allTokens[0]);
      } catch (err) {
        console.error("Failed to load tokens:", err);
        setError("Failed to load tokens");
      } finally {
        setLoadingTokens(false);
      }
    }
    fetchTokens();
  }, []);

  const PLACEHOLDER_ADDRESS = "account_rdx128y6j78mt0aqv6372evz28hrxp8mn06ccddkr7xppc88hyvynvjdwr";

  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken) return;
    const amount = parseFloat(fromAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) {
      setQuote(null);
      return;
    }

    const senderAddress = connected && accounts.length > 0
      ? accounts[0].address
      : PLACEHOLDER_ADDRESS;

    setLoading(true);
    setError(null);
    try {
      const result = await getSwapQuote({
        inputToken: fromToken.address,
        outputToken: toToken.address,
        inputAmount: amount,
        fromAddress: senderAddress,
      });
      setQuote(result);
    } catch (err: any) {
      console.error("Quote error:", err);
      setError(err.message || "Failed to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [fromAmount, fromToken, toToken, connected, accounts]);

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
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
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

  if (loadingTokens || !fromToken || !toToken) {
    return (
      <div className="w-full max-w-[460px] mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const outputAmount = quote ? quote.outputTokens.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "";

  // Calculate real price impact from market prices
  const computedPriceImpact = (() => {
    if (!quote || !fromToken || !toToken || toToken.priceXRD <= 0) return null;
    const expectedOutput = (parseFloat(fromAmount.replace(/,/g, "")) * fromToken.priceXRD) / toToken.priceXRD;
    if (expectedOutput <= 0) return null;
    const totalReceived = quote.outputTokens + parseFloat(quote.swapFee || "0");
    const impact = ((expectedOutput - totalReceived) / expectedOutput) * 100;
    return Math.max(0, impact);
  })();

  const priceImpact = computedPriceImpact !== null ? `${computedPriceImpact.toFixed(2)}%` : `${quote?.priceImpact ?? 0}%`;
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
      <div className="hydra-card-gradient rounded-2xl p-1 hydra-glow">
        <div className="bg-card rounded-[14px] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-foreground">Swap</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
              Fee: 0.5%
            </span>
          </div>

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
                tokens={tokens}
              />
            </div>
          </div>

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
                tokens={tokens}
              />
            </div>
          </div>

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

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSwap}
            disabled={!connected || !quote || loading}
            className="w-full mt-4 hydra-gradient-cyan text-accent-foreground py-4 rounded-xl font-display font-bold text-base transition-all duration-200 hover:opacity-95 hydra-btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!connected ? "Connect Wallet to Swap" : loading ? "Fetching Quote..." : !quote ? "Enter an amount" : "Swap"}
          </motion.button>
        </div>
      </div>

      {quote && quote.routes && quote.routes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-3 bg-card/50 border border-border/30 rounded-xl p-3"
        >
          <p className="text-xs font-medium text-muted-foreground mb-2">Route</p>
          <div className="space-y-1.5">
            {quote.routes.map((route, idx) => {
              const pool = route.pools[0];
              const pct = quote.inputTokens > 0
                ? ((route.tokensIn ?? 0) / quote.inputTokens * 100).toFixed(0)
                : null;
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-foreground/80">
                    {pool?.type || pool?.dex || `Pool ${idx + 1}`}
                  </span>
                  <div className="flex items-center gap-2">
                    {route.tokensIn != null && route.tokensOut != null && (
                      <span className="text-muted-foreground">
                        {route.tokensIn.toLocaleString(undefined, { maximumFractionDigits: 2 })} → {route.tokensOut.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    )}
                    {pct && (
                      <span className="text-primary font-semibold">{pct}%</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwapCard;
