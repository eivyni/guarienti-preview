# Frigorífico Guarienti

Landing page institucional do **Frigorífico Guarienti** (`https://frigorificoguarienti.com.br`).

## Estrutura do projeto

- `index.html` — Página principal (Início, Sobre Nós, Produtos e Contato com Web3Forms)
- `privacidade.html` — Política de Privacidade (LGPD) e gestão de cookies
- `style.css` / `style.min.css` — Estilos fonte e versão minificada usada nas páginas
- `script.js` / `script.min.js` — Scripts fonte (formulário Web3Forms + fallback WhatsApp, consentimento LGPD/GA4, menu mobile, animações) e versão minificada
- `optimized_images/` — Imagens otimizadas em `.webp`, `.jpg` e `.png` (incluindo variantes responsivas e Open Graph)
- `robots.txt` e `sitemap.xml` — Configurações de SEO
- `scripts/build.js` — Gera `style.min.css` e `script.min.js` via `esbuild`
- `scripts/dev.js` — Servidor estático local para desenvolvimento

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
