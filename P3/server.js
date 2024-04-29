//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const cookieParser = require('cookie-parser');

const PUERTO = 9090;
let n_clientes = 0;
let comandos = ['/help', '/list', '/hello', '/date']

//-- Crear una nueva aplciacion web
const app = express();
app.use(cookieParser());

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));


//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  // Parsear la URL para obtener el valor del parámetro username
  const url = socket.handshake.headers.referer;
  console.log('URL actual:', url);
  const urlParams = new URLSearchParams(new URL(url).search);
  const username = urlParams.get('username');
  console.log('Nombre de usuario:', username);
  
  n_clientes += 1
  console.log('** NUEVA CONEXIÓN **'.yellow);
  io.emit('message', `Server: Usuario "${username}" conectado`); 
  // Obtener la URL actual del socket


  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    n_clientes -=1
    io.emit('message', `Server: Usuario desconectado`); 
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido: " + msg);

    //const username = 'anonimus'

    console.log('El username es: ' + username)
    // compruebo si es un comando
    if (comandos.includes(msg)){
      console.log('Es un comando')

      if (msg == `/list`){
        mensaje = 'Numero de usuarios conectados es: ' + n_clientes
        
      } else if (msg == `/help`){
        mensaje = 'Los comandos permitidos son: '+comandos

      } else if(msg == `/hello`){
        mensaje = 'Hola de parte del servidor'

      } else {
        let date = new Date()

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        mensaje = `Hoy es: ${day}-${month}-${year}`
      }
      // mando el resultado solo al cliente que lo mando 
      socket.emit('message', `Server: ${mensaje}`);
      return;
    }
// para lo del user mirar con socket.emit
    //-- Reenviarlo a todos los clientes conectados si no es un comando
    io.emit('message', `${username}: ${msg}`);
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);