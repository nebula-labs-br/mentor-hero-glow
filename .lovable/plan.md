

## Plano: Substituir mentora-mobile.png pela versao WebP otimizada

O usuario enviou o arquivo `mentora-mobile.webp` -- a versao comprimida da imagem hero mobile que era um dos maiores gargalos de performance (861 KiB no PNG original).

### Acao

1. Copiar `user-uploads://mentora-mobile.webp` para `public/images/mentora-mobile.webp`
2. Atualizar `public/workshop.html`:
   - Trocar todas as referencias de `mentora-mobile.png` para `mentora-mobile.webp` (na tag `<img>` e no `<link rel="preload">`)

Isso deve reduzir o LCP significativamente sem alterar nada visual.

