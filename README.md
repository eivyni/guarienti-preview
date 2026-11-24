# Frigorífico Guarienti

Landing page institucional do **Frigorífico Guarienti** (`https://frigorificoguarienti.com.br`).

## Estrutura do projeto

- `index.html` — Página principal (Hero, faixa de credibilidade SISBI-POA, Sobre Nós, Produtos com CTA comercial, FAQ B2B, Contato com Web3Forms e mapa Google Maps)
- `privacidade.html` — Política de Privacidade (LGPD) e gestão de cookies
- `404.html` — Página personalizada de erro 404 (evita soft-404 na Cloudflare Pages)
- `style.css` / `style.min.css` — Estilos fonte e versão minificada usada nas páginas
- `script.js` / `script.min.js` — Scripts fonte (formulário Web3Forms + máscara de telefone + fallback WhatsApp, consentimento LGPD/GA4, menu mobile, animações) e versão minificada
- `optimized_images/` — Imagens otimizadas em `.webp`, `.jpg` e `.png` (incluindo variantes responsivas do hero e Open Graph)
- `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml` e `_headers` — SEO, PWA e cabeçalhos de cache/segurança (Cloudflare Pages)
- `scripts/build.js` — Gera `style.min.css` e `script.min.js` via `esbuild`
- `scripts/dev.js` — Servidor estático local para desenvolvimento (com suporte a `404.html`)

## Como trabalhar no projeto

Instale as dependências de desenvolvimento (apenas `esbuild`):

```bash
npm install
```

### Rodar localmente

```bash
npm run dev
```

Abre o site em `http://127.0.0.1:3000` (use `PORT=8080 npm run dev` para outra porta).

### Gerar arquivos minificados após editar CSS ou JS

Sempre que editar `style.css` ou `script.js`, execute:

```bash
npm run build
```

Isso atualiza `style.min.css` e `script.min.js`, que são os arquivos carregados pelo `index.html` e `privacidade.html`.
