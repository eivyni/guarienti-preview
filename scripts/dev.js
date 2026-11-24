const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT) || 3000;

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(reqUrl.pathname);
    if (pathname === "/") pathname = "/index.html";

    const safePath = path.normalize(path.join(rootDir, pathname));
    if (!safePath.startsWith(rootDir)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
            return;
        }
        const ext = path.extname(safePath).toLowerCase();
        res.writeHead(200, {
            "Content-Type": mimeTypes[ext] || "application/octet-stream",
            "Cache-Control": "no-cache"
        });
        fs.createReadStream(safePath).pipe(res);
    });
});

server.listen(port, "127.0.0.1", () => {
    console.log(`Servidor local ativo em http://127.0.0.1:${port}`);
});
