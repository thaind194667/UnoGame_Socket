var express = require('express');
const bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const Game = require('./class/Game.js').Game;


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/public/uno.html');
});

let username = [];
// let userList = [];
let roomList = [];
let rooms = [];

function leaveRoom(socket) {
  let R = roomList.find(R => R.getId() == rooms[socket.id]);
  // let roomId = rooms[socket.id];
  let pId = R.remove(username[socket.id]);

  const message = `${username[socket.id]} leave ${rooms[socket.id]}`;
  console.log(message);

  io.in(rooms[socket.id]).emit('change', { pos: pId, msg: "leave" });
  socket.leave(rooms[socket.id]);

  if (R.getPlayerNum() == 0) {
    roomList.splice(roomList.findIndex(R => R.getId() == rooms[socket.id]));
    console.log(`Remove room ${R.getId()}`);
  }
  else
    console.log(R.getPlayerList());

  rooms[socket.id] = '';

  console.log(socket.adapter.rooms);
}

// function findSocketId(name) {
//   for(let key in username) {
//     if(username[key] == name) return key;
//   }
// }


io.on('connection', function(socket) {

  console.log("New " + socket.id);
  console.log(socket.adapter.rooms);

  socket.on('joinServer', function(data) {
    
    username[socket.id] = data;
    console.log(`${username[socket.id]} has joined server!`);

  });

  socket.on('create room', (roomId) => {

    let R = roomList.find(R => R.getId() == roomId);
    if (R != null) {
      io.to(socket.id).emit('createFail');
      console.log("room " + roomId + " existed");
    }
    else {
      
      rooms[socket.id] = roomId;
      socket.join(roomId);

      R = new Game(roomId, 8);
      
      let pId = R.pushIn(username[socket.id], socket.id);
      roomList.push(R);
      
      let deck = R.getPlayerDeck(pId);
      if(deck == null) console.log("No deck for " + pId);
      else console.log(deck.getAllCardUrl());

      const message = `${username[socket.id]} create ${rooms[socket.id]}`;

      io.to(socket.id).emit('createDone', {pos: pId, players: R.getPlayerList()});
      // io.in(rooms[socket.id]).emit('change', { pos: pId, msg: "join" });
      // console.log(R.players);
      console.log(message);
      console.log(R.getPlayerList());
      console.log(socket.adapter.rooms);
    }

  });

  socket.on('join room', (roomId) => {

    let R = roomList.find(R => R.getId() == roomId);
    if (R == null) {
      io.to(socket.id).emit('joinFail');
      console.log("room " + roomId + " not existed");
    }
    else {
      let message;
      let pId = R.pushIn(username[socket.id], socket.id);
      if (pId == 0) {
        message = `${roomId} is full, ${username[socket.id]} cannot join!`;
        io.to(socket.id).emit('roomFull');
      }
      else {
        // let game = R.game;
        // pDeck = game.getPlayerDeck(pId);
        // console.log("\n now\n"+ "\n");
        // pDeck.printCardDeck();

        rooms[socket.id] = roomId;
        socket.join(roomId);

        message = `${username[socket.id]} join ${rooms[socket.id]}`;
        let deck = R.getPlayerDeck(pId);
        if(deck == null) console.log("No deck for " + pId);
        else console.log(deck.getAllCardUrl());

        io.to(socket.id).emit('joinDone', {pos: pId, players: R.getPlayerList()});
        io.in(rooms[socket.id]).emit('change', { pos: pId, msg: "join", name: username[socket.id] });
        // console.log(R.players);
      }
      console.log(message);
      console.log(socket.adapter.rooms);
    }

  });

  socket.on('leave room', () => {
    leaveRoom(socket);
  });

  socket.on('user-chat', (msg) => {

    let message = `${username[socket.id]} : ${msg}`;
    console.log(`${username[socket.id]} in ${rooms[socket.id]} says ${msg}`);
    io.in(rooms[socket.id]).emit('server-chat', message);

  });

  socket.on('Ready', () => {
    let R = roomList.find(R => R.getId() == rooms[socket.id]);
    if(R == null) {
      console.log("Can't find room!");
      return;
    }
    console.log(R);
    let pos = R.findUserByName(username[socket.id]);
    io.in(rooms[socket.id]).emit('ready', pos);
    console.log(`${username[socket.id]} ready, let play!`);
  });

  socket.on('Not ready', () => {
    let R = roomList.find(R => R.getId() == rooms[socket.id]);
    if(R == null) {
      console.log("Can't find room!");
      return;
    }
    console.log(R);
    let pos = R.findUserByName(username[socket.id]);
    io.in(rooms[socket.id]).emit('not ready', pos);
    console.log(`${username[socket.id]} not ready yet, wait a bit!`);
  });

  socket.on('startGame', () =>{
    let R = roomList.find(R => R.getId() == rooms[socket.id]);
    if(R == null) {
      console.log("Can't find room!");
      return;
    }
    R.startNewGame();
    let list = R.getPlayers();
    for(let i = 1; i <= R.getMaxPlayer(); i++) {
      if(list[i] != null) {
        // let id = findSocketId(R.players[i]);
        // console.log(id);
        let deck = list[i].getPDeck();
        let DeckUrl = deck.getAllCardUrl();
        console.log(DeckUrl);
        io.to(list[i].getPId()).emit('begin', DeckUrl);
      }
    }
    io.in(rooms[socket.id]).emit("state", {turn: R.getTurn(), currentCard: R.getCurrentUrl(), color: R.getCurrentColor()});
  });

  socket.on('Hit', (data) =>{
    let Game = roomList.find(Game => Game.getId() == rooms[socket.id]);
    if(Game == null) {
      console.log("Can't find room!");
      return;
    }
    // console.log(Game);
    // let Game = R.game;
    console.log(`${username[socket.id]} play ${data.cardid}th card`);
    let deck = Game.getPlayerDeck(data.pos);
    deck.printCardDeck();
    let card = deck.getCardById(data.cardid);
    console.log(card.printInfo());
    let res = Game.playCard(data.pos, data.cardid);
    if(res == 0) io.to(socket.id).emit('hitFail');
    else {
      let deck = Game.getPlayerDeck(data.pos);
      if(deck.getCardNum() == 0) {
        io.in(rooms[socket.id]).emit("Win", {pos: data.pos});
        return;
      }
      if(res == 1) {
        io.in(rooms[socket.id]).emit("hitDone", {...data, msg: "next"});
        io.in(rooms[socket.id]).emit("state", {turn: Game.getTurn(), currentCard: Game.getCurrentUrl(), color: Game.getCurrentColor()});
      }
      else {
        io.to(socket.id).emit("hitDone", {...data, msg: "colorChoose"});
      }
    }
  });

  socket.on('Draw', (pos) => {
    let R = roomList.find(R => R.getId() == rooms[socket.id]);
    if(R == null) {
      console.log("Can't find room!");
      return;
    }
    console.log(R);
    // let Game = R.game;
    let stack = R.getStack();
    let Deck = R.drawStack(pos);
    console.log(Deck);
    io.to(socket.id).emit('Draw', {pos: pos, Cards: Deck, stack: stack});
    socket.to(rooms[socket.id]).emit('Draw', {pos: pos, stack: stack});
  });

  socket.on('Pass', function(pos) {
    let R = roomList.find(R => R.getId() == rooms[socket.id]);
    R.nextTurn();
    io.in(rooms[socket.id]).emit("state", {
      turn: R.getTurn(), 
      currentCard: R.getCurrentUrl(), 
      color: R.getCurrentColor()
      }
    );

  });

  socket.on('colorChange', function(color) {
    let Game = roomList.find(Game => Game.getId() == rooms[socket.id]);
    Game.setCurrentColor(color);
    io.in(rooms[socket.id]).emit("state", {turn: Game.getTurn(), currentCard: Game.getCurrentUrl(), color: Game.getCurrentColor()});

  });

  socket.on('disconnect', function() {

    let index = username[socket.id];
    console.log(index);
    if (index == null) {
      console.log(`${socket.id} left server`);
      return;
    }

    let R = roomList.find(R => R.getId() == rooms[socket.id]);
    if (R != null) 
      leaveRoom(socket);

    console.log(`${username[socket.id]} disconnected `);
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
  console.log('Running on http://localhost:3000/game');
});