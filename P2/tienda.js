const http = require('http');
const fs = require('fs');
const path = require('path');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    const url = req.url === '/' ? 'index.html' : req.url;
    const filePath = path.join(__dirname, url);
    const extension = path.extname(filePath);
    let contentType = 'text/html';
  console.log("Petición recibida!");

  switch (extension) {
    case '.html':
        contentType = 'text/html';
        break;
    case '.jpg':
        console.log('cambio a imagen');
        contentType = 'image/jpg';
        break;
    case '.webp':
        console.log('cambio a imagen');
        contentType = 'image/webp';
        break;
    case '.css':
        console.log('cambio a css');
        contentType = 'text/css';
        break;
    case '.mp3':
        console.log('audio')
        contentType = 'audio/mpeg';
        break;
  }

  fs.readFile(filePath, (err, Content) => {
    if (err) {
        if (err.code == 'ENOENT') {
            fs.readFile(path.join(__dirname, '404.html'), (err, Content) => {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(Content, 'utf-8');
            });
        } else {
            res.writeHead(500);
            console.log("Fallo en el servidor!");
            res.end('Error interno del servidor');  
        }
    } else {
        res.writeHead(200, { 'Content-Type': contentType });
        console.log('Peticion enviada');
        res.end(Content, 'utf-8');
    } 
    });
}); 

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);
