// tpfinal - Aventura grafica interactiva Lucia Torres Macarena Milagros Segura Alpaca

// ajustes del juego
let carpeta = "data/";         
let titulo = "LA ÚLTIMA PISTA";
let radioClic = 35;              //que tan grande es la zona donde se clickea cada pista
let inicioBueno = 2;       
let segundosLapiz = 2;      //lapiz despues de elegir una opcion
let velocidadCaramel = 160;         //caramelldansen

// zoom 
let zombieX = 400;
let zombieY = 190;
let zoomMaximo = 1.9;          //cuanto se agranda la imagen al final (1esnada)
let aceleracionZoom = 0.00004;
let oscuridadMaxima = 190;     //0 no oscurece, 255 es negro total
let mostrarCoordenadas = false;  

//musica iglesia
let volEspiritualInicio = 0.1;   
let volEspiritualFinal = 0.25;   
let subidaEspiritual = 0.00008;     

//novela visual1
let imagen = [];
// imagen[0]casa, imagen[1] puerta cerrada, imagen[2] puerta abierta, imagen[3] puerta abierta difuminada
let imgDetective;
let imgDetective2; // la detective hablando por telefono
let imgProta;
let click;
let ring;
let textos = [];
let pantalla = 0;

let estadoNovela = 0;
let estadoEscena = 1;
let estadoPista = 2;
let estadoFinal = 3;
let estadoCreditos = 4;

//estado del juego
let estado = estadoNovela;        
let pistaActual = 0;           //de 1 a 5 cuando se esta en una pista
let indice = 0;              
let finalActual = "";       //el final que se esta mostrando
let secuenciaImgs = [];
let secuenciaTextos = [];
let decisiones = [];           
let aviso = "";
let framesAviso = 0;
let letras = 0;                //para que el texto se escriba solo
let largoTexto = 0;
let yCreditos = 450;
let imgsCaramel = [];         //caramelldansen frames
let ordenCaramel = [0, 1, 2, 3, 4, 3, 2, 1];
let frameCaramel = 0;
let marcaCaramel = 0;
let zoomSusto = 1;          
let velZoom = 0;

// imagenes y sonidos
let imagenFondo, imgSuicidio;
let imgsArchivado = [];
let imgsBueno = [];
let imgsSuicidio = [];
let textosBuenoSec = [];
let musicaFondo, sonidoLapiz;
let sonidoLadrillo, sonidoSusto, sonidoPuerta, musicaEspiritual;
let marcaLapiz = 0;
let volEspiritual = volEspiritualInicio;

//textos de las pistas
let textosPistas = [
  "pastillas: El frasco en el estante está casi vacío... ¿Un exceso voluntario para calmar la angustia o alguien se encargó de facilitar la dosis exacta? No hay notas de despedida, solo un silencio inquietante.",
  "inodoro: Hay rastros de un impacto violento en el borde de la cerámica. ¿Una caída accidental por mareo repentino... o la cabeza fue golpeada con fuerza antes de llevarla a la bañera?",
  "huellas: Pisadas ajenas y sutiles marcas en la entrada del baño. Las huellas no coinciden con las de la víctima... Alguien estuvo observando de cerca o intentó limpiar su rastro.",
  "cortaduras: Pequeñas incisiones en los brazos que desconciertan. A simple vista parecen marcas defensivas o autolesiones... pero los ángulos sugieren intervención ajena.",
  "secador: El secador reposa peligrosamente dentro del agua con el enchufe conectado. ¿Un descuido fatal en medio del vapor... o una puesta en escena milimétrica para simular un accidente?"
];

//centro de cada pista
let zonasX = [530, 716, 650, 237, 450];   //pastillas, inodoro, huellas, cortaduras, secador
let zonasY = [97, 274, 402, 304, 282];

//texto imagen de cada final
let textosArchivado =[
  "Decidiste no profundizar. Las pistas quedaron sin examinar y el caso se cierra por falta de elementos.",
  "**Ventana rompiéndose**",   
  "...",
  "¡¿Qué?!",
  "**Se abre la puerta**"   //aca suena la puerta
];

let textosBueno = [   
  "Volvés a mirar la habitación. Con cada pista, la versión del suicidio se vuelve más difícil de creer.",
  "Las pruebas coinciden: alguien más estuvo allí y quiso que pareciera algo distinto.",
  "Las marcas, las huellas y los objetos fuera de lugar apuntan a una tercera persona.",
  "Todo se oscurece mientras la verdad empieza a salir a la luz.",
  "",   //pt5 sin texto
  "",   //pt6 sin texto
  "",   //pt7 sin texto
  "“Gracias por escucharme, detective. Gracias por liberar mi alma. Ahora, por fin, puedo descansar.”"   // pt8 habla el angel
];

let textosSuicidio = [
  "",  //sin texto la escena del zombie va sola y si
  "Esta historia es ficción. Si vos o alguien cercano la está pasando mal, hablar con alguien de confianza puede ayudar. En Argentina: línea 135 (CABA y GBA) o 0800 345 1435."
];

let creditosTxt = [
  "CRÉDITOS",
  "",
  titulo,
  "Aventura gráfica interactiva",
  "",
  "Autoras",
  "Macarena Milagros Segura Alpaca",
  "Lucía Torres",
  "",
  "Obra original",
  "Macarena Milagros Segura Alpaca",
  "Lucía Torres",
  "",
  "Materia",
  "Programación para medios interactivos",
  "orientada a las tecnologías web",
  "Comisión 2",
  "",
  "Docente",
  "Matías Jauregui Lorda",
  "",
  "Ilustraciones",
  "Fondos de la casa: generados con IA",
  "Resto de dibujos y assets:",
  "Lucía Torres y",
  "Macarena Milagros Segura Alpaca",
  "",
  "Gracias por jugar",
  ":3"
];
let creditosTam = [34, 14, 26, 16, 14, 22, 18, 18, 14, 22, 16, 16, 14, 22, 16, 16, 16, 14, 22, 16, 14, 22, 16, 16, 16, 16, 14, 20, 28];

// botones (x y ancho alto y lo que dice)
let btnIgnorar = [650, 20, 130, 40, "Ignorar pistas"];
let btnAsesinato = [580, 335, 190, 40, "Asesinato"];
let btnSuicidio = [580, 385, 190, 40, "Suicidio"];
let btnContinuar = [570, 387, 180, 32, "Continuar"];
let btnInicio = [570, 345, 180, 32, "Jugar de nuevo"];
let btnCreditosFinal = [570, 387, 180, 32, "Créditos"];
let btnVolver = [340, 400, 120, 36, "Volver"];

function preload() {
  //novela visual
  imagen[0] = loadImage('data/Casa_abandonada_entre_la_niebla.png');
  imagen[1] = loadImage('data/Casa_abandonada_al_anochecer.png');
  imagen[2] = loadImage('data/Entrada_Abandonada_al_Anochecer.png');
  imagen[3] = loadImage('data/Entrada_difuminada.png');
  imgDetective = loadImage('data/detective1.png');
  imgDetective2 = loadImage('data/detective2.png');
  imgProta = loadImage('data/protagonista.png');

  //juego
  imagenFondo = loadImage(carpeta + "fondo.png");
  imgSuicidio = loadImage(carpeta + "finalsuicidio.png");

  for (let i = 1; i <= 5; i++) {
    imgsArchivado.push(loadImage(carpeta + "finalarchivadopt" + i + ".png"));
  }
  for (let i = inicioBueno; i <= 8; i++){
    imgsBueno.push(loadImage(carpeta + "finalbuenopt" + i + ".png"));
  }

  imgsCaramel.push(loadImage(carpeta + "caramellpt1.png"));
  imgsCaramel.push(loadImage(carpeta + "caramellpt2.png"));
  imgsCaramel.push(loadImage(carpeta + "caramellpt3.png"));
  imgsCaramel.push(loadImage(carpeta + "caramellpt4.png"));
  imgsCaramel.push(loadImage(carpeta + "caramelpt5.png"));    
}

function setup() {
  createCanvas(800, 450);
  textWrap(WORD);
  parrafos();
  textFont('Consolas');
  textSize(18);

 
  imagenFondo.resize(800, 450);
  imgSuicidio.resize(800, 450);
  for (let i = 0; i < imgsArchivado.length; i++) {
    imgsArchivado[i].resize(800, 450);
  }
  for (let i = 0; i < imgsBueno.length; i++) {
    imgsBueno[i].resize(800, 450);
  }

  for (let i = inicioBueno - 1; i < textosBueno.length; i++) {
    textosBuenoSec.push(textosBueno[i]);
  }

  for (let i = 0; i < textosSuicidio.length; i++) {
    imgsSuicidio.push(imgSuicidio);
  }

 

  //x si falta algun sonido para que funque
  click = loadSound(carpeta + "click.wav");
  click.setVolume(0.5);
  ring = loadSound(carpeta + "ring.wav");
  ring.setVolume(1.0);
  musicaFondo = loadSound(carpeta + "musica.mp3");
  musicaFondo.setVolume(0.4);
  sonidoLapiz = loadSound(carpeta + "lapiz_escribiendo.mp3");
  sonidoLapiz.setVolume(0.8);
  sonidoLadrillo = loadSound(carpeta + "ladrillo_ventana.mp3");
  sonidoLadrillo.setVolume(0.9);
  sonidoSusto = loadSound(carpeta + "grito.mp3");
  sonidoSusto.setVolume(1.0);
  sonidoPuerta = loadSound(carpeta + "puerta.mp3");
  sonidoPuerta.setVolume(0.9);
  musicaEspiritual = loadSound(carpeta + "musicaespiritual.mp3");
  musicaEspiritual.setVolume(volEspiritualInicio);

  reiniciarJuego();
}

function draw() {
  background(20);

  //la musica empieza despues de clickear
  if ((estado == estadoEscena || estado == estadoPista) && audioActivo()) {
    iniciarMusica();
  }

  switch (estado){
  case estadoNovela:
    novelaVisual();
    break;
  case estadoEscena:
    dibujarEscena();
    break;
  case estadoPista:
    dibujarPista();
    break;
  case estadoFinal:
    dibujarFinal();
    break;
  case estadoCreditos:
    dibujarCreditos();
    break;
  }

  if (sonidoLapiz.isPlaying() && millis() - marcaLapiz > segundosLapiz * 1000) {
    sonidoLapiz.stop();
  }

  if (musicaEspiritual.isPlaying() && volEspiritual < volEspiritualFinal) {
    volEspiritual = volEspiritual + subidaEspiritual;
    musicaEspiritual.setVolume(volEspiritual);
  }
}

//novela visual2

function novelaVisual(){
  //p0 casa
  if (pantalla===0) {
    miFondo(imagen[0]);
    cajaTexto("PROTAGONISTA", textos[0]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p1 la puerta cerrada
  if (pantalla===1) {
    miFondo(imagen[1]);
    cajaTexto("PROTAGONISTA", textos[1]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p2
  if (pantalla===2) {
    miFondo(imagen[1]);
    cajaTexto("", textos[2]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p3 se abre la puerta
  if (pantalla===3) {
    miFondo(imagen[2]);
    cajaTexto("", textos[3]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p4 aparece la detective
  if (pantalla===4) {
    miFondo(imagen[3]);
    miPersonaje(imgDetective);
    cajaTexto("DETECTIVE", textos[4]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p5 habla el protagonista
  if (pantalla===5) {
    miFondo(imagen[3]);
    miPersonaje(imgProta);
    cajaTexto("PROTAGONISTA", textos[5]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p6
  if (pantalla===6) {
    miFondo(imagen[3]);
    miPersonaje(imgDetective);
    cajaTexto("DETECTIVE", textos[6]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p7 suena el celular
  if (pantalla===7) {
    miFondo(imagen[3]);
    miPersonaje(imgDetective2);
    cajaTexto("", textos[7]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p8 por telefono
  if (pantalla===8) {
    miFondo(imagen[3]);
    miPersonaje(imgDetective2);
    cajaTexto("DETECTIVE", textos[8]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p9
  if (pantalla===9){
    miFondo(imagen[3]);
    miPersonaje(imgDetective);
    cajaTexto("DETECTIVE", textos[9]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p10 habla el protagonista
  if (pantalla===10) {
    miFondo(imagen[3]);
    miPersonaje(imgProta);
    cajaTexto("PROTAGONISTA", textos[10]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p11
  if (pantalla===11){
    miFondo(imagen[3]);
    miPersonaje(imgDetective);
    cajaTexto("DETECTIVE", textos[11]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
  //p12 se va la detective lleva al juego
  if (pantalla===12) {
    miFondo(imagen[2]);
    cajaTexto("", textos[12]);
    miBoton(670, 405, 110, 32, "Siguiente");
  }
}

function parrafos() {
  textos = [
    '(Acabo de llegar al trabajo. Hoy empiezo como asistente de la detective y dicen que no tiene paciencia con los novatos...)',
    '(Es acá. Estoy muy nervioso, ¿y si hago algo mal el primer día?)',
    '(Se escuchan pasos rápidos del otro lado de la puerta...)',
    '(...)',
    'Vení, no tenemos toda la noche. Esto es lo que quedó de la escena, tratá de no tocar nada hasta que yo te diga.',
    '¿Qué fue lo que pasó acá?',
    'Eso es lo que tenemos que averiguar. Encontraron el cuerpo de Lucía Torres esta tarde, nadie escuchó nada, nadie vio nada. Como siempre.',
    'Suena el celular de la detective. Ella lo mira y atiende.',
    'Sí, decime. ¿Cuándo? No, no puede ser ahora. ¿En serio? Uff... está bien.',
    'Pibe, mirá, me tengo que ir, es algo que no puede esperar.',
    '¿Cómo que te vas? Recién llegamos.',
    'Justo por eso te contrataron, ¿no? Andá revisando la habitación, objeto por objeto, ahí vas a encontrar lo que necesitás. Cualquier cosa rara, cualquier detalle, anotalo todo.',
    '(La detective se va, suspirando de mal humor cerca tuyo. Esperás un poco aturdido y pasás dentro de la casa, directo a la escena del crimen)'
  ];
}

function clicNovela() {
  if (overMouse(670, 405, 110, 32)) {
    if (pantalla == 12) {
      // ultima pantalla de la novela
      sonarEfecto(click);
      cambiarEstado(estadoEscena);
    } else {
      pantalla = pantalla + 1;
      if (pantalla == 7) {
        // al llegar a la pantalla 7 suena el telefono de la detective
        sonarEfecto(ring);
      } else {
        sonarEfecto(click);
      }
    }
  }
}

//funciones de la novela

function miFondo(img) {
  image(img, 0, 0, 800, 450);
}

//el personaje va en el medio y atras de la caja de texto
function miPersonaje(img) {
  image(img, 258, 50, 283, 400);
}

//rec de abajo con el dialogo
function cajaTexto(nombre, texto) {
  noStroke();
  fill(0, 0, 0, 160);
  rect(0, 320, 800, 130);

  textAlign(LEFT, TOP);

  if (nombre != "") {
    fill(colorNombre(nombre));
    textStyle(BOLD);
    text(nombre, 30, 332);
    textStyle(NORMAL);
    fill(255);
  } else {
    //narracion en gris clarito
    fill(210);
  }
  text(texto, 30, 360, 740, 50);
}

function colorNombre(nombre) {
  if (nombre == "DETECTIVE") {
    return color(147, 51, 196);
  }
  return color(120, 190, 255);
}

function miBoton(posX, posY, tamX, tamY, textoB) {
  if (overMouse(posX, posY, tamX, tamY)) {
    fill(110);
  } else {
    fill(157);
  }
  noStroke();
  rect(posX, posY, tamX, tamY, tamY / 4);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(textoB, posX + tamX / 2, posY + tamY / 2);
  textSize(18);
}

function overMouse(posX, posY, tamX, tamY) {
  return mouseX > posX && mouseX < posX + tamX && mouseY > posY && mouseY < posY + tamY;
}

//parte 2 el baño y los finales

function dibujarEscena() {
  image(imagenFondo, 0, 0);
  dibujarBoton(btnIgnorar);

  push();
  noStroke();
  //contador de pistas
  fill(0, 0, 0, 150);
  rect(20, 20, 190, 30, 6);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  let analizadas = contarDecisiones("asesinato") + contarDecisiones("suicidio");
  text("Pistas analizadas: " + analizadas + "/" + zonasX.length, 115, 35);

  //cartel de abajo y avisoo
  fill(0, 0, 0, 150);
  rect(200, 405, 400, 30, 5);
  fill(255);
  if (framesAviso > 0) {
    text(aviso, 400, 420);
  } else {
    text("Hacé clic en una pista para investigar", 400, 420);
  }
  pop();

  if (framesAviso > 0){
    framesAviso--;
  }
}

function dibujarPista() {
  image(imagenFondo, 0, 0);
  push();
  noStroke();
  fill(0, 0, 0, 210);
  rect(0, 320, 800, 130);
  pop();

  escribirTexto(textosPistas[pistaActual - 1], 30, 340, 520);
  dibujarBoton(btnAsesinato);
  dibujarBoton(btnSuicidio);
}

function dibujarFinal() {
  let img = secuenciaImgs[indice];
  let texto = secuenciaTextos[indice];


  if (finalActual == "suicidio" && !mostrarCoordenadas) {
    dibujarSusto(img);
  } else {
    image(img, 0, 0);
  }

  if (texto != "") {
    dibujarCajaTexto(texto);
  } else {
    largoTexto = 0;   
  }

  if (indice < secuenciaImgs.length - 1) {
    dibujarBoton(btnContinuar);
  } else {
    dibujarBoton(btnInicio);
    dibujarBoton(btnCreditosFinal);
  }

  if (mostrarCoordenadas) {
    push();
    noStroke();
    fill(255, 200, 0);
    textAlign(LEFT, BOTTOM);
    textSize(12);
    text(round(mouseX) + ", " + round(mouseY), mouseX + 10, mouseY - 5);
    pop();
  }
}

//zoom que arranca lento y se acelera hacia el fiambre 
function dibujarSusto(img) {
  if (zoomSusto < zoomMaximo) {
    zoomSusto = zoomSusto + velZoom;
    velZoom = velZoom + aceleracionZoom;
  }
  if (zoomSusto > zoomMaximo){
    zoomSusto = zoomMaximo;
  }

  push();
  translate(zombieX, zombieY);
  scale(zoomSusto);
  translate(-zombieX, -zombieY);
  image(img, 0, 0);
  pop();

  
  push();
  noStroke();
  fill(0, map(zoomSusto, 1, zoomMaximo, 0, oscuridadMaxima));
  rect(0, 0, width, height);
  pop();
}

function dibujarCreditos() {
  background(255);

  dibujarCaramel();

  push();
  noStroke();

  //texto que sube y se desvanece en los bordes
  textAlign(CENTER, CENTER);
  for (let i = 0; i < creditosTxt.length; i++) {
    let y = floor(yCreditos) + i * 38;
    let alfa = constrain(min(y, height - y) / 60, 0, 1) * 255;
    fill(0, alfa);
    textSize(creditosTam[i]);
    text(creditosTxt[i], width / 2, y);
  }
  pop();

  yCreditos -= 0.5;
  if (yCreditos < -creditosTxt.length * 38) {
    yCreditos = height;
  }

  dibujarBoton(btnVolver);
}

function dibujarCaramel() {
  if (millis() - marcaCaramel >= velocidadCaramel) {
    marcaCaramel = millis();
    frameCaramel = frameCaramel + 1;
    if (frameCaramel >= ordenCaramel.length) {
      frameCaramel = 0;
    }
  }

  image(imgsCaramel[ordenCaramel[frameCaramel]], 0, 0, 800, 450);
}

//funciones del juego

function dibujarBoton(b){
  push();
  stroke(180);
  strokeWeight(1.5);
  if (mouseSobre(b)) {
    fill(120, 120, 120, 235);
  } else {
    fill(70, 70, 70, 225);
  }
  rect(b[0], b[1], b[2], b[3], 8);
  noStroke();
  fill(255);
  textSize(15);
  textAlign(CENTER, CENTER);
  text(b[4], b[0] + b[2] / 2, b[1] + b[3] / 2);
  pop();
}

function dibujarCajaTexto(txt) {
  push();
  noStroke();
  fill(0, 0, 0, 205);
  rect(30, 315, 740, 115, 15);
  pop();
  escribirTexto(txt, 50, 335, 500);
}


function escribirTexto(txt, x, y, ancho) {
  //lo que va entre asteriscos es una accion
  let accion = false;
  if (txt.length > 2 && txt.substring(0, 1) == "*" && txt.substring(txt.length - 1) == "*") {
    accion = true;
    txt = txt.substring(1, txt.length - 1);
  }
  largoTexto = txt.length;
  letras = min(letras + 1.2, largoTexto);
  push();
  noStroke();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(15);
  if (accion) {
    textStyle(ITALIC);
  }
  text(txt.substring(0, floor(letras)), x, y, ancho);
  pop();
}

function nuevoTexto() {
  letras = 0;
}

function completarTexto() {
  letras = largoTexto;
}

function textoCompleto() {
  return letras >= largoTexto;
}

//clics

function mouseSobre(b) {
  return mouseX > b[0] && mouseX < b[0] + b[2] && mouseY > b[1] && mouseY < b[1] + b[3];
}

function mousePressed() {
 
  userStartAudio();

  if (estado == estadoNovela) {
    clicNovela();
  } else if (estado == estadoEscena) {
    clicEscena();
  } else if (estado == estadoPista) {
    clicPista();
  } else if (estado == estadoFinal) {
    clicFinal();
  } else if (estado == estadoCreditos){
    if (mouseSobre(btnVolver)) {
      reiniciarJuego();
      cambiarEstado(estadoNovela);
    }
  }
}

callate

function clicEscena() {
  if (mouseSobre(btnIgnorar)) {
    iniciarFinal("archivado");
    return;
  }
  for (let i = 0; i < zonasX.length; i++) {
    if (dist(mouseX, mouseY, zonasX[i], zonasY[i]) <= radioClic) {
      if (decisiones[i] != null) {
        aviso = "Ya analizaste esa pista";
        framesAviso = 90;
      } else {
        pistaActual = i + 1;
        cambiarEstado(estadoPista);
      }
      break;
    }
  }
}

function clicPista() {
  if (mouseSobre(btnAsesinato)) {
    votar("asesinato");
  } else if (mouseSobre(btnSuicidio)) {
    votar("suicidio");
  }
}

function clicFinal() {
  let esUltimo = indice == secuenciaImgs.length - 1;
  let tieneTexto = secuenciaTextos[indice] != "";
  if (!esUltimo) {
    if (mouseSobre(btnContinuar)) {
      // si el texto todavia se esta escribiendo el primer clic lo completa
      if (tieneTexto && !textoCompleto()) {
        completarTexto();
        return;
      }
      indice++;
      nuevoTexto();
      alMostrarPaso();
    }
  } else {
    if (mouseSobre(btnInicio)){
      reiniciarJuego();
      cambiarEstado(estadoNovela);
    } else if (mouseSobre(btnCreditosFinal)) {
      cambiarEstado(estadoCreditos);
    }
  }
}

//logica del juego

function votar(opcion) {
  sonarLapiz();
  decisiones[pistaActual - 1] = opcion;

  let asesinatos = contarDecisiones("asesinato");
  let suicidios = contarDecisiones("suicidio");

  if (asesinatos + suicidios >= zonasX.length) {
    // con 5 pistas nunca hay empate
    if (asesinatos > suicidios) {
      iniciarFinal("bueno");
    } else {
      iniciarFinal("suicidio");
    }
  } else {
    cambiarEstado(estadoEscena);
  }
}

function contarDecisiones(tipo){
  let total = 0;
  for (let i = 0; i < decisiones.length; i++) {
    if (decisiones[i] == tipo){
      total++;
    }
  }
  return total;
}

function iniciarFinal(tipo) {
  finalActual = tipo;
  if (tipo == "archivado") {
    secuenciaImgs = imgsArchivado;
    secuenciaTextos = textosArchivado;
  } else if (tipo == "bueno") {
    secuenciaImgs = imgsBueno;
    secuenciaTextos = textosBuenoSec;
  } else {
    secuenciaImgs = imgsSuicidio;
    secuenciaTextos = textosSuicidio;
  }
  indice = 0;
  cambiarEstado(estadoFinal);
  alMostrarPaso();
}

//se llama cada vez que aparece una imagen nueva dentro de un final
function alMostrarPaso() {

 
  if (finalActual == "archivado" && indice == 1) {
    sonarEfecto(sonidoLadrillo);
  }

  
  if (finalActual == "archivado" && indice == 4) {
    sonarEfecto(sonidoPuerta);
  }

  
  if (finalActual == "bueno" && indice == 4 - inicioBueno) {
    iniciarMusicaEspiritual();
  }

  
  if (finalActual == "suicidio" && indice == 0){
    sonarEfecto(sonidoSusto);
    zoomSusto = 1;
    velZoom = 0;
  }
}
wsp
function cambiarEstado(nuevo) {
  estado = nuevo;
  nuevoTexto();

  if (nuevo != estadoFinal) {
    detenerEfectos();   // al salir de un final se cortan los efectos
  }
  if (nuevo == estadoFinal || nuevo == estadoCreditos) {
    detenerMusica();
  }
  if (nuevo == estadoCreditos){
    yCreditos = height;
  }
}


function reiniciarJuego(){
  pantalla = 0;
  estado = estadoNovela;
  decisiones = [];
  for (let i = 0; i < zonasX.length; i++) {
    decisiones.push(null);
  }
  pistaActual = 0;
  indice = 0;
  aviso = "";
  framesAviso = 0;
}

//sonido

//el lapiz 
function sonarLapiz() {
  if (sonidoLapiz.isLoaded()){
    sonidoLapiz.stop();                         // corta el anterior si seguia sonando
    sonidoLapiz.play();
    marcaLapiz = millis();
  }
}

//para los otros  efectos 
function sonarEfecto(sonido) {
  if (sonido.isLoaded()) {
    sonido.stop();
    sonido.play();
  }
}

function detenerEfectos(){
  sonidoLadrillo.stop();
  sonidoSusto.stop();
  sonidoPuerta.stop();
  musicaEspiritual.stop();
}


function iniciarMusicaEspiritual() {
  if (musicaEspiritual.isLoaded()){
    musicaEspiritual.stop();
    volEspiritual = volEspiritualInicio;
    musicaEspiritual.setVolume(volEspiritual);
    musicaEspiritual.loop();
  }
}


function audioActivo() {
  return getAudioContext().state == "running";
}

function iniciarMusica() {
  if (musicaFondo.isLoaded() && !musicaFondo.isPlaying()) {
    musicaFondo.loop();
  }
}

function detenerMusica(){
  musicaFondo.stop();
}
