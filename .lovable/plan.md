

## Plano: Performance 82 → 88+ (Ajustes finais)

O score subiu de 69 para 82. O unico metrica vermelha restante e o **LCP de 4.5s**. As demais (FCP 1.7s, TBT 30ms, CLS 0.063) ja estao verdes. Aqui esta o que ainda podemos ajustar sem tocar em pixel, UTMs ou links.

---

### 1. Remover `decoding="async"` da imagem LCP (impacto direto no LCP)

**Problema**: A imagem hero (`mentora-mobile.webp`) tem `decoding="async"`, o que instrui o browser a decodificar a imagem fora do caminho critico. Para a imagem LCP, isso **atrasa** o momento em que ela aparece na tela.

**Acao**: Remover `decoding="async"` apenas da `mentora-mobile.webp` (a imagem com `fetchpriority="high"`). Todas as outras imagens continuam com `decoding="async"`.

---

### 2. Adicionar `preconnect` ao Facebook (economizar ~100-200ms)

**Problema**: O Facebook Pixel carrega 105 KiB de scripts de `connect.facebook.net`. Sem preconnect, o browser precisa resolver DNS + TLS antes de baixar.

**Acao**: Adicionar `<link rel="preconnect" href="https://connect.facebook.net"/>` no `<head>`, logo apos os preconnects existentes. Nao altera o pixel em si.

---

### 3. Converter `logo-workshop.png` para WebP (economia de ~30-40 KiB)

**Problema**: O logo ainda e PNG (64 KiB). Como WebP, ficaria em torno de 15-25 KiB.

**Acao**: Voce precisaria gerar a versao WebP e fazer upload. Eu atualizo as referencias no HTML. Se preferir pular este passo, o impacto e menor.

---

### 4. Inline do CSS critico do hero (economia ~200-300ms no LCP)

**Problema**: O CSS do hero depende do stylesheet completo que esta inline no HTML, mas as fontes ainda carregam de forma assincrona. Podemos adicionar uma `font-family` fallback com metricas similares para que o texto do hero renderize imediatamente sem esperar a fonte.

**Acao**: Adicionar `font-display: swap` ja esta no Google Fonts URL, mas podemos reforcar com um bloco `@font-face` inline minimo que define os fallbacks do sistema para Montserrat e Inter, eliminando o flash de layout.

---

### Resumo

| O que muda | Risco | Impacto |
|---|---|---|
| Remover `decoding="async"` do LCP img | Zero | LCP -200-500ms |
| Preconnect Facebook | Zero | LCP -100-200ms |
| Logo WebP (requer upload) | Zero | -30-40 KiB |
| Font fallback inline | Zero visual | FCP/LCP -100-300ms |

**Nada visual muda. Pixel, UTMs e links permanecem intactos.**

