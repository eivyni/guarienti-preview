const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const optDir = path.join(rootDir, "optimized_images");
const heroPath = path.join(optDir, "hero-bg-principal-1280.jpg");
const logoPath = path.join(optDir, "logoprincipal.png");
const outJpg = path.join(optDir, "og-image.jpg");
const tmpHtml = path.join("/tmp", "guarienti-og-render.html");
const tmpPng = path.join("/tmp", "guarienti-og-render.png");

const heroDataUri = `data:image/jpeg;base64,${fs.readFileSync(heroPath).toString("base64")}`;
const logoDataUri = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@500;600&family=Poppins:wght@500;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #1C1C1C;
    font-family: "Montserrat", sans-serif;
  }
  .card {
    position: relative;
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #1C1C1C;
  }
  .bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      95deg,
      rgba(28, 28, 28, 0.94) 0%,
      rgba(28, 28, 28, 0.80) 56%,
      rgba(28, 28, 28, 0.42) 100%
    );
  }
  .content {
    position: relative;
    z-index: 2;
    padding: 52px 64px 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 820px;
  }
  .logo-box {
    display: inline-flex;
    align-items: center;
    background: #FFFFFF;
    padding: 18px 28px;
    border-radius: 10px;
    width: fit-content;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
  }
  .logo-box img {
    height: 76px;
    width: auto;
    display: block;
  }
  .accent-bar {
    width: 72px;
    height: 5px;
    background: #8B1E1E;
  }
  .eyebrow {
    font-family: "Poppins", sans-serif;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #F7F7F7;
    opacity: 0.88;
  }
  h1 {
    font-family: "Bebas Neue", sans-serif;
    font-size: 76px;
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: 0.03em;
    color: #FFFFFF;
    text-transform: uppercase;
  }
  .subtitle {
    font-family: "Poppins", sans-serif;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.4;
    color: rgba(247, 247, 247, 0.9);
  }
  .footer-bar {
    position: relative;
    z-index: 2;
    height: 74px;
    background: #8B1E1E;
    padding: 0 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #FFFFFF;
    font-family: "Poppins", sans-serif;
    font-size: 22px;
  }
  .footer-bar strong {
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .footer-bar span {
    font-weight: 400;
    opacity: 0.92;
  }
</style>
</head>
<body>
  <div class="card">
    <img class="bg" src="${heroDataUri}" alt="">
    <div class="overlay"></div>
    <div class="content">
      <div class="logo-box">
        <img src="${logoDataUri}" alt="Frigorífico Guarienti">
      </div>
      <div class="accent-bar"></div>
      <div class="eyebrow">Indústria Frigorífica · Inspeção SISBI-POA</div>
      <h1>Abate para Terceiros, Lojas Próprias e Carnes</h1>
      <p class="subtitle">Força industrial, segurança sanitária nacional e procedência gaúcha.</p>
    </div>
    <div class="footer-bar">
      <strong>frigorificoguarienti.com.br</strong>
      <span>Boa Vista do Buricá — RS</span>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(tmpHtml, html, "utf8");

const chromeCandidates = [
    process.env.CHROME_PATH,
    "google-chrome",
    "chromium",
    "chromium-browser"
].filter(Boolean);

let rendered = false;
for (const bin of chromeCandidates) {
    try {
        execFileSync(bin, [
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--window-size=1200,630",
            "--virtual-time-budget=4000",
            `--screenshot=${tmpPng}`,
            `file://${tmpHtml}`
        ], { stdio: "pipe" });
        rendered = true;
        break;
    } catch (_) {
        // try next browser binary
    }
}

if (!rendered) {
    console.error("Erro: Chrome/Chromium não encontrado para renderizar a imagem Open Graph.");
    process.exit(1);
}

// Convert PNG to progressive optimized JPEG (1200x630)
execFileSync("python3", [
    "-c",
    `from PIL import Image; im = Image.open(${JSON.stringify(tmpPng)}).convert("RGB"); im.save(${JSON.stringify(outJpg)}, "JPEG", quality=88, optimize=True, progressive=True)`
]);

fs.rmSync(tmpHtml, { force: true });
fs.rmSync(tmpPng, { force: true });

const sizeKb = (fs.statSync(outJpg).size / 1024).toFixed(1);
console.log(`Gerado ${path.relative(rootDir, outJpg)} (1200x630, ${sizeKb} KB)`);
