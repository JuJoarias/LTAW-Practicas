//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
var sonido = document.getElementById("miSonido");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

function scrollDown() {
  display.scrollTop = display.scrollHeight;
}

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
  sonido.play();
  scrollDown();
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}
