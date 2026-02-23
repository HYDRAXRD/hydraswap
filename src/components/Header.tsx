import hydraLogo from "@/assets/hydra-logo.png";

const RadixConnectButton = "radix-connect-button" as any;

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={hydraLogo} alt="Hydra" className="h-9 w-9 rounded-full" />
          <span className="font-display text-xl font-bold tracking-tight hydra-gradient-text">
            HYDRA
          </span>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full ml-1">
            SWAP
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {["Swap", "Pool", "Stake", "Bridge"].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                item === "Swap"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Radix Connect Button */}
        <RadixConnectButton />
      </div>
    </header>
  );
};

export default Header;
