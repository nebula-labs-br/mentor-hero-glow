

## Plano de Otimizacao de Performance -- Lighthouse 69 → 85+

Baseado na analise completa do Lighthouse, os principais gargalos sao: **imagens pesadas (2.5 MB)**, **scripts bloqueando renderizacao (2.2s)** e **LCP lento (8s)**. Abaixo, o plano ordenado por impacto.

---

### 1. Corrigir a imagem LCP (impacto: alto -- FCP e LCP)

**Problema**: A imagem `mentora-mobile.png` (861 KiB) e o elemento LCP no mobile, mas esta sem `fetchpriority="high"` e sem preload. O preload atual aponta para `mentora.webp` (desktop).

**Acao**:
- Adicionar `fetchpriority="high"` na tag `<img>` da `mentora-mobile.png`
- Trocar o preload no `<head>` para carregar a imagem mobile em telas pequenas usando `<link rel="preload" media="(max-width:768px)">`
- Manter o preload da `mentora.webp` para desktop

---

### 2. Comprimir e redimensionar imagens (impacto: alto -- 2252 KiB de economia)

**Problema**: Imagens sao muito maiores do que o tamanho exibido. Ex: `mentora-mobile.png` tem 924x864px mas e exibida a 292x273px.

**Acao**:
- Converter `mentora-mobile.png` para WebP (de ~861 KiB para ~100-150 KiB)
- Redimensionar todas as imagens de depoimento para o tamanho real de exibicao (~644px de largura max)
- Converter `logo-workshop.png` para WebP
- Isso requer gerar versoes otimizadas das imagens fora do Lovable e fazer upload. Alternativa: usar `<img srcset>` com tamanhos menores

> **Nota**: Nao consigo comprimir imagens diretamente no Lovable. Voce precisaria otimizar as imagens em uma ferramenta externa (squoosh.app, tinypng.com) e fazer upload das versoes otimizadas.

---

### 3. Deferir scripts bloqueantes (impacto: alto -- 2230ms de economia)

**Problema**: 6 scripts CDN carregam de forma sincrona no `<head>`, bloqueando a renderizacao: GSAP, ScrollTrigger, CountUp, Splitting, Lenis, tsParticles.

**Acao**:
- Mover todos os `<script>` CDN para o final do `<body>` (antes do `</body>`)
- Adicionar `defer` nos scripts que nao sao consumidos imediatamente
- Para GSAP/ScrollTrigger que sao usados por scripts inline: mover os scripts inline tambem para depois dos CDN scripts no final do body
- Mover os CSS do Splitting (`splitting.css`, `splitting-cells.css`) para `<link rel="preload" as="style">` com `onload` para carregamento nao-bloqueante

---

### 4. Lazy-load do tsParticles (impacto: medio)

**Problema**: tsParticles tem 40 KiB e leva 1800ms para carregar, mas e apenas decorativo (background).

**Acao**:
- Carregar tsParticles apenas apos o evento `load` da pagina usando JavaScript dinamico (`document.createElement('script')`)
- Isso libera o caminho critico da renderizacao

---

### 5. Adicionar cache headers (impacto: medio -- para visitas recorrentes)

**Problema**: Todas as imagens retornam com cache TTL "None", totalizando 2565 KiB sem cache.

**Acao**:
- Isso depende da configuracao do servidor/CDN da Lovable, nao do HTML
- No entanto, podemos adicionar `<meta http-equiv="Cache-Control">` como hint (impacto limitado)
- **Isso sera resolvido automaticamente quando publicar em um dominio proprio com CDN configurado (Cloudflare, etc)**

---

### Resumo de impacto esperado

| Metrica | Antes | Estimado |
|---------|-------|----------|
| FCP | 3.3s | ~1.5-2.0s |
| LCP | 8.0s | ~3.0-4.0s |
| Speed Index | 3.5s | ~2.0-2.5s |
| Score | 69 | ~85-92 |

### O que NAO sera alterado (para nao quebrar o site)
- Nenhuma secao HTML sera removida ou reordenada
- Nenhum estilo visual sera modificado
- Todas as animacoes (GSAP, Splitting, Lenis) continuam funcionando -- apenas carregam depois
- tsParticles continua funcionando -- apenas inicia apos o load

