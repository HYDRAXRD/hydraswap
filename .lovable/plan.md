
# Plano de Alteracoes - Hydra Swap

## Resumo das Alteracoes

### 1. Botao Swap com Manifesto de Transacao
O botao abaixo da caixa de swap ja existe e executa `handleSwap()` que envia o manifesto via `rdt.walletApi.sendTransaction`. O problema e que o `__rdt` nao esta sendo salvo globalmente. Vou corrigir o `main.tsx` para salvar a instancia do RDT em `globalThis.__rdt` e garantir que o manifesto da Astrolescent seja enviado corretamente a carteira Radix.

### 2. Fixar HYDRA como Token Padrao (no lugar de OCI)
Na lista `PREFERRED_SYMBOLS`, HYDRA ja e o segundo. Porem no `SwapCard`, o segundo token selecionado automaticamente (`allTokens[1]`) depende da ordem retornada pela API. Vou ajustar a logica para garantir que o par padrao seja **XRD -> HYDRA**.

### 3. Favicon com Logo da Hydra
Atualizar o `index.html` para usar o logo da Hydra (`src/assets/hydra-logo.png`) como favicon, copiando-o para `public/favicon.png`.

### 4. Remover Todas as Referencias ao Lovable
- `index.html`: Trocar title para "Hydra Swap", remover meta tags com "Lovable" (description, author, og:title, og:description, og:image, twitter)
- `src/pages/Index.tsx`: Remover texto "Powered by Astrolescent - Built by the Hydra Community" ou ajustar conforme necessario

### 5. Proteger Codigo Fonte
Adicionar um script no `index.html` que desabilita o clique direito e atalhos como Ctrl+U, F12, Ctrl+Shift+I. Nota: isso nao impede 100% o acesso (usuarios avancados podem contornar), mas dificulta o acesso casual.

---

## Detalhes Tecnicos

### `src/main.tsx`
- Salvar o retorno do `RadixDappToolkit()` em `(globalThis as any).__rdt` para que o `handleSwap` funcione.

### `src/components/SwapCard.tsx`
- Na logica de selecao inicial de tokens, buscar especificamente XRD e HYDRA pelo simbolo
- Manter `handleSwap` usando `(globalThis as any).__rdt.walletApi.sendTransaction({ transactionManifest: quote.manifest })`

### `src/lib/astrolescent.ts`
- Mover HYDRA para a segunda posicao em `PREFERRED_SYMBOLS` (ja esta)

### `index.html`
- Title: "Hydra Swap"
- Description: "Trade tokens instantly on the Radix network"
- Author: "Hydra Community"
- Remover og:image do Lovable e twitter:site @Lovable
- Adicionar favicon referenciando `/favicon.png`
- Adicionar script inline para desabilitar DevTools e view-source

### `public/favicon.png`
- Copiar `src/assets/hydra-logo.png` para `public/favicon.png`

### `src/pages/Index.tsx`
- Trocar rodape para "Powered by Astrolescent" (sem mencao ao Lovable)
