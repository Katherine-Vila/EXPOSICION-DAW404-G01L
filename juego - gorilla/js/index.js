// Aqui guardo todo lo que va cambiando durante la partida: turno, edificios, viento y posicion de la banana.
let state = {};

let isDragging = false;
let dragStartX = undefined;
let dragStartY = undefined;

let previousAnimationTimestamp = undefined;
let animationFrameRequestID = undefined;
let explosionAnimationFrameID = undefined;
let delayTimeoutID = undefined;

let simulationMode = false;
let simulationImpact = {};

// Configuracion general: cantidad de jugadores, tema visual, idioma y musica.
const settings = {
  numberOfPlayers: 1, // 0 significa que juegan dos computadoras automaticamente.
  themeIndex: -1,
  language: "es",
  musicEnabled: false,
};

const themes = [
  {
    id: "classic-day",
    names: { es: "Clasico dia", en: "Classic day", fr: "Jour classique", pt: "Classico dia", de: "Klassisch tag", it: "Classico giorno" },
    sky: ["#F8BA85", "#FFC28E"],
    moon: "rgba(255, 255, 255, 0.6)",
    moonSize: 60,
    backgroundBuilding: "#947285",
    building: "#4A3C68",
    window: "#EBB6A2",
    gorilla: "#111111",
    gorillaFace: "lightgray",
    bomb: "#ffffff",
    explosion: ["#fff4a6", "#ff9f1c", "#e63946"],
    track: "musica/Playlist Sweet Tale.mp3",
  },
  {
    id: "classic-night",
    names: { es: "Clasico noche", en: "Classic night", fr: "Nuit classique", pt: "Classico noite", de: "Klassisch nacht", it: "Classico notte" },
    sky: ["#27507F", "#58A8D8"],
    moon: "rgba(255, 255, 255, 0.6)",
    moonSize: 30,
    backgroundBuilding: "#254D7E",
    building: "#152A47",
    window: "#5F76AB",
    gorilla: "#111111",
    gorillaFace: "gray",
    bomb: "#ffffff",
    explosion: ["#f9f871", "#ffb703", "#fb5607"],
    track: "musica/Playlist AI Fantasy.mp3",
  },
  {
    id: "red-alert",
    names: { es: "Rojo alerta", en: "Red alert", fr: "Alerte rouge", pt: "Alerta vermelho", de: "Roter alarm", it: "Allarme rosso" },
    sky: ["#3a0508", "#d62828"],
    moon: "rgba(255, 206, 84, 0.7)",
    moonSize: 42,
    backgroundBuilding: "#7b1d26",
    building: "#2b0d12",
    window: "#ffba08",
    gorilla: "#120608",
    gorillaFace: "#ffb3a7",
    bomb: "#ffe66d",
    explosion: ["#fff275", "#ff5400", "#d00000"],
    track: "musica/Playlist  The Horror.mp3",
  },
  {
    id: "tropical",
    names: { es: "Tropical", en: "Tropical", fr: "Tropical", pt: "Tropical", de: "Tropisch", it: "Tropicale" },
    sky: ["#2bb3a3", "#ffcf7a"],
    moon: "rgba(255, 244, 189, 0.66)",
    moonSize: 46,
    backgroundBuilding: "#43866f",
    building: "#235c52",
    window: "#ffe08a",
    gorilla: "#143628",
    gorillaFace: "#8fd18d",
    bomb: "#fff09a",
    explosion: ["#fff176", "#ff9800", "#ff3d00"],
    track: "musica/Playlist Colorize.mp3",
  },
  {
    id: "arcade",
    names: { es: "Arcade", en: "Arcade", fr: "Arcade", pt: "Arcade", de: "Arcade", it: "Arcade" },
    sky: ["#1e1b4b", "#7c3aed"],
    moon: "rgba(255, 204, 51, 0.68)",
    moonSize: 34,
    backgroundBuilding: "#2c2a75",
    building: "#17123a",
    window: "#ffcc33",
    gorilla: "#080612",
    gorillaFace: "#ff87bd",
    bomb: "#ffffff",
    explosion: ["#ffcc33", "#ff4081", "#40c4ff"],
    track: "musica/Playlist Game Kid.mp3",
  },
  {
    id: "storm",
    names: { es: "Tormenta", en: "Storm", fr: "Orage", pt: "Tempestade", de: "Sturm", it: "Tempesta" },
    sky: ["#2d4059", "#9ab0c6"],
    moon: "rgba(225, 238, 255, 0.58)",
    moonSize: 36,
    backgroundBuilding: "#40566f",
    building: "#223247",
    window: "#d8ecff",
    gorilla: "#121820",
    gorillaFace: "#98a7b8",
    bomb: "#f4fbff",
    explosion: ["#f8f9fa", "#fca311", "#d62828"],
    track: "musica/Playlist Game of Rings.mp3",
  },
  {
    id: "gold",
    names: { es: "Dorado", en: "Gold", fr: "Or", pt: "Dourado", de: "Gold", it: "Oro" },
    sky: ["#8f5a00", "#ffd166"],
    moon: "rgba(255, 255, 255, 0.58)",
    moonSize: 48,
    backgroundBuilding: "#9c6644",
    building: "#3f2a1d",
    window: "#ffe169",
    gorilla: "#20140d",
    gorillaFace: "#e0a96d",
    bomb: "#fff8c2",
    explosion: ["#fff3b0", "#f77f00", "#bc6c25"],
    track: "musica/Playlist Cirque De Paris.mp3",
  },
];

const translations = {
  es: {
    title: "Juego de Gorilas",
    wind: "Viento",
    angle: "Angulo",
    velocity: "Fuerza",
    newGame: "Nuevo juego",
    onePlayer: "Un jugador",
    twoPlayers: "Dos jugadores",
    autoplay: "Automatico",
    style: "Tema",
    musicOn: "Musica: si",
    musicOff: "Musica: no",
    player: "Jugador",
    player1: "Jugador 1",
    player2: "Jugador 2",
    computer: "Computadora",
    computer1: "Computadora 1",
    computer2: "Computadora 2",
    versusComputer: "Jugador vs. Computadora",
    versusPlayer: "Jugador vs. Jugador",
    automatic: "Automatico",
    instruction: "Arrastra la banana para apuntar",
    preparing: "Preparando partida",
    turn: "Turno de",
    thinking: "esta calculando",
    thrown: "lanzo la banana",
    newMatch: "Nueva partida",
    against: "contra",
    themeChanged: "Tema activo",
    nextThrow: "Ahora lanza",
    explosion: "Explosion",
    finalHit: "acerto el golpe final",
    won: "Gano",
    winnerNote: "Nuevo duelo listo",
    askP1: "Nombre del jugador 1:",
    askP2: "Nombre del jugador 2:",
  },
  en: {
    title: "Gorillas Game",
    wind: "Wind",
    angle: "Angle",
    velocity: "Power",
    newGame: "New game",
    onePlayer: "One player",
    twoPlayers: "Two players",
    autoplay: "Autoplay",
    style: "Theme",
    musicOn: "Music: on",
    musicOff: "Music: off",
    player: "Player",
    player1: "Player 1",
    player2: "Player 2",
    computer: "Computer",
    computer1: "Computer 1",
    computer2: "Computer 2",
    versusComputer: "Player vs. Computer",
    versusPlayer: "Player vs. Player",
    automatic: "Autoplay",
    instruction: "Drag the banana to aim",
    preparing: "Preparing match",
    turn: "Turn for",
    thinking: "is calculating",
    thrown: "threw the banana",
    newMatch: "New match",
    against: "against",
    themeChanged: "Active theme",
    nextThrow: "Now throws",
    explosion: "Explosion",
    finalHit: "landed the final hit",
    won: "Winner",
    winnerNote: "Next duel ready",
    askP1: "Player 1 name:",
    askP2: "Player 2 name:",
  },
  fr: {
    title: "Jeu des Gorilles",
    wind: "Vent",
    angle: "Angle",
    velocity: "Force",
    newGame: "Nouvelle partie",
    onePlayer: "Un joueur",
    twoPlayers: "Deux joueurs",
    autoplay: "Automatique",
    style: "Theme",
    musicOn: "Musique: oui",
    musicOff: "Musique: non",
    player: "Joueur",
    player1: "Joueur 1",
    player2: "Joueur 2",
    computer: "Ordinateur",
    computer1: "Ordinateur 1",
    computer2: "Ordinateur 2",
    versusComputer: "Joueur vs. Ordinateur",
    versusPlayer: "Joueur vs. Joueur",
    automatic: "Automatique",
    instruction: "Glisse la banane pour viser",
    preparing: "Preparation de la partie",
    turn: "Tour de",
    thinking: "calcule son tir",
    thrown: "a lance la banane",
    newMatch: "Nouvelle partie",
    against: "contre",
    themeChanged: "Theme actif",
    nextThrow: "A toi",
    explosion: "Explosion",
    finalHit: "a reussi le coup final",
    won: "Victoire",
    winnerNote: "Prochain duel pret",
    askP1: "Nom du joueur 1:",
    askP2: "Nom du joueur 2:",
  },
  pt: {
    title: "Jogo dos Gorilas",
    wind: "Vento",
    angle: "Angulo",
    velocity: "Forca",
    newGame: "Novo jogo",
    onePlayer: "Um jogador",
    twoPlayers: "Dois jogadores",
    autoplay: "Automatico",
    style: "Tema",
    musicOn: "Musica: sim",
    musicOff: "Musica: nao",
    player: "Jogador",
    player1: "Jogador 1",
    player2: "Jogador 2",
    computer: "Computador",
    computer1: "Computador 1",
    computer2: "Computador 2",
    versusComputer: "Jogador vs. Computador",
    versusPlayer: "Jogador vs. Jogador",
    automatic: "Automatico",
    instruction: "Arraste a banana para mirar",
    preparing: "Preparando partida",
    turn: "Vez de",
    thinking: "esta calculando",
    thrown: "lancou a banana",
    newMatch: "Nova partida",
    against: "contra",
    themeChanged: "Tema ativo",
    nextThrow: "Agora joga",
    explosion: "Explosao",
    finalHit: "acertou o golpe final",
    won: "Venceu",
    winnerNote: "Proximo duelo pronto",
    askP1: "Nome do jogador 1:",
    askP2: "Nome do jogador 2:",
  },
  de: {
    title: "Gorillas Spiel",
    wind: "Wind",
    angle: "Winkel",
    velocity: "Kraft",
    newGame: "Neues spiel",
    onePlayer: "Ein spieler",
    twoPlayers: "Zwei spieler",
    autoplay: "Automatisch",
    style: "Thema",
    musicOn: "Musik: an",
    musicOff: "Musik: aus",
    player: "Spieler",
    player1: "Spieler 1",
    player2: "Spieler 2",
    computer: "Computer",
    computer1: "Computer 1",
    computer2: "Computer 2",
    versusComputer: "Spieler vs. Computer",
    versusPlayer: "Spieler vs. Spieler",
    automatic: "Automatisch",
    instruction: "Ziehe die banane zum zielen",
    preparing: "Spiel wird vorbereitet",
    turn: "Zug von",
    thinking: "berechnet den wurf",
    thrown: "warf die banane",
    newMatch: "Neues spiel",
    against: "gegen",
    themeChanged: "Aktives thema",
    nextThrow: "Jetzt wirft",
    explosion: "Explosion",
    finalHit: "traf den letzten schlag",
    won: "Gewonnen",
    winnerNote: "Naechstes duell bereit",
    askP1: "Name von spieler 1:",
    askP2: "Name von spieler 2:",
  },
  it: {
    title: "Gioco dei Gorilla",
    wind: "Vento",
    angle: "Angolo",
    velocity: "Forza",
    newGame: "Nuova partita",
    onePlayer: "Un giocatore",
    twoPlayers: "Due giocatori",
    autoplay: "Automatico",
    style: "Tema",
    musicOn: "Musica: si",
    musicOff: "Musica: no",
    player: "Giocatore",
    player1: "Giocatore 1",
    player2: "Giocatore 2",
    computer: "Computer",
    computer1: "Computer 1",
    computer2: "Computer 2",
    versusComputer: "Giocatore vs. Computer",
    versusPlayer: "Giocatore vs. Giocatore",
    automatic: "Automatico",
    instruction: "Trascina la banana per mirare",
    preparing: "Preparando partita",
    turn: "Turno di",
    thinking: "sta calcolando",
    thrown: "ha lanciato la banana",
    newMatch: "Nuova partita",
    against: "contro",
    themeChanged: "Tema attivo",
    nextThrow: "Ora lancia",
    explosion: "Esplosione",
    finalHit: "ha fatto il colpo finale",
    won: "Ha vinto",
    winnerNote: "Prossimo duello pronto",
    askP1: "Nome del giocatore 1:",
    askP2: "Nome del giocatore 2:",
  },
};

let playerNames = {
  player1: "Jugador",
  player2: "Computadora",
};

let musicAudio = undefined;

const blastHoleRadius = 18;
const maxBlastHoleRadius = 46;

function getTheme() {
  return themes[settings.themeIndex] ?? themes[0];
}

function t(key) {
  return translations[settings.language][key];
}

function themeName(theme = getTheme()) {
  return theme.names[settings.language] ?? theme.names.es;
}

// El canvas es donde se dibuja la ciudad, los gorilas, la banana y los impactos.
const canvas = document.getElementById("game");
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
const ctx = canvas.getContext("2d");

// Elementos del molino y del indicador de viento.
const windmillDOM = document.getElementById("windmill");
const windmillHeadDOM = document.getElementById("windmill-head");
const windInfoDOM = document.getElementById("wind-info");
const windSpeedDOM = document.getElementById("wind-speed");

// Panel del jugador de la izquierda: nombre, angulo y fuerza.
const info1DOM = document.getElementById("info-left");
const name1DOM = document.querySelector("#info-left .name");
const angle1DOM = document.querySelector("#info-left .angle");
const velocity1DOM = document.querySelector("#info-left .velocity");
const angleLabelDOM = document.querySelectorAll(".angle-label");
const velocityLabelDOM = document.querySelectorAll(".velocity-label");

// Panel del jugador de la derecha: nombre, angulo y fuerza.
const info2DOM = document.getElementById("info-right");
const name2DOM = document.querySelector("#info-right .name");
const angle2DOM = document.querySelector("#info-right .angle");
const velocity2DOM = document.querySelector("#info-right .velocity");

// Texto central que indica que se debe arrastrar la banana para apuntar.
const instructionsDOM = document.getElementById("instructions");
const gameModeDOM = document.getElementById("game-mode");
const instructionTitleDOM = document.getElementById("instruction-title");
const windLabelDOM = document.getElementById("wind-label");

// Area invisible que permite agarrar la banana con el mouse.
const bombGrabAreaDOM = document.getElementById("bomb-grab-area");

// Panel que aparece al final para mostrar quien gano.
const congratulationsDOM = document.getElementById("congratulations");
const winnerDOM = document.getElementById("winner");
const winnerPrefixDOM = document.getElementById("winner-prefix");
const winnerNoteDOM = document.getElementById("winner-note");

// Panel de actividad: muestra turnos, jugadores y eventos importantes del juego.
const turnMessageDOM = document.getElementById("turn-message");
const panelPlayerOneDOM = document.getElementById("panel-player-one");
const panelPlayerTwoDOM = document.getElementById("panel-player-two");
const activityLogDOM = document.getElementById("activity-log");
const panelTitleDOM = document.getElementById("panel-title");

// Barra de controles: nuevo juego, cambio de tema, musica e idioma.
const settingsDOM = document.getElementById("settings");
const singlePlayerButtonDOM = document.querySelectorAll(".single-player");
const twoPlayersButtonDOM = document.querySelectorAll(".two-players");
const autoPlayButtonDOM = document.querySelectorAll(".auto-play");
const newGameLabelDOM = document.querySelectorAll(".new-game-label");
const colorModeButtonDOM = document.getElementById("color-mode");
const musicToggleDOM = document.getElementById("music-toggle");
const languageSelectDOM = document.getElementById("language-select");

colorModeButtonDOM.addEventListener("click", () => {
  rotateTheme();
  logActivity(`${t("themeChanged")}: ${themeName()}.`);
  restartMusic();
  draw();
});

musicToggleDOM.addEventListener("click", () => {
  settings.musicEnabled = !settings.musicEnabled;
  if (settings.musicEnabled) {
    startMusic().catch(() => {
      settings.musicEnabled = false;
      updateStaticText();
    });
  } else {
    stopMusic();
  }
  updateStaticText();
});

languageSelectDOM.addEventListener("change", () => {
  settings.language = languageSelectDOM.value;
  document.documentElement.lang = settings.language;
  updateStaticText();
  updatePlayerLabels();
  setTurnMessage(`${t("turn")} ${getCurrentPlayerName()}`);
  logActivity(`${t("themeChanged")}: ${themeName()}.`);
});

updateStaticText();
newGame();

function rotateTheme() {
  settings.themeIndex = (settings.themeIndex + 1) % themes.length;
  const theme = getTheme();
  document.body.className = `theme-${theme.id}`;
  colorModeButtonDOM.innerText = `${t("style")}: ${themeName(theme)}`;
}

function updateStaticText() {
  document.title = t("title");
  windLabelDOM.innerText = t("wind");
  angleLabelDOM.forEach((label) => (label.innerText = t("angle")));
  velocityLabelDOM.forEach((label) => (label.innerText = t("velocity")));
  instructionTitleDOM.innerText = t("instruction");
  panelTitleDOM.innerText = t("themeChanged");
  winnerPrefixDOM.innerText = t("won");
  winnerNoteDOM.innerText = t("winnerNote");
  newGameLabelDOM.forEach((label) => (label.innerText = t("newGame")));
  singlePlayerButtonDOM.forEach((button) => (button.innerText = t("onePlayer")));
  twoPlayersButtonDOM.forEach((button) => (button.innerText = t("twoPlayers")));
  autoPlayButtonDOM.forEach((button) => (button.innerText = t("autoplay")));
  colorModeButtonDOM.innerText = `${t("style")}: ${themeName()}`;
  musicToggleDOM.innerText = settings.musicEnabled ? t("musicOn") : t("musicOff");

  if (settings.numberOfPlayers === 1) gameModeDOM.innerText = t("versusComputer");
  if (settings.numberOfPlayers === 2) gameModeDOM.innerText = t("versusPlayer");
  if (settings.numberOfPlayers === 0) gameModeDOM.innerText = t("automatic");
}

function askPlayerNames() {
  if (settings.numberOfPlayers === 0) {
    playerNames = { player1: t("computer1"), player2: t("computer2") };
    return;
  }

  const firstName =
    prompt(t("askP1"), playerNames.player1) || t("player1");

  if (settings.numberOfPlayers === 1) {
    playerNames = {
      player1: cleanPlayerName(firstName, t("player")),
      player2: t("computer"),
    };
    return;
  }

  const secondName =
    prompt(t("askP2"), playerNames.player2) || t("player2");
  playerNames = {
    player1: cleanPlayerName(firstName, t("player1")),
    player2: cleanPlayerName(secondName, t("player2")),
  };
}

function cleanPlayerName(name, fallback) {
  return name.trim().slice(0, 18) || fallback;
}

function updatePlayerLabels() {
  name1DOM.innerText = playerNames.player1;
  name2DOM.innerText = playerNames.player2;
  panelPlayerOneDOM.innerText = `${t("player1")}: ${playerNames.player1}`;
  panelPlayerTwoDOM.innerText = `${t("player2")}: ${playerNames.player2}`;
}

function setTurnMessage(message) {
  turnMessageDOM.innerText = message;
}

function logActivity(message) {
  const item = document.createElement("li");
  item.innerText = message;
  activityLogDOM.prepend(item);

  while (activityLogDOM.children.length > 30) {
    activityLogDOM.lastElementChild.remove();
  }
}

function startMusic() {
  stopMusic();
  musicAudio = new Audio(getTheme().track);
  musicAudio.loop = true;
  musicAudio.volume = 0.55;
  return musicAudio.play();
}

function stopMusic() {
  if (!musicAudio) return;
  musicAudio.pause();
  musicAudio.currentTime = 0;
  musicAudio = undefined;
}

function restartMusic() {
  if (!settings.musicEnabled) return;
  startMusic().catch(() => {
    settings.musicEnabled = false;
    updateStaticText();
  });
}

function newGame() {
  rotateTheme();
  updateStaticText();
  restartMusic();
  askPlayerNames();

  // Reinicio la partida desde cero para que cada juego tenga ciudad, viento y tema nuevos.
  state = {
    phase: "aiming", // aiming = apuntando, in flight = banana en vuelo, celebrating = alguien gano.
    currentPlayer: 1,
    round: 1,
    windSpeed: generateWindSpeed(),
    bomb: {
      x: undefined,
      y: undefined,
      rotation: 0,
      velocity: { x: 0, y: 0 },
      highlight: true,
    },

    // Aqui se guardan los edificios principales, los del fondo y los agujeros de impactos.
    backgroundBuildings: [],
    buildings: [],
    blastHoles: [],
    explosions: [],

    stars: [],

    scale: 1,
    shift: 0,
  };

  // Genero estrellas aleatorias para los temas nocturnos.
  for (let i = 0; i < (window.innerWidth * window.innerHeight) / 12000; i++) {
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    state.stars.push({ x, y });
  }

  // Creo edificios del fondo para que la ciudad tenga profundidad.
  for (let i = 0; i < 17; i++) {
    generateBackgroundBuilding(i);
  }

  // Creo los edificios principales donde se paran los gorilas.
  for (let i = 0; i < 8; i++) {
    generateBuilding(i);
  }

  calculateScaleAndShift();
  initializeBombPosition();
  initializeWindmillPosition();
  setWindMillRotation();

  // Cancelo animaciones anteriores para que una partida nueva no se mezcle con la anterior.
  cancelAnimationFrame(animationFrameRequestID);
  cancelAnimationFrame(explosionAnimationFrameID);
  clearTimeout(delayTimeoutID);

  // Reinicio los textos y paneles visibles de la interfaz.
  if (settings.numberOfPlayers > 0) {
    showInstructions();
  } else {
    hideInstructions();
  }
  hideCongratulations();
  updatePlayerLabels();
  setTurnMessage(`${t("turn")} ${playerNames.player1}`);
  activityLogDOM.innerHTML = "";
  logActivity(`${t("newMatch")}: ${playerNames.player1} ${t("against")} ${playerNames.player2}.`);
  logActivity(`${t("themeChanged")}: ${themeName()}.`);
  angle1DOM.innerText = 0;
  velocity1DOM.innerText = 0;
  angle2DOM.innerText = 0;
  velocity2DOM.innerText = 0;

  // Apago el modo de simulacion que usa la computadora para calcular su tiro.
  simulationMode = false;
  simulationImpact = {};

  draw();

  if (settings.numberOfPlayers === 0) {
    computerThrow();
  }
}

function showInstructions() {
  instructionsDOM.style.opacity = 1;
  instructionsDOM.style.visibility = "visible";
}

function hideInstructions() {
  state.bomb.highlight = false;
  instructionsDOM.style.opacity = 0;
  instructionsDOM.style.visibility = "hidden";
}

function showCongratulations() {
  congratulationsDOM.style.opacity = 1;
  congratulationsDOM.style.visibility = "visible";
}

function hideCongratulations() {
  congratulationsDOM.style.opacity = 0;
  congratulationsDOM.style.visibility = "hidden";
}

function generateBackgroundBuilding(index) {
  const previousBuilding = state.backgroundBuildings[index - 1];

  const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4
    : -300;

  const minWidth = 60;
  const maxWidth = 110;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  const smallerBuilding = index < 4 || index >= 13;

  const minHeight = 80;
  const maxHeight = 350;
  const smallMinHeight = 20;
  const smallMaxHeight = 150;
  const height = smallerBuilding
    ? smallMinHeight + Math.random() * (smallMaxHeight - smallMinHeight)
    : minHeight + Math.random() * (maxHeight - minHeight);

  state.backgroundBuildings.push({ x, width, height });
}

function generateBuilding(index) {
  const previousBuilding = state.buildings[index - 1];

  const x = previousBuilding
    ? previousBuilding.x + previousBuilding.width + 4
    : 0;

  const minWidth = 80;
  const maxWidth = 130;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  const smallerBuilding = index <= 1 || index >= 6;

  const minHeight = 40;
  const maxHeight = 300;
  const minHeightGorilla = 30;
  const maxHeightGorilla = 150;

  const height = smallerBuilding
    ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
    : minHeight + Math.random() * (maxHeight - minHeight);

  // Cada ventana se enciende o se apaga al azar para que los edificios no se vean planos.
  const lightsOn = [];
  for (let i = 0; i < 50; i++) {
    const light = Math.random() <= 0.33 ? true : false;
    lightsOn.push(light);
  }

  state.buildings.push({ x, width, height, lightsOn });
}

function calculateScaleAndShift() {
  const lastBuilding = state.buildings.at(-1);
  const totalWidthOfTheCity = lastBuilding.x + lastBuilding.width;

  const horizontalScale = window.innerWidth / totalWidthOfTheCity ?? 1;
  const verticalScale = window.innerHeight / 500;

  state.scale = Math.min(horizontalScale, verticalScale);

  const sceneNeedsToBeShifted = horizontalScale > verticalScale;

  state.shift = sceneNeedsToBeShifted
    ? (window.innerWidth - totalWidthOfTheCity * state.scale) / 2
    : 0;
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  calculateScaleAndShift();
  initializeBombPosition();
  initializeWindmillPosition();
  draw();
});

function initializeBombPosition() {
  const building =
    state.currentPlayer === 1
      ? state.buildings.at(1) // Segundo edificio: posicion del jugador izquierdo.
      : state.buildings.at(-2); // Penultimo edificio: posicion del jugador derecho.

  const gorillaX = building.x + building.width / 2;
  const gorillaY = building.height;

  const gorillaHandOffsetX = state.currentPlayer === 1 ? -28 : 28;
  const gorillaHandOffsetY = 107;

  state.bomb.x = gorillaX + gorillaHandOffsetX;
  state.bomb.y = gorillaY + gorillaHandOffsetY;
  state.bomb.velocity.x = 0;
  state.bomb.velocity.y = 0;
  state.bomb.rotation = 0;

  // Muevo el area invisible para que coincida con la banana que se arrastra.
  const grabAreaRadius = 15;
  const left = state.bomb.x * state.scale + state.shift - grabAreaRadius;
  const bottom = state.bomb.y * state.scale - grabAreaRadius;

  bombGrabAreaDOM.style.left = `${left}px`;
  bombGrabAreaDOM.style.bottom = `${bottom}px`;
}

function initializeWindmillPosition() {
  // Coloco el molino encima del ultimo edificio para mostrar el viento.
  const lastBuilding = state.buildings.at(-1);
  let rooftopY = lastBuilding.height * state.scale;
  let rooftopX =
    (lastBuilding.x + lastBuilding.width / 2) * state.scale + state.shift;

  windmillDOM.style.bottom = `${rooftopY}px`;
  windmillDOM.style.left = `${rooftopX - 100}px`;

  windmillDOM.style.scale = state.scale;

  windInfoDOM.style.bottom = `${rooftopY}px`;
  windInfoDOM.style.left = `${rooftopX - 50}px`;
}

function draw() {
  ctx.save();

  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  drawBackgroundSky();

  // Invierto el sistema de coordenadas para dibujar desde el suelo hacia arriba.
  ctx.translate(0, window.innerHeight);
  ctx.scale(1, -1);

  // Ajusto la escala para que la ciudad quepa y quede centrada en la pantalla.
  ctx.translate(state.shift, 0);
  ctx.scale(state.scale, state.scale);

  // Dibujo toda la escena en orden: fondo, edificios, gorilas y banana.
  drawBackgroundMoon();
  drawBackgroundBuildings();
  drawBuildingsWithBlastHoles();
  drawExplosionEffects();
  drawGorilla(1);
  drawGorilla(2);
  drawBomb();

  // Restauro el canvas para no afectar otros dibujos.
  ctx.restore();
}

function drawBackgroundSky() {
  const theme = getTheme();
  const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(1, theme.sky[0]);
  gradient.addColorStop(0, theme.sky[1]);

  // Pinto el cielo con los colores del tema actual.
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // En algunos temas agrego estrellas para dar ambiente nocturno.
  if (
    theme.id === "classic-night" ||
    theme.id === "arcade" ||
    theme.id === "storm" ||
    theme.id === "red-alert"
  ) {
    ctx.fillStyle = "white";
    state.stars.forEach((star) => {
      ctx.fillRect(star.x, star.y, 1, 1);
    });
  }
}

function drawBackgroundMoon() {
  const theme = getTheme();
  ctx.fillStyle = theme.moon;
  ctx.beginPath();
  ctx.arc(
    window.innerWidth / state.scale - state.shift - 200,
    window.innerHeight / state.scale - 100,
    theme.moonSize,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function drawBackgroundBuildings() {
  const theme = getTheme();
  state.backgroundBuildings.forEach((building) => {
    ctx.fillStyle = theme.backgroundBuilding;
    ctx.fillRect(building.x, 0, building.width, building.height);
  });
}

function drawBuildingsWithBlastHoles() {
  ctx.save();

  state.blastHoles.forEach((blastHole) => {
    ctx.beginPath();

    // Primero marco toda la pantalla como area visible.
    ctx.rect(
      0,
      0,
      window.innerWidth / state.scale,
      window.innerHeight / state.scale
    );

    // Luego recorto un circulo donde cayo la banana; el radio crece con cada impacto.
    ctx.arc(
      blastHole.x,
      blastHole.y,
      blastHole.radius,
      0,
      2 * Math.PI,
      true
    );

    ctx.clip();
  });

  drawBuildings();

  ctx.restore();
}

function drawExplosionEffects() {
  const theme = getTheme();

  state.explosions.forEach((explosion) => {
    const progress = Math.min(explosion.age / explosion.duration, 1);
    const alpha = 1 - progress;
    const ringRadius = explosion.radius + progress * explosion.radius * 1.4;

    ctx.save();
    ctx.translate(explosion.x, explosion.y);
    ctx.globalAlpha = alpha;

    // Onda principal: grande, clara y con pocos elementos para que no se vea saturada.
    ctx.strokeStyle = theme.explosion[1];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Centro de la explosion: un brillo pequeno que desaparece rapido.
    ctx.fillStyle = theme.explosion[0];
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(4, explosion.radius * 0.32 * alpha), 0, 2 * Math.PI);
    ctx.fill();

    // Chispas controladas: pocas lineas para que se vea escandaloso, pero limpio.
    ctx.strokeStyle = theme.explosion[2];
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < explosion.sparkCount; i++) {
      const angle = (i / explosion.sparkCount) * 2 * Math.PI;
      const start = explosion.radius * 0.65;
      const end = explosion.radius * (1.05 + progress * 0.75);
      ctx.moveTo(Math.cos(angle) * start, Math.sin(angle) * start);
      ctx.lineTo(Math.cos(angle) * end, Math.sin(angle) * end);
    }
    ctx.stroke();

    ctx.restore();
  });
}

function drawBuildings() {
  const theme = getTheme();
  state.buildings.forEach((building) => {
    // Dibujo el bloque principal del edificio con el color del tema.
    ctx.fillStyle = theme.building;
    ctx.fillRect(building.x, 0, building.width, building.height);

    // Dibujo las ventanas del edificio.
    const windowWidth = 10;
    const windowHeight = 12;
    const gap = 15;

    const numberOfFloors = Math.ceil(
      (building.height - gap) / (windowHeight + gap)
    );
    const numberOfRoomsPerFloor = Math.floor(
      (building.width - gap) / (windowWidth + gap)
    );

    for (let floor = 0; floor < numberOfFloors; floor++) {
      for (let room = 0; room < numberOfRoomsPerFloor; room++) {
        if (building.lightsOn[floor * numberOfRoomsPerFloor + room]) {
          ctx.save();

          ctx.translate(building.x + gap, building.height - gap);
          ctx.scale(1, -1);

          const x = room * (windowWidth + gap);
          const y = floor * (windowHeight + gap);

          ctx.fillStyle = theme.window;
          ctx.fillRect(x, y, windowWidth, windowHeight);

          ctx.restore();
        }
      }
    }
  });
}

function drawGorilla(player) {
  ctx.save();

  const building =
    player === 1
      ? state.buildings.at(1) // Segundo edificio: gorila izquierdo.
      : state.buildings.at(-2); // Penultimo edificio: gorila derecho.

  ctx.translate(building.x + building.width / 2, building.height);

  drawGorillaBody();
  drawGorillaLeftArm(player);
  drawGorillaRightArm(player);
  drawGorillaFace(player);
  drawGorillaThoughtBubbles(player);

  ctx.restore();
}

function drawGorillaBody() {
  ctx.fillStyle = getTheme().gorilla;

  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.lineTo(-7, 0);
  ctx.lineTo(-20, 0);
  ctx.lineTo(-17, 18);
  ctx.lineTo(-20, 44);

  ctx.lineTo(-11, 77);
  ctx.lineTo(0, 84);
  ctx.lineTo(11, 77);

  ctx.lineTo(20, 44);
  ctx.lineTo(17, 18);
  ctx.lineTo(20, 0);
  ctx.lineTo(7, 0);
  ctx.fill();
}

function drawGorillaLeftArm(player) {
  ctx.strokeStyle = getTheme().gorilla;
  ctx.lineWidth = 18;

  ctx.beginPath();
  ctx.moveTo(-14, 50);

  if (state.phase === "aiming" && state.currentPlayer === 1 && player === 1) {
    ctx.quadraticCurveTo(
      -44,
      63,
      -28 - state.bomb.velocity.x / 6.25,
      107 - state.bomb.velocity.y / 6.25
    );
  } else if (state.phase === "celebrating" && state.currentPlayer === player) {
    ctx.quadraticCurveTo(-44, 63, -28, 107);
  } else {
    ctx.quadraticCurveTo(-44, 45, -28, 12);
  }

  ctx.stroke();
}

function drawGorillaRightArm(player) {
  ctx.strokeStyle = getTheme().gorilla;
  ctx.lineWidth = 18;

  ctx.beginPath();
  ctx.moveTo(+14, 50);

  if (state.phase === "aiming" && state.currentPlayer === 2 && player === 2) {
    ctx.quadraticCurveTo(
      +44,
      63,
      +28 - state.bomb.velocity.x / 6.25,
      107 - state.bomb.velocity.y / 6.25
    );
  } else if (state.phase === "celebrating" && state.currentPlayer === player) {
    ctx.quadraticCurveTo(+44, 63, +28, 107);
  } else {
    ctx.quadraticCurveTo(+44, 45, +28, 12);
  }

  ctx.stroke();
}

function drawGorillaFace(player) {
  // Cara del gorila.
  ctx.fillStyle = getTheme().gorillaFace;
  ctx.beginPath();
  ctx.arc(0, 63, 9, 0, 2 * Math.PI);
  ctx.moveTo(-3.5, 70);
  ctx.arc(-3.5, 70, 4, 0, 2 * Math.PI);
  ctx.moveTo(+3.5, 70);
  ctx.arc(+3.5, 70, 4, 0, 2 * Math.PI);
  ctx.fill();

  // Ojos del gorila.
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-3.5, 70, 1.4, 0, 2 * Math.PI);
  ctx.moveTo(+3.5, 70);
  ctx.arc(+3.5, 70, 1.4, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = getTheme().gorilla;
  ctx.lineWidth = 1.4;

  // Nariz del gorila.
  ctx.beginPath();
  ctx.moveTo(-3.5, 66.5);
  ctx.lineTo(-1.5, 65);
  ctx.moveTo(3.5, 66.5);
  ctx.lineTo(1.5, 65);
  ctx.stroke();

  // Boca del gorila; cambia cuando gana.
  ctx.beginPath();
  if (state.phase === "celebrating" && state.currentPlayer === player) {
    ctx.moveTo(-5, 60);
    ctx.quadraticCurveTo(0, 56, 5, 60);
  } else {
    ctx.moveTo(-5, 56);
    ctx.quadraticCurveTo(0, 60, 5, 56);
  }
  ctx.stroke();
}

function drawGorillaThoughtBubbles(player) {
  if (state.phase === "aiming") {
    const currentPlayerIsComputer =
      (settings.numberOfPlayers === 0 &&
        state.currentPlayer === 1 &&
        player === 1) ||
      (settings.numberOfPlayers !== 2 &&
        state.currentPlayer === 2 &&
        player === 2);

    if (currentPlayerIsComputer) {
      ctx.save();
      ctx.scale(1, -1);

      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("?", 0, -90);

      ctx.font = "10px sans-serif";

      ctx.rotate((5 / 180) * Math.PI);
      ctx.fillText("?", 0, -90);

      ctx.rotate((-10 / 180) * Math.PI);
      ctx.fillText("?", 0, -90);

      ctx.restore();
    }
  }
}

function drawBomb() {
  const theme = getTheme();
  ctx.save();
  ctx.translate(state.bomb.x, state.bomb.y);

  if (state.phase === "aiming") {
    // Mientras se apunta, la banana se mueve siguiendo el arrastre del mouse.
    ctx.translate(-state.bomb.velocity.x / 6.25, -state.bomb.velocity.y / 6.25);

    // Esta linea punteada ayuda a ver la direccion y fuerza del tiro.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.setLineDash([3, 8]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(state.bomb.velocity.x, state.bomb.velocity.y);
    ctx.stroke();

    // Dibujo la banana quieta mientras se esta apuntando.
    ctx.fillStyle = theme.bomb;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
    ctx.fill();
  } else if (state.phase === "in flight") {
    // Cuando se lanza, la banana gira en el aire.
    ctx.fillStyle = theme.bomb;
    ctx.rotate(state.bomb.rotation);
    ctx.beginPath();
    ctx.moveTo(-8, -2);
    ctx.quadraticCurveTo(0, 12, 8, -2);
    ctx.quadraticCurveTo(0, 2, -8, -2);
    ctx.fill();
  } else {
    // Si la partida esta celebrando, dejo la banana simple.
    ctx.fillStyle = theme.bomb;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Restore transformation
  ctx.restore();

  // Si la banana sube demasiado, muestro una flecha para saber por donde va.
  if (state.bomb.y > window.innerHeight / state.scale) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    const distance = state.bomb.y - window.innerHeight / state.scale;
    ctx.moveTo(state.bomb.x, window.innerHeight / state.scale - 10);
    ctx.lineTo(state.bomb.x, window.innerHeight / state.scale - distance);
    ctx.moveTo(state.bomb.x, window.innerHeight / state.scale - 10);
    ctx.lineTo(state.bomb.x - 5, window.innerHeight / state.scale - 15);
    ctx.moveTo(state.bomb.x, window.innerHeight / state.scale - 10);
    ctx.lineTo(state.bomb.x + 5, window.innerHeight / state.scale - 15);
    ctx.stroke();
  }

  // Al inicio marco la banana para que el jugador sepa donde arrastrar.
  if (state.bomb.highlight) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.moveTo(state.bomb.x, state.bomb.y + 20);
    ctx.lineTo(state.bomb.x, state.bomb.y + 120);
    ctx.moveTo(state.bomb.x, state.bomb.y + 20);
    ctx.lineTo(state.bomb.x - 5, state.bomb.y + 25);
    ctx.moveTo(state.bomb.x, state.bomb.y + 20);
    ctx.lineTo(state.bomb.x + 5, state.bomb.y + 25);
    ctx.stroke();
  }
}

// Eventos del mouse: aqui empieza el tiro cuando se arrastra la banana.
bombGrabAreaDOM.addEventListener("mousedown", function (e) {
  hideInstructions();
  if (state.phase === "aiming") {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    document.body.style.cursor = "grabbing";
  }
});

window.addEventListener("mousemove", function (e) {
  if (isDragging) {
    let deltaX = e.clientX - dragStartX;
    let deltaY = e.clientY - dragStartY;

    state.bomb.velocity.x = -deltaX;
    state.bomb.velocity.y = deltaY;
    setInfo(deltaX, deltaY);

    draw();
  }
});

// Calculo angulo y fuerza segun cuanto se arrastro el mouse.
function setInfo(deltaX, deltaY) {
  const hypotenuse = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angleInRadians = Math.asin(deltaY / hypotenuse);
  const angleInDegrees = (angleInRadians / Math.PI) * 180;

  if (state.currentPlayer === 1) {
    angle1DOM.innerText = Math.round(angleInDegrees);
    velocity1DOM.innerText = Math.round(hypotenuse);
  } else {
    angle2DOM.innerText = Math.round(angleInDegrees);
    velocity2DOM.innerText = Math.round(hypotenuse);
  }
}

function getCurrentPlayerName() {
  return state.currentPlayer === 1 ? playerNames.player1 : playerNames.player2;
}

window.addEventListener("mouseup", function () {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = "default";

    throwBomb();
  }
});

function computerThrow() {
  setTurnMessage(`${getCurrentPlayerName()} ${t("thinking")}.`);
  logActivity(`${getCurrentPlayerName()} ${t("thinking")}.`);
  const numberOfSimulations = 2 + state.round * 3;
  const bestThrow = runSimulations(numberOfSimulations);

  initializeBombPosition();
  state.bomb.velocity.x = bestThrow.velocityX;
  state.bomb.velocity.y = bestThrow.velocityY;
  setInfo(bestThrow.velocityX, bestThrow.velocityY);

  // Dibujo el gorila apuntando para que parezca que la computadora esta preparando el tiro.
  draw();

  // Espero un segundo para que el turno de la computadora se sienta mas natural.
  delayTimeoutID = setTimeout(throwBomb, 1000);
}

// La computadora prueba varios tiros invisibles y elige el que queda mas cerca del rival.
function runSimulations(numberOfSimulations) {
  let bestThrow = {
    velocityX: undefined,
    velocityY: undefined,
    distance: Infinity,
  };
  simulationMode = true;

  // Calculo el centro aproximado del gorila enemigo.
  const enemyBuilding =
    state.currentPlayer === 1
      ? state.buildings.at(-2) // Penultimo edificio: enemigo del jugador izquierdo.
      : state.buildings.at(1); // Segundo edificio: enemigo del jugador derecho.
  const enemyX = enemyBuilding.x + enemyBuilding.width / 2;
  const enemyY = enemyBuilding.height + 30;

  for (let i = 0; i < numberOfSimulations; i++) {
    // Pruebo un angulo y una fuerza al azar.
    const angleInDegrees = -10 + Math.random() * 100;
    const angleInRadians = (angleInDegrees / 180) * Math.PI;
    const velocity = 40 + Math.random() * 130;

    // Convierto ese angulo y fuerza en movimiento horizontal y vertical.
    const direction = state.currentPlayer === 1 ? 1 : -1;
    const velocityX = Math.cos(angleInRadians) * velocity * direction;
    const velocityY = Math.sin(angleInRadians) * velocity;

    initializeBombPosition();
    state.bomb.velocity.x = velocityX;
    state.bomb.velocity.y = velocityY;

    throwBomb();

    // Mido que tan cerca quedo el impacto del enemigo.
    const distance = Math.sqrt(
      (enemyX - simulationImpact.x) ** 2 + (enemyY - simulationImpact.y) ** 2
    );

    // Si este tiro fue mejor que los anteriores, lo guardo como el mejor tiro.
    if (distance < bestThrow.distance) {
      bestThrow = { velocityX, velocityY, distance };
    }
  }

  simulationMode = false;
  return bestThrow;
}

function throwBomb() {
  if (simulationMode) {
    previousAnimationTimestamp = 0;
    animate(16);
  } else {
    state.phase = "in flight";
    setTurnMessage(`${getCurrentPlayerName()} ${t("thrown")}.`);
    logActivity(`${getCurrentPlayerName()} ${t("thrown")}.`);
    previousAnimationTimestamp = undefined;
    animationFrameRequestID = requestAnimationFrame(animate);
  }
}

function animate(timestamp) {
  if (previousAnimationTimestamp === undefined) {
    previousAnimationTimestamp = timestamp;
    animationFrameRequestID = requestAnimationFrame(animate);
    return;
  }

  const elapsedTime = timestamp - previousAnimationTimestamp;

  // Divido cada movimiento en pasos pequenos para detectar golpes con mas precision.
  const hitDetectionPrecision = 10;
  for (let i = 0; i < hitDetectionPrecision; i++) {
    moveBomb(elapsedTime / hitDetectionPrecision);

    // Reviso si la banana salio de pantalla, pego en un edificio o golpeo al gorila.
    const miss = checkFrameHit() || checkBuildingHit(); // Fallo: salio de pantalla o pego en edificio.
    const hit = checkGorillaHit(); // Acierto: golpeo al gorila rival.

    if (simulationMode && (hit || miss)) {
      simulationImpact = { x: state.bomb.x, y: state.bomb.y };
      return; // La simulacion invisible termina aqui.
    }

    // Si fallo el tiro, cambio de jugador y preparo la siguiente banana.
    if (miss) {
      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1; // Cambio el turno.
      if (state.currentPlayer === 1) state.round++;
      state.phase = "aiming";
      initializeBombPosition();
      setTurnMessage(`${t("turn")} ${getCurrentPlayerName()}`);
      logActivity(`${t("nextThrow")}: ${getCurrentPlayerName()}.`);

      draw();

      const computerThrowsNext =
        settings.numberOfPlayers === 0 ||
        (settings.numberOfPlayers === 1 && state.currentPlayer === 2);

      if (computerThrowsNext) setTimeout(computerThrow, 50);

      return;
    }

    // Si golpea al gorila rival, termina la partida y se anuncia el ganador.
    if (hit) {
      state.phase = "celebrating";
      addExplosion(state.bomb.x, state.bomb.y, getNextBlastRadius() + 12);
      logActivity(`${getCurrentPlayerName()} ${t("finalHit")}.`);
      announceWinner();

      draw();
      return;
    }
  }

  if (!simulationMode) draw();

  // Si la banana sigue en vuelo, continuo la animacion.
  previousAnimationTimestamp = timestamp;
  if (simulationMode) {
    animate(timestamp + 16);
  } else {
    animationFrameRequestID = requestAnimationFrame(animate);
  }
}

function addExplosion(x, y, radius) {
  state.explosions.push({
    x,
    y,
    radius,
    age: 0,
    duration: 520,
    sparkCount: Math.min(18, 8 + state.blastHoles.length),
  });
  startExplosionAnimation();
}

function startExplosionAnimation() {
  cancelAnimationFrame(explosionAnimationFrameID);
  let previousExplosionTimestamp = undefined;

  function animateExplosion(timestamp) {
    if (previousExplosionTimestamp === undefined) {
      previousExplosionTimestamp = timestamp;
      explosionAnimationFrameID = requestAnimationFrame(animateExplosion);
      return;
    }

    const elapsedTime = timestamp - previousExplosionTimestamp;
    previousExplosionTimestamp = timestamp;

    state.explosions.forEach((explosion) => {
      explosion.age += elapsedTime;
    });

    state.explosions = state.explosions.filter(
      (explosion) => explosion.age < explosion.duration
    );

    draw();

    if (state.explosions.length > 0) {
      explosionAnimationFrameID = requestAnimationFrame(animateExplosion);
    }
  }

  explosionAnimationFrameID = requestAnimationFrame(animateExplosion);
}

function getNextBlastRadius() {
  return Math.min(maxBlastHoleRadius, blastHoleRadius + state.blastHoles.length * 5);
}

function moveBomb(elapsedTime) {
  const multiplier = elapsedTime / 200;

  // El viento empuja la banana hacia la izquierda o derecha.
  state.bomb.velocity.x += state.windSpeed * multiplier;

  // La gravedad hace que la banana vaya cayendo.
  state.bomb.velocity.y -= 20 * multiplier;

  // Actualizo la posicion de la banana en pantalla.
  state.bomb.x += state.bomb.velocity.x * multiplier;
  state.bomb.y += state.bomb.velocity.y * multiplier;

  // Giro la banana para que el lanzamiento tenga movimiento.
  const direction = state.currentPlayer === 1 ? -1 : +1;
  state.bomb.rotation += direction * 5 * multiplier;
}

function checkFrameHit() {
  // Detengo el tiro si la banana sale por los bordes o cae debajo de la ciudad.
  if (
    state.bomb.y < 0 ||
    state.bomb.x < -state.shift / state.scale ||
    state.bomb.x > (window.innerWidth - state.shift) / state.scale
  ) {
    return true; // La banana salio de la pantalla.
  }
}

function checkBuildingHit() {
  for (let i = 0; i < state.buildings.length; i++) {
    const building = state.buildings[i];
    if (
      state.bomb.x + 4 > building.x &&
      state.bomb.x - 4 < building.x + building.width &&
      state.bomb.y - 4 < 0 + building.height
    ) {
      // Reviso si la banana cae en un agujero que ya existia.
      for (let j = 0; j < state.blastHoles.length; j++) {
        const blastHole = state.blastHoles[j];

        // Calculo la distancia entre la banana y el centro del agujero anterior.
        const horizontalDistance = state.bomb.x - blastHole.x;
        const verticalDistance = state.bomb.y - blastHole.y;
        const distance = Math.sqrt(
          horizontalDistance ** 2 + verticalDistance ** 2
        );
        if (distance < blastHole.radius) {
          // Si ya habia un agujero en ese punto, la banana puede pasar por ahi.
          return false;
        }
      }

      if (!simulationMode) {
        const radius = getNextBlastRadius();
        state.blastHoles.push({ x: state.bomb.x, y: state.bomb.y, radius });
        addExplosion(state.bomb.x, state.bomb.y, radius);
        logActivity(`${t("explosion")} ${state.blastHoles.length}.`);
      }
      return true; // La banana pego en un edificio.
    }
  }
}

function checkGorillaHit() {
  const enemyPlayer = state.currentPlayer === 1 ? 2 : 1;
  const enemyBuilding =
    enemyPlayer === 1
      ? state.buildings.at(1) // Segundo edificio: gorila izquierdo.
      : state.buildings.at(-2); // Penultimo edificio: gorila derecho.

  ctx.save();

  ctx.translate(
    enemyBuilding.x + enemyBuilding.width / 2,
    enemyBuilding.height
  );

  drawGorillaBody();
  let hit = ctx.isPointInPath(state.bomb.x, state.bomb.y);

  drawGorillaLeftArm(enemyPlayer);
  hit ||= ctx.isPointInStroke(state.bomb.x, state.bomb.y);

  drawGorillaRightArm(enemyPlayer);
  hit ||= ctx.isPointInStroke(state.bomb.x, state.bomb.y);

  ctx.restore();

  return hit;
}

function announceWinner() {
  winnerDOM.innerText = getCurrentPlayerName();
  fitWinnerName();
  setTurnMessage(`${t("won")}: ${getCurrentPlayerName()}`);
  showCongratulations();
}

function fitWinnerName() {
  const nameLength = getCurrentPlayerName().length;
  const fontSize = Math.max(1.7, Math.min(2.8, 3.2 - nameLength * 0.08));
  winnerDOM.style.fontSize = `${fontSize}rem`;
}

singlePlayerButtonDOM.forEach((button) =>
  button.addEventListener("click", (event) => {
    event.preventDefault();
    settings.numberOfPlayers = 1;
    gameModeDOM.innerHTML = t("versusComputer");

    newGame();
  })
);

twoPlayersButtonDOM.forEach((button) =>
  button.addEventListener("click", (event) => {
    event.preventDefault();
    settings.numberOfPlayers = 2;
    gameModeDOM.innerHTML = t("versusPlayer");

    newGame();
  })
);

autoPlayButtonDOM.forEach((button) =>
  button.addEventListener("click", (event) => {
    event.preventDefault();
    settings.numberOfPlayers = 0;
    gameModeDOM.innerHTML = t("automatic");

    newGame();
  })
);

function generateWindSpeed() {
  // Genero un viento aleatorio entre -10 y +10 para que cada ronda sea distinta.
  return -10 + Math.random() * 20;
}

function setWindMillRotation() {
  const rotationSpeed = Math.abs(50 / state.windSpeed);
  windmillHeadDOM.style.animationDirection =
    state.windSpeed > 0 ? "normal" : "reverse";
  windmillHeadDOM.style.animationDuration = `${rotationSpeed}s`;

  windSpeedDOM.innerText = Math.round(state.windSpeed);
}

window.addEventListener("mousemove", function (e) {
  settingsDOM.style.opacity = 1;
  info1DOM.style.opacity = 1;
  info2DOM.style.opacity = 1;
});

const enterFullscreen = document.getElementById("enter-fullscreen");
const exitFullscreen = document.getElementById("exit-fullscreen");

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    enterFullscreen.setAttribute("stroke", "transparent");
    exitFullscreen.setAttribute("stroke", "white");
  } else {
    document.exitFullscreen();
    enterFullscreen.setAttribute("stroke", "white");
    exitFullscreen.setAttribute("stroke", "transparent");
  }
}
