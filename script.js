const palabrasConDescripcion = [
    { palabra: "AEROSOL", descripcion: "¿Qué forma farmacéutica gaseosa se inhala para tratar problemas respiratorios?" },
    { palabra: "NEBULIZADOR", descripcion: "¿Cómo se llama el dispositivo que convierte medicamentos líquidos en vapor para inhalación?" },
    { palabra: "CORTICOIDES", descripcion: "Según la Categorización: medicamentos de gran importancia por sus potentes efectos antiinflamatorio e inmunosupresor; sin embargo, pueden provocar diversos efectos secundarios. Se denominan:" },
    { palabra: "PULMON", descripcion: "La importancia de las formas farmacéuticas gaseosas recae en qué estás permiten que el medicamento se administre directamente al:" },
    { palabra: "INHALADOR", descripcion: "¿Qué forma farmacéutica gaseosa es común en el tratamiento del asma?" }
];

const suspenseSound = document.getElementById('suspense-sound');
const perdioSound = document.getElementById('perdio-sound');
const ganoSound = document.getElementById('gano-sound');
let palabraSecreta;
let descripcionSecreta;
let palabraAdivinada = [];
let intentos = 6;

const winImage = document.getElementById('win-image');
const loseImage = document.getElementById('lose-image');
const palabraElement = document.getElementById("palabra");
const letrasElement = document.getElementById("letras");
const resultadoElement = document.getElementById("resultado");
const reiniciarButton = document.getElementById("reiniciar");
const canvas = document.getElementById("ahorcado");
const ctx = canvas.getContext("2d");
const descripcionElement = document.getElementById("descripcionPalabra"); // Referencia al div de la descripción

canvas.width = 200;
canvas.height = 250;

function inicializarJuego() {
    if (palabrasConDescripcion.length === 0) {
        resultadoElement.textContent = "¡Ya has adivinado todas las palabras!";
        return;
    }
    
    const indicePalabra = Math.floor(Math.random() * palabrasConDescripcion.length);
    palabraSecreta = palabrasConDescripcion[indicePalabra].palabra;
    descripcionSecreta = palabrasConDescripcion[indicePalabra].descripcion;
    palabraAdivinada = Array(palabraSecreta.length).fill("_");
    intentos = 6;
    resultadoElement.textContent = "";
    descripcionElement.textContent = ""; // Limpiar la descripción al inicio del juego
    actualizarPalabra();
    inicializarLetras();
    dibujarAhorcado();
    actualizarIntentos(); 
    suspenseSound.play();
    perdioSound.pause();
    ganoSound.pause();
    loseImage.style.display = 'none'; 
    winImage.style.display = 'none'; 

    descripcionElement.textContent = `${descripcionSecreta}`; // Mostrar la descripción
}

function actualizarPalabra() {
    palabraElement.textContent = palabraAdivinada.join(" ");
}

function inicializarLetras() {
    letrasElement.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i);
        const button = document.createElement("button");
        button.textContent = letra;
        button.onclick = () => manejarLetra(letra);
        letrasElement.appendChild(button);
    }
}

function manejarLetra(letra) {
    suspenseSound.play();
    if (palabraSecreta.includes(letra)) {
        for (let i = 0; i < palabraSecreta.length; i++) {
            if (palabraSecreta[i] === letra) {
                palabraAdivinada[i] = letra;
            }
        }
    } else {
        intentos--;
        actualizarIntentos();
        dibujarAhorcado();
    }
    actualizarPalabra();
    verificarJuego();
}

function actualizarIntentos() {
    const intentosElement = document.getElementById("intentos");
    intentosElement.textContent = `Te quedan ${intentos} intentos`;
}

function verificarJuego() {
    if (palabraAdivinada.join("") === palabraSecreta) {
        resultadoElement.textContent = "¡Ganaste!";
        deshabilitarLetras();
        suspenseSound.pause();
        ganoSound.play();
        winImage.style.display = 'block'; 
        
        // Eliminar la palabra adivinada del array
        palabrasConDescripcion.splice(palabrasConDescripcion.findIndex(p => p.palabra === palabraSecreta), 1);
        
    } else if (intentos === 0) {
        resultadoElement.textContent = `Perdiste. La palabra era: ${palabraSecreta}`;
        deshabilitarLetras();
        suspenseSound.pause();
        perdioSound.play();
        loseImage.style.display = 'block'; 
    }
}

function deshabilitarLetras() {
    const buttons = document.querySelectorAll("#letras button");
    buttons.forEach(button => button.disabled = true);
}

function dibujarAhorcado() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;

    if (intentos <= 5) {
        ctx.beginPath();
        ctx.moveTo(10, 240);
        ctx.lineTo(190, 240);
        ctx.stroke();
    }
    
    if (intentos <= 4) {
        ctx.beginPath();
        ctx.moveTo(50, 240);
        ctx.lineTo(50, 20);
        ctx.lineTo(120, 20);
        ctx.lineTo(120, 40);
        ctx.stroke();
    }
    
    if (intentos <= 3) {
        ctx.beginPath();
        ctx.arc(120, 60, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    if (intentos <= 2) {
        ctx.beginPath();
        ctx.moveTo(120, 80);
        ctx.lineTo(120, 140);
        ctx.stroke();
    }
    
    if (intentos <= 1) {
        ctx.beginPath();
        ctx.moveTo(120, 100);
        ctx.lineTo(90, 120);
        ctx.moveTo(120, 100);
        ctx.lineTo(150, 120);
        ctx.stroke();
    }
    
    if (intentos === 0) {
        ctx.beginPath();
        ctx.moveTo(120, 140);
        ctx.lineTo(90, 180);
        ctx.moveTo(120, 140);
        ctx.lineTo(150, 180);
        ctx.stroke();
    }
}

reiniciarButton.onclick = inicializarJuego;

inicializarJuego();
