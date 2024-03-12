const http = require('http');
const fs = require('fs');
const path = require('path');
tienda_json = fs.readFileSync('P2/tienda.json','utf-8')
index = fs.readFileSync("P2/index.html", "utf-8")
tienda = JSON.parse(tienda_json)
//console.log("Productos en la tienda: " + tienda.productos[1].nombre);

//-- Definir el puerto a utilizar
const PUERTO = 9090;
const RESPUESTA = fs.readFileSync('P2/halcon.html','utf-8');

//-- Crear el servidor
const server = http.createServer((req, res) => {
    const url = req.url === '/' ? 'index.html' : req.url;
    const filePath = path.join(__dirname, url);
    const extension = path.extname(filePath);
    let contentType = 'text/html';

  switch (extension) {
    case '.html':
        contentType = 'text/html';
        break;
    case '.jpg':
        contentType = 'image/jpg';
        break;
    case '.webp':
        contentType = 'image/webp';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.mp3':
        contentType = 'audio/mpeg';
        break;
  }
    if (req.url === '/log_in' ) {
        
        //-- Si hay datos en el cuerpo, se imprimen
        req.on("data", (cuerpo) => {
            console.log('entro')
            //-- Los datos del cuerpo son caracteres
            req.setEncoding('utf8');
            console.log(`Cuerpo (${cuerpo.length} bytes)`)
            console.log(` ${cuerpo}`);
        });

        req.on('end', ()=> {
            //-- Generar respuesta
            res.setHeader('Content-Type', "text/html");
            res.write(RESPUESTA);
            res.end()
        });
    } else {
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
                res.end(Content, 'utf-8');
            } 
        });
    }
}); 

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);
