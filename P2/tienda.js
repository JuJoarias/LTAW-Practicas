const http = require('http');
const fs = require('fs');
const path = require('path');
tienda_json = fs.readFileSync('P2/tienda.json','utf-8')
LOGIN = fs.readFileSync("P2/log_in.html", "utf-8")
indice = fs.readFileSync("P2/index.html", "utf-8")

tienda = JSON.parse(tienda_json)
//console.log("Usuario en la tienda: " + tienda.usuarios[0].usuario);

//-- Definir el puerto a utilizar
const PUERTO = 9090;
//const RESPUESTA = fs.readFileSync('P2/halcon.html','utf-8');

function get_user(req){
    //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split("&");
    
    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'username') {
        user = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user || null;
  }
}

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
    };
    if (req.url == '/log_in' ) {
        
        //-- Si hay datos en el cuerpo, se imprimen
        req.on('data', (cuerpo) => {       
          //-- Los datos del cuerpo son caracteres
          
          req.setEncoding('utf8');
          console.log(`Cuerpo (${cuerpo.length} bytes)`)
          console.log(`${cuerpo}`);
          res.setHeader('Set-Cookie',`${cuerpo}`);// funciona a la segunda, de primeras da undefined asi que toca volver atras y darle submit de nuevo para que funcione
          let user = get_user(req);
          
          if (user === tienda.usuarios[0].usuario || user === tienda.usuarios[1].usuario) {

            //-- Añadir a la página el nombre del usuario
            
            Content = LOGIN.replace("HTML_EXTRA", "<h2>Usuario: " + user + "</h2>");
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(Content);
            res.end();
            } else {
                Content = LOGIN.replace("<h1>LOG IN CORRECTO</h1>", "<h1>LOG IN INCORRECTO</h1>\n <h2>Usuario: " + user + " No valido</h2>");
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(Content);
                res.end();
              }
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
                //console.log(user)
                //if (user){
                 //   Content = indice.replace('<button class="btn" onclick="toggleLogin()">Login</button>', 'Bienvenido '+ user)
                //}
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(Content, 'utf-8');
            } 
        });
    }
}); 

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);