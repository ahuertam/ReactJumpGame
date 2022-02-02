/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
const worldMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const EggCanvas = ({ tick }) => {
  const canvasRef = useRef(null);
  const anchoF = 50;
  const altoF = 50;
  let player;

  const wall = "#044f14";
  const floor = "#c6892f";

  const drawMap = (ctx) => {
    let color;
    let i = 0;
    for (i; i < worldMap.length; i++) {
      let j = 0;
      for (j; j < worldMap[i].length; j++) {
        if (worldMap[i][j] === 0) color = wall;
        if (worldMap[i][j] === 2) color = floor;
        ctx.fillStyle = color;
        ctx.fillRect(j * anchoF, i * altoF, anchoF, altoF);
      }
    }
  };
  const drawText = (ctx) => {
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillText("M E T A L  O Z A R U", 90, 90);
  };
  const playerBase = function (ctx) {
    //Posición en pixels
    this.x = 70;
    this.y = 70;

    //controlamos la pressción de las teclas
    this.pressLeft = false;
    this.pressRight = false;

    //velocity horizontal y vertical
    this.vx = 0;
    this.vy = 0;

    //gravity
    this.gravity = 0.3;
    this.friction = 0.2;

    this.jump = 10; //jump
    this.velocity = 3; //desplazamiento

    //¿Está en el floor?
    this.floor = false;

    this.color = "#820c01";

    //HACEMOS LOS CÁLCULOS OPORTUNOS
    this.physics = function () {
      //CAÍDA
      if (this.floor === false) {
        this.vy += this.gravity;
      } else {
        this.vy = 0;
      }

      // horizontal velocity
      //Siempre la refrescamos, para que pueda haber inercia y deslice
      if (this.pressLeft === true) {
        this.vx = -this.velocity;
      }

      if (this.pressRight === true) {
        this.vx = this.velocity;
      }

      //FRICCÓN

      //left
      if (this.vx < 0) {
        this.vx += this.friction;

        //si nos pasamos, paramos
        if (this.vx > 0) {
          this.vx = 0;
        }
      }

      //right
      if (this.vx > 0) {
        this.vx -= this.friction;

        if (this.vx < 0) {
          this.vx = 0;
        }
      }

      //VEMOS SI HAY COLISIÓN POR LOS LADOS
      //right
      if (
        this.vx > 0 &&
        this.colision(this.x + anchoF, this.y + parseInt(altoF / 2)) == true
      ) {
        this.vx = 0;
      }

      //left
      if (
        this.vx < 0 &&
        this.colision(this.x, this.y + parseInt(altoF / 2)) === true
      ) {
        this.vx = 0;
      }

      //ACTUALIZAMOS POSICIÓN
      this.y += this.vy;
      this.x += this.vx;

      //para ver si hay colisión por abajo le sumamos 1 casilla a "y"
      if (
        this.colision(this.x + parseInt(anchoF / 2), this.y + altoF) === true
      ) {
        this.floor = true;
      } else {
        this.floor = false;
      }

      //COMPROBAMOS COLISIÓN CON EL TECHO (frena el ascenso en seco)
      if (this.colision(this.x + parseInt(anchoF / 2), this.y)) {
        this.vy = 0;
      }
    };

    this.draw = function () {
      this.physics();

      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, anchoF, altoF);
    };

    this.colision = function (x, y) {
      var colisiona = false;

      //Ajustamos los pixels a los cuadros dividiendo por altoF y anchoF
      //if(worldMap[y][x]==0){
      if (worldMap[parseInt(y / altoF)][parseInt(x / anchoF)] === 0) {
        colisiona = true;
      }

      return colisiona;
    };

    this.up = function () {
      //Solo podemos saltar si estamos en el floor
      if (this.floor === true) {
        this.vy -= this.jump;
        this.floor = false;
      }
    };

    this.left = function () {
      //this.vx = -this.velocity;
      this.pressLeft = true;
    };

    this.right = function () {
      //this.vx = this.velocity;
      this.pressRight = true;
    };

    this.leftNoPress = function () {
      this.pressLeft = false;
    };

    this.rightNoPress = function () {
      this.pressRight = false;
    };
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    player = new playerBase(context);
    //LECTURA DEL TECLADO
    document.addEventListener("keydown", function (tecla) {
      if (tecla.keyCode === 87) {
        player.up();
      }

      if (tecla.keyCode === 65) {
        player.left();
      }

      if (tecla.keyCode === 68) {
        player.right();
      }
    });
    document.addEventListener("keyup", function (tecla) {
      if (tecla.keyCode === 65) {
        player.leftNoPress();
      }

      if (tecla.keyCode === 68) {
        player.rightNoPress();
      }
    });
    // let frameCount = 0;
    let animationFrameId;

    // Our draw came here
    const render = () => {
      // frameCount += 1;
      drawMap(context);
      player.draw();
      drawText(context);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <span color="red">{tick}</span>
      <canvas
        width={750}
        height={500}
        style={{ border: "2px solid #000000" }}
        ref={canvasRef}
      />
    </>
  );
};

export default EggCanvas;
