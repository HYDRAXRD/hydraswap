// Astrolescent DEX Aggregator API integration
// Docs: https://docs.astrolescent.com/astrolescent-docs/infrastructure/api

const ASTROLESCENT_API_KEY = "hydraswap";

const FEE_COMPONENT = "component_rdx1czrf5g2h0lhjaftqdg3w0jfr57jzursse9m5depefm3reecg7payrf";

// Hydra Swap fee: 0.5% => 0.005
const HYDRA_SWAP_FEE = 0.005;

export const ASTROLESCENT_BASE_URL = `https://api.astrolescent.com/partner/${ASTROLESCENT_API_KEY}`;

// Preferred tokens to show in the swap UI (by symbol)
export const PREFERRED_SYMBOLS = ["XRD", "HYDR", "HYDRA", "OCI", "ASTRL", "HUG"];

export interface AstrolescentToken {
  address: string;
  symbol: string;
  name: string;
  iconUrl: string;
  icon_url: string;
  tokenPriceXRD: number;
  tokenPriceUSD: number;
}

export async function getTokenList(): Promise<AstrolescentToken[]> {
  const response = await fetch(`${ASTROLESCENT_BASE_URL}/tokens`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens: ${response.status}`);
  }
  return response.json();
}

export interface SwapQuoteRequest {
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  fromAddress: string;
}

export interface SwapRoute {
  tokensIn?: number;
  tokensOut?: number;
  pools: {
    type: string;
    dex?: string;
    inputToken?: string;
    outputToken?: string;
    inputAmount?: number;
    outputAmount?: number;
    percentage?: number;
    name?: string;
  }[];
}

export interface SwapQuoteResponse {
  inputTokens: number;
  outputTokens: number;
  priceImpact: number;
  swapFee: string;
  routes: SwapRoute[];
  manifest: string;
}

export async function getSwapQuote(
  request: SwapQuoteRequest
): Promise<SwapQuoteResponse> {
  const body: Record<string, any> = {
    inputToken: request.inputToken,
    outputToken: request.outputToken,
    inputAmount: request.inputAmount,
    fromAddress: request.fromAddress,
    fee: HYDRA_SWAP_FEE,
  };

  if (FEE_COMPONENT) {
    body.feeComponent = FEE_COMPONENT;
  }

  const response = await fetch(`${ASTROLESCENT_BASE_URL}/swap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Astrolescent API error: ${response.status}`);
  }

  return response.json();
}
