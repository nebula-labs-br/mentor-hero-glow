

## Plano: Performance 73 → 85+ (Proxima rodada)

Baseado na nova analise, restam 3 gargalos principais:

---

### 1. Google Fonts bloqueando renderizacao (750ms de economia)

**Problema**: O `<link rel="stylesheet">` do Google Fonts bloqueia a renderizacao por 750ms.

**Acao**: Trocar para carregamento assincrono usando `<link rel="preload" as="style">` com `onload` fallback:
```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=..." onload="this.rel='stylesheet'"/>
<noscript><link rel="stylesheet" href="..."/></noscript>
```

---

### 2. Imagens ainda oversized (168 KiB de economia)

**Problema**: `mentora-mobile.webp` tem 924x864px mas e exibida a 167x156px. `logo-workshop.png` tem 1354x625px mas e exibida a 160x74px.

**Acao**:
- Adicionar `width` e `height` corretos nas tags `<img>` para reduzir CLS (0.142)
- Usar `srcset` com tamanhos menores para que o browser baixe apenas o necessario
- **Voce precisaria fazer upload de versoes redimensionadas** (mentora-mobile ~400px largura, logo-workshop ~320px largura) via squoosh.app ou similar
- Alternativa sem upload: nao ha como redimensionar server-side no Lovable, mas podemos pelo menos corrigir `width`/`height` para reduzir CLS

---

### 3. CLS de 0.142 (acima do ideal de 0.1)

**Problema**: Layout shift causado por imagens sem dimensoes corretas ou elementos que mudam de tamanho ao carregar.

**Acao**:
- Garantir que todas as imagens hero tenham `width` e `height` que correspondam ao aspect ratio real
- Adicionar `aspect-ratio` CSS inline nas imagens principais para reservar espaco antes do carregamento
- Verificar se fontes web causam shift (adicionar `font-display: swap` ja esta presente via `&display=swap`)

---

### Resumo de impacto esperado

| Metrica | Atual | Estimado |
|---------|-------|----------|
| FCP | 2.9s | ~2.0-2.3s |
| LCP | 4.5s | ~2.5-3.5s |
| CLS | 0.142 | ~0.05-0.08 |
| Score | 73 | ~82-90 |

### O que NAO sera alterado
- Nenhum visual, layout ou animacao muda
- Apenas como os recursos sao carregados pelo browser

