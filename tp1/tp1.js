

//estados  

let CAMINANDO = 0;
let DIALOGO = 1;
let PELEA = 2;

//arrays sin dimension
let framesCaminar = [];
let framesDialogo = [];
let framesPelea = [];

//fondo
let fondoCiudad;

let estadoP;
let frame;   

//posicion pj 
let posX, posY;
let escala = 2;  //let escala = 4


//distinta velocidad por estado
let velCaminar = 160;
let velDialogo = 260;
let velPelea = 170;
let marcaTiempo = 0;

let pasoCaminata = 22;  

//espera al terminar una animacion de una pasada
let contadorEspera = 0;
let esperaFinal = 25;

//fondo solo avanza mientras el personaje camina
let fondoX = 0;
let velocidadFondo = 14;
let anchoFondoEscalado; 

function preload() {
  cargarImagenes(0, 12, framesCaminar);   // 0-11 animacion caminar
  cargarImagenes(12, 18, framesDialogo);  // 12-17 animacion de dialogo
  cargarImagenes(18, 27, framesPelea);    // 18-26 animacion de pelea

//fondo
  fondoCiudad = loadImage("assets/fondo_ciudad.png");
}

function setup() {
  createCanvas(800, 600);
 
  anchoFondoEscalado = (height / fondoCiudad.height) * fondoCiudad.width;
  reiniciarSistema();
}

function draw() {
  dibujarFondo();

  // maquina de estados con switch
  switch (estadoP) {
  case CAMINANDO:
    actualizarCaminando();
    break;
  case DIALOGO:
    actualizarDialogo();
    break;
  case PELEA:
    actualizarPelea();
    break;
  }
  
}

// funciones propias 
function cargarImagenes(inicio, fin, arrayDestino) {
  for (let i = inicio; i < fin; i++) {
    arrayDestino.push(loadImage("assets/personaje_" + i + ".png"));
  }
}


function dibujarPersonaje(frames, indice, x, y) {
  let img = frames[indice];
  let w = img.width * escala;
  let h = img.height * escala;
  image(img, x, y, w, h);
}

function actualizarFrame(indiceActual, totalFrames, velocidadMs, enLoop) {
  if (millis() - marcaTiempo < velocidadMs) {
    return indiceActual;
  }
  marcaTiempo = millis();
  if (enLoop) {
    indiceActual = indiceActual + 1;
    if (indiceActual >= totalFrames) {
      indiceActual = 0;
    }
  } else {
    indiceActual = indiceActual + 1;
    if (indiceActual > totalFrames - 1) {
      indiceActual = totalFrames - 1;
    }
  }
  return indiceActual;
}

//si una animacion de una sola pasada ya llego a lo ultimo
function animacionTerminada(indiceActual, totalFrames) {
  if (indiceActual >= totalFrames - 1) {
    return true;
  } else {
    return false;
  }
}

function dibujarFondo() {
  image(fondoCiudad, fondoX, 0, anchoFondoEscalado, height);
  image(fondoCiudad, fondoX + anchoFondoEscalado, 0, anchoFondoEscalado, height);

}

//desde cero 
function cambiarEstado(nuevoEstado) {
  estadoP = nuevoEstado;
  frame = 0;
  contadorEspera = 0;
  marcaTiempo = millis();

  if (nuevoEstado == CAMINANDO) {
 
    posX = -60;
    fondoX = 0;
  }
}

function reiniciarSistema() {
  estadoP = CAMINANDO;
  frame = 0;
  contadorEspera = 0;
  posX = -60;
  posY = 420; //  posY = 350; 
  fondoX = 0;
  marcaTiempo = millis();
}

//logica por estado

function actualizarCaminando() {
  let frameAnterior = frame;
  frame = actualizarFrame(frame, framesCaminar.length, velCaminar, true);
  if (frame != frameAnterior) {
    posX = posX + pasoCaminata;
    fondoX = fondoX - velocidadFondo;
if (fondoX <= -anchoFondoEscalado) {
  fondoX = 0;
}

  }
  dibujarPersonaje(framesCaminar, frame, posX, posY);

  if (posX >= width / 2) {
    posX = width / 2;
    cambiarEstado(DIALOGO);
  }
}

function actualizarDialogo() {
//dialogo una sola vez
  if (animacionTerminada(frame, framesDialogo.length) == false) {
    frame = actualizarFrame(frame, framesDialogo.length, velDialogo, false);
  } else {
    contadorEspera = contadorEspera + 1;
    if (contadorEspera > esperaFinal) {
      cambiarEstado(PELEA);
    }
  }
  dibujarPersonaje(framesDialogo, frame, posX, posY);
}

function actualizarPelea() {
  //pelea despues caminando
  if (animacionTerminada(frame, framesPelea.length) == false) {
    frame = actualizarFrame(frame, framesPelea.length, velPelea, false);
  } else {
    contadorEspera = contadorEspera + 1;
    if (contadorEspera > esperaFinal) {
      cambiarEstado(CAMINANDO);
    }
  }
  dibujarPersonaje(framesPelea, frame, posX, posY);
}


//reinicio

function keyPressed() {
  if (key == "r" || key == "R") {
    reiniciarSistema();
  }
}
