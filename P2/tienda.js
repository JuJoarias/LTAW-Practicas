const http = require('http');
const fs = require('fs');
const path = require('path');
tienda_json = fs.readFileSync('P2/tienda.json','utf-8')
const usuarios = JSON.parse(tienda_json).usuarios;
const productos = JSON.parse(tienda_json).productos;
indice = fs.readFileSync("P2/index.html", "utf-8")
//console.log(usuarios[0].usuario)
tienda = JSON.parse(tienda_json)
//console.log("Usuario en la tienda: " + tienda.usuarios[0].usuario);

//-- Definir el puerto a utilizar
const PUERTO = 9090;

function ShowDescription(){
    let htmlProductos = '';
    productos.forEach(producto => {
      htmlProductos += `
      ${producto.nombre},`
    });
    return htmlProductos;
}

function get_user(req){
    //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split("&");
    
    //-- Variable para guardar el usuario
    let user;
    let password;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'username') {
        user = valor;
      } else if (nombre.trim() === 'password'){
        password = valor;
      }
    });
    //-- Si la variable user no está asignada
    //-- se devuelve null
    return [user, password] || null;
  }
}

function ok200description(res,tipo,user){
    const producto1=indice.replace('<!-- PRODUCT1_PLACEHOLDER -->', ShowDescription().split(",")[0]);
    const producto2=producto1.replace('<!-- PRODUCT2_PLACEHOLDER -->', ShowDescription().split(",")[1]);
    const producto3=producto2.replace('<!-- PRODUCT3_PLACEHOLDER -->', ShowDescription().split(",")[2]);
    
    
     if (user) {
       
      content = producto3.replace('<!--HOLA USUARIO-->', `<h3>Bienvenido: ${user[0]}</h3>`);
      res.writeHead(200, {'Content-Type': tipo});
      res.write(content);
      res.end();
     }  
     else{
      res.writeHead(200, {'Content-Type': tipo});
      res.write(producto3);
      res.end();
     }
    
};

function ok200(res,data,tipo){

    res.writeHead(200, {'Content-Type': tipo});
    res.write(data);
    res.end();
  
  
};

//-- Crear el servidor
const server = http.createServer((req, res) => {
    const url = req.url === '/' ? 'index.html' : req.url;
    const filePath = path.join(__dirname, url);
    const extension = path.extname(filePath);
    const myURL = new URL(req.url, 'http://' + req.headers['host']);  
    let recurso = myURL.pathname;
    recurso = recurso.slice(1);
    let contentType = 'text/html';
    let user = get_user(req);
    
    
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

    switch (recurso) {
      case '':
            console.log("Main page");
            break;
      case 'productos':
            console.log("Peticion de Productos!")
            contentType = "application/json";

            //-- Leer los parámetros
            let param1 = myURL.searchParams.get('param1');

            param1 = param1.toUpperCase();

            console.log("  Param: " +  param1);

            let result = [];
            
            for (let prod of productos) {
                
                //prod = ShowDescription().split(",")[i]
                console.log('Prod: '+prod.nombre)
                //-- Pasar a mayúsculas
                prodU = prod.nombre.toUpperCase();
                
                //-- Si el producto comienza por lo indicado en el parametro
                //-- meter este producto en el array de resultados
                if (prodU.startsWith(param1)) {
                    result.push(prod.nombre);
                }
                
            }
            console.log(result);
            content = JSON.stringify(result);
            break;

        case 'cliente.js':
            //-- Leer fichero javascript
            console.log("recurso: " + recurso);
            recurso = `P2/` + recurso;
            fs.readFile(recurso, 'utf-8', (err,data) => {
                if (err) {
                    console.log("Error: " + err)
                    return;
                } else {
                  console.log('Todo ok')
                  res.setHeader('Content-Type', 'application/javascript');
                  res.write(data);
                  res.end();
                }
            });
            
            return;
            
    }

    if (req.url == '/log_in' ) {
        
        Content = indice;
        let body="";
        //-- Si hay datos en el cuerpo, se imprimen
        req.on('data', (cuerpo) => {       
          //-- Los datos del cuerpo son caracteres
          body += cuerpo.toString();
          
          console.log(`${cuerpo}`);          
        }); 
        
        req.on('end', () => {
            // Generar la respuesta
            const formData= new URLSearchParams(body);
            const username = formData.get('username')
            const password = formData.get('password')
    
            console.log("Nombre usuario:", username);
            console.log("Contraseña:", password);
            const userExists = usuarios.find(user => user.usuario === username && user.password === password);
            
            if (userExists) {
              res.setHeader('Set-Cookie', `username=${username}&password=${password}`);
              res.writeHead(200, { 'Content-Type': 'text/html' });
              // PODEMOS CAMBIARLO POR UN HTML CREADO 
    
              res.write('<h1>Bienvenido ' + username + '</h1>');
              res.write('<a href="/">Pagina Principal</a>'); 
              res.end();
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write('<h1>Error 404: Usuario no encontrado</h1>');
            res.write('<a href="/">Volver a intentarlo</a>'); // Agregar enlace de regreso
            res.end();
          }
    
        });

    } else {
        fs.readFile(filePath, function(err,data) {
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
                
                if(req.url === "/"|| req.url==="/index.html")
                {
                ok200description(res,contentType,user);
                
                }
                else{
                ok200(res,data,contentType);
                }
            } 
        });
    }
}); 

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);