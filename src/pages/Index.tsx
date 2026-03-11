import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import PriceTicker from "@/components/PriceTicker";
import { motion } from "framer-motion";

const SOCIAL_LINKS = [
  { href: "https://x.com/HYDRAXRD", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { href: "https://t.me/hydraxrd", icon: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  )},
  { href: "https://youtube.com/@hydraxrd", icon: (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.31,4.21C16.42,4.07,14.29,4,12,4s-4.42.07-6.31.21A4,4,0,0,0,2,8.2v7.6a4,4,0,0,0,3.69,4c1.89.14,4,.21,6.31.21s4.42-.07,6.31-.21a4,4,0,0,0,3.69-4V8.2A4,4,0,0,0,18.31,4.21Z"/>
    <path d="M10,9.88v4.24a.5.5,0,0,0,.76.43l3.53-2.12a.51.51,0,0,0,0-.86L10.76,9.45A.5.5,0,0,0,10,9.88Z"/>
  </svg>
)},
{ href: "https://instagram.com/hydraxrd", icon: (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.34,5.46h0a1.2,1.2,0,1,0,1.2,1.2A1.2,1.2,0,0,0,17.34,5.46Zm4.6,2.42a7.59,7.59,0,0,0-.46-2.43,4.94,4.94,0,0,0-1.16-1.77,4.7,4.7,0,0,0-1.77-1.15,7.3,7.3,0,0,0-2.43-.47C15.06,2,14.72,2,12,2s-3.06,0-4.12.06a7.3,7.3,0,0,0-2.43.47A4.78,4.78,0,0,0,3.68,3.68,4.7,4.7,0,0,0,2.53,5.45a7.3,7.3,0,0,0-.47,2.43C2,8.94,2,9.28,2,12s0,3.06.06,4.12a7.3,7.3,0,0,0,.47,2.43,4.7,4.7,0,0,0,1.15,1.77,4.78,4.78,0,0,0,1.77,1.15,7.3,7.3,0,0,0,2.43.47C8.94,22,9.28,22,12,22s3.06,0,4.12-.06a7.3,7.3,0,0,0,2.43-.47,4.7,4.7,0,0,0,1.77-1.15,4.85,4.85,0,0,0,1.16-1.77,7.59,7.59,0,0,0,.46-2.43c0-1.06.06-1.4.06-4.12S22,8.94,21.94,7.88ZM20.14,16a5.61,5.61,0,0,1-.34,1.86,3.06,3.06,0,0,1-.75,1.15,3.19,3.19,0,0,1-1.15.75,5.61,5.61,0,0,1-1.86.34c-1,.05-1.37.06-4,.06s-3,0-4-.06A5.73,5.73,0,0,1,6.1,19.8,3.27,3.27,0,0,1,5,19.05a3,3,0,0,1-.74-1.15A5.54,5.54,0,0,1,3.86,16c0-1-.06-1.37-.06-4s0-3,.06-4A5.54,5.54,0,0,1,4.21,6.1,3,3,0,0,1,5,5,3.14,3.14,0,0,1,6.1,4.2,5.73,5.73,0,0,1,8,3.86c1,0,1.37-.06,4-.06s3,0,4,.06a5.61,5.61,0,0,1,1.86.34A3.06,3.06,0,0,1,19.05,5,3.06,3.06,0,0,1,19.8,6.1,5.61,5.61,0,0,1,20.14,8c.05,1,.06,1.37.06,4S20.19,15,20.14,16ZM12,6.87A5.13,5.13,0,1,0,17.14,12,5.12,5.12,0,0,0,12,6.87Zm0,8.46A3.33,3.33,0,1,1,15.33,12,3.33,3.33,0,0,1,12,15.33Z"/>
  </svg>
)},
{ href: "https://tiktok.com/@hydraxrd", icon: (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 stroke-current stroke-[1.2]" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18C11.6569 18 13 16.6569 13 15V6C13.3333 7 14.6 9 17 9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)},
  { label: "Website", href: "https://hydraxrd.com", icon: (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 stroke-current stroke-[1.5]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="12" rx="1"/>
    <rect x="10" y="16" width="5" height="4.5"/>
    <line x1="8.5" y1="9.5" x2="10.5" y2="9.5"/>
    <line x1="4.5" y1="16.5" x2="14.5" y2="16.5"/>
  </svg>
)},
  { label: "Bubbles", href: "https://hydraxrd.com/bubbles", icon: (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 stroke-current stroke-[1.4]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="5"/>
    <path d="M16 13c.7 0 1.4.35 1.8.9"/>
    <circle cx="7" cy="7" r="3"/>
    <circle cx="4" cy="15" r="2.5"/>
    <line x1="13" y1="2" x2="13" y2="5"/>
    <line x1="18" y1="8" x2="15" y2="8"/>
    <line x1="16.5" y1="4" x2="14.5" y2="6"/>
  </svg>
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
