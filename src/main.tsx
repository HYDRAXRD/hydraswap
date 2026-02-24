import { createRoot } from "react-dom/client";
import { RadixDappToolkit, RadixNetwork } from "@radixdlt/radix-dapp-toolkit";
import App from "./App.tsx";
import "./index.css";

// Initialize Radix DApp Toolkit globally and save instance
(globalThis as any).__rdt = RadixDappToolkit({
  dAppDefinitionAddress:
    "account_rdx12y7md4spfq5qy7e3mfjpa52937uvkxf0nmydsu5wydkkxw3qx6nghn",
  networkId: RadixNetwork.Mainnet,
  applicationName: "Hydra Swap",
  applicationVersion: "1.0.0",
});

createRoot(document.getElementById("root")!).render(<App />);
