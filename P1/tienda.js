const http = require('http');
const fs = require('fs');
const path = require('path');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // Si la URL solicitada es la raíz, sirve el archivo HTML
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log("Cargo datos")
                res.end(data);
            }
        });
    } else if (req.url === '/home/alumnos/juanjose/LTAW/LTAW-Practicas/P1/halcon_milenario.jpg') {
        // Si la URL solicitada es la imagen, sirve la imagen
        const imagePath = path.join(__dirname, 'halcon_milenario.jpg'); // Ruta a tu imagen
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.log("Fallo al cargar la imagen")
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
            } else {
                console.log("Cargo imagen")
                res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // Cambia el tipo de contenido según el formato de tu imagen
                res.end(data);
            }
        });
    } else {
        // Si la URL solicitada no coincide con ninguna ruta conocida, responde con un 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Archivo no encontrado');
    }
}); 

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);
