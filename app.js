//Con este addEventListener ejecuto el codigo cuando se cargo el HTML
//Lo tuve que poner porque el script lo llame en el head de html
document.addEventListener("DOMContentLoaded", () => {
  //selecciono la grilla que es tooodos los div
  const grid = document.querySelector(".grid");
  //convierto tooodos los div en un array
  let squares = Array.from(document.querySelectorAll(".grid div"));

  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  //ancho de las filas XXXXXXXXXX
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = [
    "orange",
    "red",
    "purple",
    "green",
    "blue"
  ]

  //Tetrominos
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4;
  let currentRotation = 0;

  //selecciono un tetramino aleatorio en la primera rotacion
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //dibuja el tetramino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    })
  }

  //borra el tetramino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    })
  }

  //asignar funciones a codigos de teclas
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if ((e.keyCode === 40)) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  //moveDown function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //congelar los tetraminos
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
      current.forEach(index => squares[currentPosition + index].classList.add("taken"))

      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //movimiento a la izquierda
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition += 1;
    }

    draw();
  }
  //movimiento a la derecha
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition -= 1;
    }

    draw();
  }

  //rotar el tetromino
  function rotate() {
    undraw();
    //voy pasando por todas las rotaciones una por una
    currentRotation++;
    //si la rotacion es la mayor, la devuelvo a la primera
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation]
    draw();
  }

  //mostrar siguiente tetromino en la mini pantallita
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  //los tetrominos sin las rotaciones
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
  ]

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = ""
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //añadir funcionalidad al boton de empezar/pausar
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetraminoes.length)
      displayShape();
    }
  })

  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }


})

