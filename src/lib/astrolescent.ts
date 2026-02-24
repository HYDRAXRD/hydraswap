// Astrolescent DEX Aggregator API integration
// Docs: https://docs.astrolescent.com/astrolescent-docs/infrastructure/api

// TODO: Replace with your actual Astrolescent partner API key
const ASTROLESCENT_API_KEY = "YOUR_PARTNER_API_KEY";

// TODO: Replace with your fee component address (contact Astrolescent on Telegram to set up)
const FEE_COMPONENT = "";

// Hydra Swap fee: 0.5% => 0.005
const HYDRA_SWAP_FEE = 0.005;

export const ASTROLESCENT_BASE_URL = `https://api.astrolescent.com/partner/${ASTROLESCENT_API_KEY}`;

// Known token resource addresses on Radix mainnet
export const TOKEN_ADDRESSES: Record<string, string> = {
  XRD: "resource_rdx1tknxxxxxxxxxradaboraboraborxxxxxxxxx009923554798",
  HYDRA: "resource_rdx1thrvr3xfs2tarm2dl9emvs26vjqxu6mqvfgvqjne940jv0lnrrg7p",
  OCI: "resource_rdx1t4upr78guuapv5ept7d7ptee0k0fep0xmahi6dh5lnuf6p26p5cans",
  ASTRL: "resource_rdx1t5ga7j04ek4laprf7xryxlu4hl04373sskdaaptfnjhnsns98vma8m",
  HUG: "resource_rdx1t5kmyj54jt85malva7fxdrnpvgfgs623yt7ywdaval25vrdlmnwe97",
};

export interface SwapQuoteRequest {
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  fromAddress: string;
}

export interface SwapRoute {
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
    throw new Error(`Astrolescent API error: ${response.status}`);
  }

  return response.json();
}
