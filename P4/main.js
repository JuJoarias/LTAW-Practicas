//-- Cargar el módulo de electron
const electron = require('electron');
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;
let n_clientes = 0;
let comandos = ['/help', '/list', '/hello', '/date']
let win = null;

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /*
  SERVER
  */
  const app = express();
  //-- Crear un servidor, asosiaco a la App de express
  const server = http.Server(app);

  //-- Crear el servidor de websockets, asociado al servidor http
  const io = socket(server);

  app.use('/', express.static(__dirname +'/'));

  //-- El directorio publico contiene ficheros estáticos
  app.use(express.static('public'));


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
      io.emit('message', `Server: Usuario "`+  username+  `" desconectado`); 
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

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /*
  GUI
  */
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("main.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('print', "MENSAJE ENVIADO DESDE PROCESO MAIN");
  });

  //-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
  //-- renderizado. Al recibirlos se escribe una cadena en la consola
  electron.ipcMain.handle('test', (event, msg) => {
    console.log("-> Mensaje: " + msg);
  });

});