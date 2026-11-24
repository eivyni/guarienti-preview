const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const rootDir = path.resolve(__dirname, "..");

async function build() {
    const cssSrc = path.join(rootDir, "style.css");
    const cssOut = path.join(rootDir, "style.min.css");
    const jsSrc = path.join(rootDir, "script.js");
    const jsOut = path.join(rootDir, "script.min.js");

    const cssInput = fs.readFileSync(cssSrc, "utf8");
    const cssResult = await esbuild.transform(cssInput, {
        loader: "css",
        minify: true,
        target: ["chrome90", "firefox90", "safari14"]
    });
    fs.writeFileSync(cssOut, cssResult.code, "utf8");

    const jsInput = fs.readFileSync(jsSrc, "utf8");
    const jsResult = await esbuild.transform(jsInput, {
        loader: "js",
        minify: true,
        target: ["es2020"]
    });
    fs.writeFileSync(jsOut, jsResult.code, "utf8");

    const fmt = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
    console.log(`style.css  (${fmt(Buffer.byteLength(cssInput))}) -> style.min.css  (${fmt(Buffer.byteLength(cssResult.code))})`);
    console.log(`script.js  (${fmt(Buffer.byteLength(jsInput))}) -> script.min.js  (${fmt(Buffer.byteLength(jsResult.code))})`);
}

build().catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
});
