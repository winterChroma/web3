const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173"
  }
});

let numberOfPlayersSubmitted = 0
let round = 0
let kamote = 0
let df = 0
let corn = 0
let kamotePrice = 1
let dfPrice = 1
let cornPrice = 1
let totalPrice = 0
let cropsGrown = {}

function reset() {
  totalPrice = 0
  kamote = 0
  df = 0
  corn = 0
  numberOfPlayersSubmitted = 0
}

io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id)
  cropsGrown[socket.id] = {}
  io.emit('numberOfPlayers', Object.keys(cropsGrown).length)

  socket.on("disconnect", () => {
    delete cropsGrown[socket.id]
    io.emit('numberOfPlayers', Object.keys(cropsGrown).length)
  });

  socket.on('endRound', () => {
    io.emit('endRoundClient')
    round++
  });
  socket.on('reset', () => {
    round = 0
    kamotePrice = 1
    dfPrice = 1
    cornPrice = 1
    io.emit('updatePrice', JSON.stringify({
      started: true,
      kamotePrice,
      dfPrice,
      cornPrice
    }))
    reset()
  })

  socket.on('receiveCrops', (msg) => {
    console.log("crops received from " + socket.id)
    numberOfPlayersSubmitted++
    let crops = JSON.parse(msg)
    cropsGrown[socket.id] = crops
    kamote += crops.kamote
    df += crops.df
    corn += crops.corn
    totalPrice += crops.kamote * kamotePrice
    totalPrice += crops.df * dfPrice
    totalPrice += crops.corn * cornPrice
    if (numberOfPlayersSubmitted == Object.keys(cropsGrown).length) {
      let kamoteFactor = (corn + df) || 1
      let cornFactor = (kamote + df) || 1
      let dfFactor = (kamote + corn) || 1
      let divisor = kamoteFactor + cornFactor + dfFactor
      let magicNumber = totalPrice * divisor / (kamoteFactor * kamote + cornFactor * corn + dfFactor * df)
      kamotePrice = kamoteFactor * magicNumber / divisor
      dfPrice = dfFactor * magicNumber / divisor
      cornPrice = cornFactor * magicNumber / divisor
      io.emit('updatePrice', JSON.stringify({
        started: true,
        kamotePrice: kamotePrice.toFixed(4),
        dfPrice: dfPrice.toFixed(4),
        cornPrice: cornPrice.toFixed(4)
      }))
      io.emit('calculateWinnings')
      reset()
    }
  })

  socket.on('startRound', () => {
    io.emit('startRoundClient')
    round++
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});