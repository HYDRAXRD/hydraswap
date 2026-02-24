import { createRoot } from "react-dom/client";
import { RadixDappToolkit, RadixNetwork, DataRequestBuilder } from "@radixdlt/radix-dapp-toolkit";
import App from "./App.tsx";
import "./index.css";

// Initialize Radix DApp Toolkit globally and save instance
const rdt = RadixDappToolkit({
  dAppDefinitionAddress:
    "account_rdx12y7md4spfq5qy7e3mfjpa52937uvkxf0nmydsu5wydkkxw3qx6nghn",
  networkId: RadixNetwork.Mainnet,
  applicationName: "Hydra Swap",
  applicationVersion: "1.0.0",
});

// Request at least 1 account on connect
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1));

(globalThis as any).__rdt = rdt;

createRoot(document.getElementById("root")!).render(<App />);
