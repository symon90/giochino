let benvenuto = document.querySelector("#benvenuto");
let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let a = 0.5; // Velocità lungo l'asse X
let b = 0.5; // Velocità lungo l'asse Y
let targeted = false;
let count = 3;
let x = 0;
let y = 0;
let colpi = 3;
let punteggioCard = document.querySelector(".punteggio");
const rect = canvas.getBoundingClientRect();
let punteggio = 0;
let lv = 1;
const flapping_wings = new Audio("./sound/wings.mp3");
const gun = new Audio("./sound/gun.mp3");
const url = "./img/duck.png";
const duck = new Image();
const count_bullet = document.querySelector(".bullet_p");
duck.src = url;

// Posizione e dimensioni del duck
let duckPosition = { x: 0, y: 0, width: 20, height: 20 };
//inizio gioco/livello
function startGame() {
  context.clearRect(0, 0, canvas.width, canvas.height); // Pulisce tutto il canvas
  colpi = 3;
  updateBullet();
  benvenuto.style.display = "none";
  targeted = false;
  x = posx();
  y = posy();
  duckPosition.x = x;
  duckPosition.y = y;
  a = a * 1.05;
  b = b * 1.05;
  context.drawImage(duck, x, y, duckPosition.width, duckPosition.height);
  flapping_wings.loop = true;
  flapping_wings.play();
  update(x, y);
}
//posizioni randomiche iniziali
function posx() {
  return Math.round(Math.random() * (canvas.width - duckPosition.width));
}

function posy() {
  return Math.round(Math.random() * (canvas.height - duckPosition.height));
}
//gestione degli spostamenti dell'anatra
function update(x, y) {
  context.clearRect(0, 0, canvas.width, canvas.height); // Pulisce tutto il canvas
  if (!targeted) {
    // Movimento e controllo dei bordi
    if (x + a + duckPosition.width >= canvas.width || x + a <= 0) {
      a = -a;
    }
    if (y + b + duckPosition.height >= canvas.height || y + b <= 0) {
      b = -b;
    }
    x = x + a;
    y = y + b;
    duckPosition.x = x;
    duckPosition.y = y;

    context.drawImage(duck, x, y, duckPosition.width, duckPosition.height);

    requestAnimationFrame(() => update(x, y));
  }
}

// Gestione del clic sul canvas
canvas.addEventListener("mousedown", (event) => {
  gun.play();
  // Ottieni le coordinate relative al canvas
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseX = (event.clientX - rect.left) * scaleX;
  const mouseY = (event.clientY - rect.top) * scaleY;

  // Controlla se il clic è dentro i limiti del duck
  if (
    mouseX >= duckPosition.x &&
    mouseX <= duckPosition.x + duckPosition.width &&
    mouseY >= duckPosition.y &&
    mouseY <= duckPosition.y + duckPosition.height
  ) {
    bang();
  } else {
    if (colpi == 1) {
      colpi--;
      gameOver();
    } else {
      colpi--;
    }
    updateBullet();
  }
});
//gestisce il colpito
function bang() {
  punteggio += 10 * lv * 1.1;
  punteggioCard.innerHTML = `${punteggio}`;
  lv++;
  targeted = true;
  setTimeout(() => {
    startGame();
  }, 100);
}
//mostra il modale tra un livello e l'altro
function displayModal() {
  if (count == 0) {
    count = 3;
    startGame();
  } else {
    benvenuto.innerHTML = `<p>Il nuovo livello inizierà tra:</p>
    <p>${count}</p>`;
    benvenuto.style.display = "block";
    count--;
    setTimeout(() => {
      displayModal();
    }, 1000);
  }
}
//game over
function gameOver() {
  flapping_wings.pause();
  targeted = true;
  a = 0.5;
  b = 0.5;
  benvenuto.innerHTML = `<p>Mi dispiace, ma hai perso!</p>
  <p>Hai totalizzato ${punteggio}</p>
  <button onclick='startGame()'>Nuova partita</button>`;
  benvenuto.style.display = "block";
}

//aggiornamneto colpi pistola a schermo
function updateBullet() {
  count_bullet.innerHTML = `X${colpi}`;
}
