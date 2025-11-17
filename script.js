let socket;
let playerSymbol = "";
let currentTurn = "";
let roomCode = "";

const board = document.getElementById("board");
const statusText = document.getElementById("status");
const popup = document.getElementById("resultPopup");
const resultText = document.getElementById("resultText");

// Membuat cell papan
for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.onclick = () => makeMove(i);
    board.appendChild(cell);
}

function connectServer() {
    socket = new WebSocket("ws://TicTacTe.online.byAryaDev"); 
}

function createRoom() {
    connectServer();
    socket.onopen = () => {
        const code = Math.floor(100 + Math.random() * 900).toString();
        roomCode = code;
        socket.send(JSON.stringify({ type: "create", room: code }));
        statusText.innerText = "Menunggu pemain lain... (Kode: " + code + ")";
    };

    socket.onmessage = handleMessage;
}

function joinRoom() {
    const code = document.getElementById("joinCode").value.trim();
    if (code.length !== 3) return alert("Kode harus 3 digit!");

    roomCode = code;
    connectServer();

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: "join", room: code }));
    };

    socket.onmessage = handleMessage;
}

function handleMessage(event) {
    let data = JSON.parse(event.data);

    if (data.type === "start") {
        playerSymbol = data.symbol;
        currentTurn = "X";
        statusText.innerText = "Game Dimulai! Kamu: " + playerSymbol;
        board.style.display = "grid";
        document.getElementById("roomSection").style.display = "none";
    }

    if (data.type === "updateBoard") {
        updateBoard(data.board);
        currentTurn = data.turn;
    }

    if (data.type === "end") {
        updateBoard(data.board);
        showResult(data.result);
    }
}

function updateBoard(arr) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((c, i) => {
        c.innerText = arr[i];
    });
}

function makeMove(index) {
    if (currentTurn !== playerSymbol) return;

    socket.send(JSON.stringify({
        type: "move",
        room: roomCode,
        index: index,
        symbol: playerSymbol
    }));
}

function showResult(result) {
    popup.style.display = "flex";
    resultText.innerText = result === playerSymbol ? "YOU WIN" : "YOU LOSE";
}

function playAgain() {
    location.reload();
}