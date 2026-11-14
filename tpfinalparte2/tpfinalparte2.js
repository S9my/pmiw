

//Lucía Torres y Macarena Segura
let juego;

//imagenes y sonidos sueltos
let imgFondo, imgBoton, imgTutorial, imgTitulo;
let imgProta = [];
let imgVidas = [];
let imgPistas = [];
let imgBasuras = [];
let imgFinales = []; 
let imgsCaramel = [];
let musicaFondo, sonidoExplosion, sonidoGanaste, sonidoSello;

function preload() {
  imgFondo = loadImage('data/fondo.png');
  imgBoton = loadImage('data/botones.png');
  imgTutorial = loadImage('data/tutorial.png');
  imgTitulo = loadImage('data/identidad.png');

  imgProta.push(loadImage('data/prota.png'));
  imgProta.push(loadImage('data/protaderecha.png'));
  imgProta.push(loadImage('data/protaizquierda.png'));

  imgVidas.push(loadImage('data/vida.png'));
  imgVidas.push(loadImage('data/novida.png'));

  imgFinales.push(loadImage('data/victoria.png'));
  imgFinales.push(loadImage('data/perdida.png'));

  for (let i = 1; i <= 3; i++) {
    imgPistas.push(loadImage('data/prueba' + i + '.png'));
  }

  //carga varias imagenes de una
  for (let i = 1; i <= 4; i++) {
    imgBasuras.push(loadImage('data/noprueba' + i + '.png'));
    imgsCaramel.push(loadImage('data/caramellpt' + i + '.png'));
  }
  imgsCaramel.push(loadImage('data/caramelpt5.png'));

  musicaFondo = loadSound('data/musicafondo.mp3');
  sonidoExplosion = loadSound('data/explosion.mp3');
  sonidoGanaste = loadSound('data/ganaste.mp3');
  sonidoSello = loadSound('data/sello.mp3');
}

function setup() {
  createCanvas(800, 400);
  textFont('Courier New');

  //achica las imagenes para que entren bien
  imgVidas[0].resize(30, 0);
  imgVidas[1].resize(30, 0);
  for (let i = 0; i < imgBasuras.length; i++) {
    imgBasuras[i].resize(0, 45);
  }

  musicaFondo.setVolume(0.4);
  sonidoExplosion.setVolume(0.9);
  sonidoGanaste.setVolume(1.0);
  sonidoSello.setVolume(1.0);

  juego = new Juego(imgFondo, imgProta, imgVidas, imgPistas, imgBasuras, imgFinales, imgBoton, imgTutorial, imgTitulo, imgsCaramel, musicaFondo, sonidoExplosion, sonidoGanaste, sonidoSello);
}

function draw() {
  juego.actualizar();
  juego.dibujar();
}

function mousePressed() {
  userStartAudio(); //destraba el audio con el primer clic
  juego.clic();
}

function keyPressed() {
  juego.tecla();
}


//pantallas del juego
class Juego {
  constructor(fondo, imgProta, imgVidas, imgPistas, imgBasuras, imgFinales, imgBoton, imgTutorial, imgTitulo, imgsCaramel, musicaFondo, sonidoExplosion, sonidoGanaste, sonidoSello) {
    this.fondo = fondo;
    this.imgVidas = imgVidas;
    this.imgPistas = imgPistas;
    this.imgBasuras = imgBasuras;
    this.imgFinales = imgFinales;
    this.imgTutorial = imgTutorial;
    this.imgTitulo = imgTitulo;
    this.musicaFondo = musicaFondo;
    this.sonidoExplosion = sonidoExplosion;
    this.sonidoGanaste = sonidoGanaste;
    this.sonidoSello = sonidoSello;

    this.detective = new Detective(imgProta);
    this.creditos = new Creditos(imgsCaramel);

    this.botonJugar = new Boton(400, 215, 168, 52, "Jugar", imgBoton);
    this.botonCreditos = new Boton(400, 280, 168, 52, "Créditos", imgBoton);
    this.botonVolver = new Boton(400, 340, 168, 52, "Volver", imgBoton);
    this.botonReiniciar = new Boton(400, 300, 168, 52, "Reiniciar", imgBoton);

    //arranca todo de cero
    this.reiniciar();
    this.estado = 0;
    this.tutorial = false;
  }

  reiniciar() {
    this.estado = 3;
    this.vidas = 3;
    this.pistasJuntas = 0;
    this.tienePista = [false, false, false];
    this.caidos = [];
    this.marcaBasura = millis();
    this.marcaPista = millis();
    this.detective.x = width/2;
  }

  actualizar() {
    //hace que la musica se repita sola mientras jugas
    if (getAudioContext().state == "running" && this.estado != 4 && this.estado != 5 && this.musicaFondo.isLoaded() && !this.musicaFondo.isPlaying()) {
      this.musicaFondo.loop();
    }

    if (this.estado == 3) {
      //para el juego hasta que toques a o d para sacar el cartel
      if (this.tutorial) {
        if (keyIsDown(65) || keyIsDown(68)) {
          this.tutorial = false;
          this.marcaBasura = millis();
          this.marcaPista = millis();
        }
        return;
      }

      this.detective.mover();

      //reloj que tira basura cada 700 milisegundos
      if (millis() > this.marcaBasura + 700) {
        let n = floor(random(this.imgBasuras.length));
        this.caidos.push(new Caido(random(70, width - 70), -60, false, n, random(2, 3.5), this.imgBasuras[n]));
        this.marcaBasura = millis();
      }

      //reloj que tira una pista al azar q todavia no agarrasteS
      if (millis() > this.marcaPista + 2500) {
        let n = floor(random(3));
        for (let i = 0; i < 3; i++) {
          if (this.tienePista[n]) n = (n + 1) % 3; //si ya la tenes, pasa a la otra
        }
        this.caidos.push(new Caido(random(70, width - 70), -60, true, n, random(2, 2.5), this.imgPistas[n]));
        this.marcaPista = millis();
      }

      //revisa la lista de atras para adelante para borrar cosas sin que se rompa
      for (let i = this.caidos.length - 1; i >= 0; i--) {
        this.caidos[i].mover();
        let atrapado = this.detective.colision(this.caidos[i]);
        if (atrapado) this.agarrar(this.caidos[i]);
        if (atrapado || this.caidos[i].fueraDePantalla()) this.caidos.splice(i, 1);
      }
    }
  }

  agarrar(caido) {
    if (caido.esPista) {
      this.tienePista[caido.numero] = true;
      this.pistasJuntas++;
      if (this.pistasJuntas == 3) this.terminar(4, this.sonidoGanaste);
    } else {
      this.vidas--;
      if (this.vidas == 0) this.terminar(5, this.sonidoSello);
      else this.sonar(this.sonidoExplosion);
    }
  }

  //cierra la partida
  terminar(estado, sonido) {
    this.estado = estado;
    this.musicaFondo.stop();
    this.sonar(sonido);
  }

  //corta el sonido y lo arranca de cero para que no se pise
  sonar(sonido) {
    if (sonido.isLoaded()) {
      sonido.stop();
      sonido.play();
    }
  }

  dibujar() {
    image(this.fondo, 0, 0);

    switch (this.estado) {
    case 0: //menu
      this.oscurecer();
      image(this.imgTitulo, width/2 - 225, 15, 450, 144);
      this.botonJugar.dibujar();
      this.botonCreditos.dibujar();
      break;
    case 2: //creditos
      this.creditos.dibujar();
      this.botonVolver.dibujar();
      break;
    case 3: //jugando
      for (let i = 0; i < this.caidos.length; i++) {
        this.caidos[i].dibujar();
      }
      this.detective.dibujar();
      this.dibujarBarra();
      if (this.tutorial) {
        this.oscurecer();
        image(this.imgTutorial, 183, 20, 434, 360);
      }
      break;
    case 4: //ganaste
      this.dibujarFinal(this.imgFinales[0], "Muchas gracias, Señor Detective...");
      break;
    case 5: //perdiste
      this.dibujarFinal(this.imgFinales[1], "Sin pruebas no hay caso. Quedas despedido, detective...");
      break;
    }
  }

  //barra de abajo
  dibujarBarra() {
    push();
    noStroke();
    fill(0, 170);
    rect(0, 356, width, 44);
    pop();

 //corazon
    for (let i = 0; i < 3; i++) {
      let v = 1;
      if (i < this.vidas) v = 0;
      image(this.imgVidas[v], 15 + i*38, 364);
    }

    push();
    fill(226, 203, 184);
    textAlign(RIGHT);
    textSize(26);
    text(this.pistasJuntas + " de 3", 780, 388);
    pop();
  }

  //pantalla de cierre
  dibujarFinal(imagen, frase) {
    this.oscurecer();
    image(imagen, width/2 - imagen.width/2, 40);
    push();
    fill(226, 203, 184);
    textAlign(CENTER);
    textSize(20);
    text(frase, width/2, 230);
    pop();
    this.botonReiniciar.dibujar();
  }

  oscurecer() {
    push();
    noStroke();
    fill(0, 150);
    rect(0, 0, width, height);
    pop();
  }

  clic() {
    if (this.estado == 0 && this.botonJugar.estaEncima()) {
      this.reiniciar();
      this.tutorial = true;
    } else if (this.estado == 0 && this.botonCreditos.estaEncima()) {
      this.estado = 2;
      this.creditos.reiniciar();
    } else if (this.estado == 2 && this.botonVolver.estaEncima()) {
      this.estado = 0;
    } else if (this.estado >= 4 && this.botonReiniciar.estaEncima()) {
      this.reiniciar();
    }
  }

  tecla() {
    if (this.estado >= 3 && (key == 'r' || key == 'R')) {
      this.reiniciar();
      this.tutorial = false;
    }
  }
}


class Detective {
  constructor(imagenes) {
    this.x = width/2;
    this.y = 262;
    this.ancho = 87;
    this.alto = 177;
    this.velocidad = 6;
    this.direccion = 0;
    this.imagenes = imagenes;
    //zona donde agarra cosas
    this.anchoCanasta = 78;
    this.altoCanasta = 16;
  }

  mover() {
    this.direccion = 0;
    if (keyIsDown(65)) { //izquierda
      this.x -= this.velocidad;
      this.direccion = 2;
    }
    if (keyIsDown(68)) { //derecha
      this.x += this.velocidad;
      this.direccion = 1;
    }
    //traba al personaje para que no se escape por los costados
    this.x = constrain(this.x, this.ancho/2, width - this.ancho/2);
  }

  dibujar() {
    image(this.imagenes[this.direccion], this.x - this.ancho/2, this.y - this.alto/2);
  }

  colision(caido) {
    //mide si el objeto que cae toca la bandejita de arriba de la cabeza
    let arriba = this.y - this.alto/2;
    let bordeX = constrain(caido.x, this.x - this.anchoCanasta/2, this.x + this.anchoCanasta/2);
    let bordeY = constrain(caido.y, arriba, arriba + this.altoCanasta);
    return dist(caido.x, caido.y, bordeX, bordeY) < caido.alto/2;
  }
}


//cosas que caen del cielo
class Caido {
  constructor(x, y, esPista, numero, velocidad, imagen) {
    this.x = x;
    this.y = y;
    this.ancho = imagen.width;
    this.alto = imagen.height;
    this.esPista = esPista;
    this.numero = numero;
    this.velocidad = velocidad;
    this.imagen = imagen;
  }

  mover() {
    this.y += this.velocidad;
  }

  dibujar() {
    image(this.imagen, this.x - this.ancho/2, this.y - this.alto/2);
  }

  fueraDePantalla() {
    return this.y > height - 50; //toca el piso
  }
}


class Boton {
  constructor(x, y, ancho, alto, texto, imagen) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.texto = texto;
    this.imagen = imagen;
  }

  dibujar() {
    push();
    image(this.imagen, this.x - this.ancho/2, this.y - this.alto/2, this.ancho, this.alto);
    noStroke();
    fill(226, 203, 184);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    textSize(17);
    text(this.texto, this.x, this.y - 4);
    pop();
  }

  estaEncima() {
    //se fija si la flechita del mouse esta parada adentro del boton
    return mouseX > this.x - this.ancho/2 && mouseX < this.x + this.ancho/2 &&
           mouseY > this.y - this.alto/2 && mouseY < this.y + this.alto/2;
  }
}


class Creditos {
  constructor(imgsCaramel) {
    this.imgsCaramel = imgsCaramel;
    this.orden = [0, 1, 2, 3, 4, 3, 2, 1]; //pasos del baile
    this.velocidad = 160;
    this.frame = 0;
    this.marca = 0;
    this.y = height;

    this.texto = [
      "CRÉDITOS",
      "",
      "PRUEBA CELESTIAL",
      "Video Juego Web",
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
      "Resto de dibujos y assets:",
      "Lucía Torres y",
      "Macarena Milagros Segura Alpaca",
      "",
      "Gracias por jugar",
      ":3"
    ];
    this.tam = [34, 14, 26, 16, 14, 22, 18, 18, 14, 22, 16, 16, 14, 22, 16, 16, 16, 14, 22, 16, 14, 22, 16, 16, 16, 14, 20, 28];
  }

  reiniciar() {
    this.y = height;
  }

  dibujar() {
    background(0);

    this.dibujarCaramel();

    push();
    noStroke();

    //va borrando de a poco las letras
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.texto.length; i++) {
      let y = floor(this.y) + i * 38;
      let alfa = constrain(min(y, height - y) / 60, 0, 1) * 255;
      fill(226, 203, 184, alfa);
      textSize(this.tam[i]);
      text(this.texto[i], width / 2, y);
    }
    pop();

    //mueve las letras para arriba
    this.y -= 0.8;
    if (this.y < -this.texto.length * 38) this.y = height;
  }

  dibujarCaramel() {
    //cambia el dibujito del baile cada 160 milisegundos
    if (millis() - this.marca >= this.velocidad) {
      this.marca = millis();
      this.frame = (this.frame + 1) % this.orden.length;
    }

    //sube un poquito el dibujo para que se vean los pies
    image(this.imgsCaramel[this.orden[this.frame]], 0, -50, 800, 450);
  }
}
