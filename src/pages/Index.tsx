import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import PriceTicker from "@/components/PriceTicker";
import { motion } from "framer-motion";

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/HYDRAXRD", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { label: "Telegram", href: "https://t.me/hydraxrd", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  )},
  { label: "Website", href: "https://hydraxrd.com", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  )},
  { label: "Bubbles", href: "https://hydraxrd.com/bubbles", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  )},
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-glow-orange/[0.02] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(195 100% 50% / 0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Rising Hydras */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`hydra-${i}`}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${5 + Math.random() * 90}%`,
              bottom: `-${30 + Math.random() * 40}px`,
              fontSize: `${16 + Math.random() * 24}px`,
            }}
            animate={{
              y: [0, -(window.innerHeight + 100)],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0, 0.1, 0.07, 0],
              rotate: [0, (Math.random() - 0.5) * 30],
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeOut",
              delay: Math.random() * 12,
            }}
          >
            🐉
          </motion.div>
        ))}
        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Fixed top: Header + PriceTicker */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
        <PriceTicker />
      </div>

      {/* Fixed title below header + ticker (header=64px, ticker~34px) */}
      <div className="fixed left-0 right-0 z-40 flex flex-col items-center pt-[108px] pb-3 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
            <motion.span
              className="inline-block"
              style={{
                background: "linear-gradient(90deg, hsl(195 100% 60%), hsl(175 85% 45%), hsl(160 90% 50%), hsl(195 100% 60%))",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Hydra
            </motion.span>{" "}
            <span>Swap</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Trade tokens instantly on the Radix network
          </p>
        </motion.div>
      </div>

      {/* Main Content - padded to clear fixed header + ticker + title (~64+34+90=188px) */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-[200px] pb-10 px-4">
        <SwapCard />
        {/* Footer with social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 text-xs font-medium"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 text-center">
            Powered by Astrolescent
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
