# Frigorífico Guarienti

Site institucional do **Frigorífico Guarienti** (`https://frigorificoguarienti.com.br`).

## Identidade Visual Oficial (2025)

Toda evolução visual do site deve seguir estritamente o manual oficial da marca:

### Paleta de Cores

| Cor | Hex | Uso principal |
| :--- | :--- | :--- |
| **Bordô Guarienti** | `#8B1E1E` | Cor institucional primária, CTAs, divisores e destaques |
| **Preto Institucional** | `#1C1C1C` | Seções escuras imponentes (Hero, Serviços Industriais, Rodapé) e títulos |
| **Gelo / Neutro Claro** | `#F7F7F7` | Fundos claros neutros, superfícies e contraste limpo |
| **Cinza Chumbo** | `#302F2F` | Cards escuros, barras institucionais e textos corridos |

### Tipografias

- **Títulos (`h1`, `h2`, `h3`):** `Bebas Neue` Regular — força, tradição e presença industrial
- **Subtítulos, menus e botões:** `Poppins` (`400`, `500`, `600`)
- **Textos corridos e formulários:** `Montserrat` (`400`, `500`, `600`, `700`)

### Posicionamento Institucional

- **Prestação de Serviços Industriais (Abate para Terceiros):** planta homologada **SISBI-POA** atendendo grandes marcas do setor alimentício (como Alibem e Estrela Alimentos).
- **Lojas Próprias e Comercialização:** produção de carnes bovina e suína com procedência gaúcha que abastece diretamente a demanda das lojas próprias e parceiros varejistas.

## Estrutura do projeto

- `index.html` — Página principal (Hero, Pilares Operacionais, Sobre Nós, Abate para Terceiros, Carnes & Lojas Próprias, FAQ, Contato Web3Forms e Google Maps)
- `privacidade.html` — Política de Privacidade (LGPD) e gestão de cookies
- `404.html` — Página personalizada de erro 404 (evita soft-404 na Cloudflare Pages)
- `style.css` / `style.min.css` — Estilos fonte e versão minificada usada nas páginas
- `script.js` / `script.min.js` — Scripts fonte e versão minificada
- `optimized_images/` — Imagens otimizadas em `.webp`, `.jpg` e `.png`
- `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml` e `_headers` — SEO, PWA e cabeçalhos de cache/segurança
- `scripts/build.js` — Gera `style.min.css` e `script.min.js` via `esbuild`
- `scripts/dev.js` — Servidor estático local para desenvolvimento

## Como trabalhar no projeto

```bash
npm install
npm run dev    # Servidor local em http://127.0.0.1:3000
npm run build  # Atualiza style.min.css e script.min.js após editar style.css ou script.js
```
