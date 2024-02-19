const http = require('http');
const fs = require('fs');
const path = require('path');

//-- Definir el puerto a utilizar
const PUERTO = 9090;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    const filePath = path.join("/workspaces/LTAW-Practicas/P1/", 'index.html');
    //-- /workspaces/LTAW-Practicas/P1/ -- Si trabajo desde casa este es el path si tengo nodejs en este portatil
    //-- /home/alumnos/juanjose/LTAW/LTAW-Practicas/P1/ -- si trabajo desde la uni este es el path
  //-- Indicamos que se ha recibido una petición probando2
  console.log("Petición recibida!");

  fs.readFile(filePath, (err, data) => {
    if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        console.log("Fallo en el servidor!");
        res.end('Error interno del servidor');
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    }
    });
}); 

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);
