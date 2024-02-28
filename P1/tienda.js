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
    //-- /workspaces/LTAW-Practicas/P1/ -- Si trabajo desde casa este es el path si tengo nodejs en este portatil
    //-- /home/alumnos/juanjose/LTAW/LTAW-Practicas/P1/ -- si trabajo desde la uni este es el path
  //-- Indicamos que se ha recibido una petición probando
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
