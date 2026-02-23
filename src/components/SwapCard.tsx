import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Settings, ChevronDown, Wallet, RefreshCw, Info } from "lucide-react";

const TOKENS = [
  { symbol: "XRD", name: "Radix", icon: "🔵", balance: "1,245.50", price: 0.024 },
  { symbol: "HYDRA", name: "Hydra", icon: "🐉", balance: "50,000", price: 0.0012 },
  { symbol: "OCI", name: "Ociswap", icon: "🟢", balance: "320.00", price: 0.15 },
  { symbol: "ASTRL", name: "Astrolescent", icon: "🌟", balance: "1,000", price: 0.025 },
  { symbol: "HUG", name: "HugCoin", icon: "🤗", balance: "10,000", price: 0.001 },
];

const TokenSelector = ({
  token,
  onSelect,
  isOpen,
  onToggle,
}: {
  token: typeof TOKENS[0];
  onSelect: (t: typeof TOKENS[0]) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-xl transition-all duration-200 group"
    >
      <span className="text-lg">{token.icon}</span>
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
                <span className="text-lg">{t.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{t.symbol}</div>
                  <div className="text-xs text-muted-foreground">{t.name}</div>
                </div>
                <span className="text-xs text-muted-foreground">{t.balance}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const SwapCard = () => {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("1,000");
  const [openSelector, setOpenSelector] = useState<"from" | "to" | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  const toAmount = "833,333.33";
  const rate = "1 XRD = 833.33 HYDRA";
  const priceImpact = "0.12%";

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4.5 h-4.5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground">
                <RefreshCw className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-surface-input rounded-xl p-4 border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Slippage Tolerance</p>
                  <div className="flex gap-2">
                    {["0.1", "0.5", "1.0"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSlippage(val)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          slippage === val
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                    <input
                      type="text"
                      value={slippage}
                      onChange={(e) => setSlippage(e.target.value)}
                      className="w-16 bg-secondary rounded-lg px-2 py-1.5 text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="%"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* From Input */}
          <div className="hydra-input-bg rounded-xl p-4 border border-border/50 hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">From</span>
              <span className="text-xs text-muted-foreground">
                Balance: <span className="text-foreground/80">{fromToken.balance}</span>
              </span>
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
            <p className="text-xs text-muted-foreground mt-2">${(parseFloat(fromAmount.replace(",", "")) * fromToken.price).toFixed(2)}</p>
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
              <span className="text-xs text-muted-foreground">
                Balance: <span className="text-foreground/80">{toToken.balance}</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={toAmount}
                readOnly
                className="bg-transparent text-2xl font-semibold text-foreground w-full focus:outline-none"
                placeholder="0.0"
              />
              <TokenSelector
                token={toToken}
                onSelect={setToToken}
                isOpen={openSelector === "to"}
                onToggle={() => setOpenSelector(openSelector === "to" ? null : "to")}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">≈ ${(parseFloat(toAmount.replace(/,/g, "")) * toToken.price).toFixed(2)}</p>
          </div>

          {/* Rate Info */}
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
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-foreground/90 font-medium">{slippage}%</span>
            </div>
          </div>

          {/* Swap Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 hydra-gradient-orange text-accent-foreground py-4 rounded-xl font-display font-bold text-base transition-all duration-200 hover:opacity-95 hydra-btn-glow"
          >
            <Wallet className="w-4 h-4 inline mr-2 -mt-0.5" />
            Connect Wallet
          </motion.button>
        </div>
      </div>

      {/* Route Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-3 bg-card/50 border border-border/30 rounded-xl p-3"
      >
        <p className="text-xs font-medium text-muted-foreground mb-2">Route</p>
        <div className="space-y-1.5">
          {[
            { pct: "85%", pool: "HydraSwap Pool", amount: "708,333 HYDRA" },
            { pct: "10%", pool: "OciSwap", amount: "83,333 HYDRA" },
            { pct: "5%", pool: "CaviarNine", amount: "41,667 HYDRA" },
          ].map((route) => (
            <div key={route.pool} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold w-8">{route.pct}</span>
                <span className="text-foreground/80">{route.pool}</span>
              </div>
              <span className="text-muted-foreground">{route.amount}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwapCard;
