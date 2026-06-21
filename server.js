// Servidor local ultraligero en Node.js para servir el Prode Familiar
// Autor: Antigravity

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Normalizar la URL
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Evitar accesos fuera del directorio
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Acceso denegado');
    return;
  }

  // Leer archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Archivo no encontrado');
      } else {
        res.statusCode = 500;
        res.end(`Error del servidor: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏆 PRODE FAMILIAR 2026 INICIADO CON ÉXITO!`);
  console.log(`👉 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
