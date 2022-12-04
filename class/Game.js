// const { count } = require('console');
const Card = require('./Card.js').Card;
const Deck = require('./Deck.js').Deck;
const fs = require('fs');
const Player = require('./Player.js').Player;
// const { start } = require('repl');
// const { type } = require('os');
// import { Deck } from 'deck.js';

const COLOR = Array("red", "blue", "yellow", "green");

let UNO, BOOM, TLMN;

class Game {
  #id; #maxPlayers; #playerNum;
  #players;
  #cardPile;
  // #playerDeck; 
  #drawPile; #playedPile;
  #turn; #rotate;#number; #color; #stack; #currentUrl; #gameState; #winner;
  #minIndex;
  constructor(id, maxPlayer) {
    this.#id = id;
    this.#playerNum = 0;
    this.#maxPlayers = maxPlayer;
    // this.#playerDeck = new Array();
    this.#players = new Array(10);
    this.#minIndex = 8;
    
    this.loadUno();
    this.#cardPile = new Deck("cardPile");
    this.#cardPile.copyDeck(UNO);

    this.#drawPile = new Deck("drawPile");
    this.loadDrawPile();

    this.#playedPile = new Deck("playedPile");
  }

  getId() { return this.#id; }
  setId(id) { this.#id = id; }
  getCurrentColor() { return this.#color; }
  setCurrentColor(color) { this.#color = color; }
  getNumber() { return this.#number; }
  setNumber(number) { this.#number = number; }
  getGameState() { return this.#gameState; }
  setGameState(state) { this.#gameState = state; }
  getTurn() { return this.#turn; }
  setTurn(turn) { this.#turn = turn; }
  getWinner() { return this.#winner; }
  setWinner(winner) { this.#winner = winner; }
  getCurrentUrl() { return this.#currentUrl; }
  getPlayerNum() { return this.#playerNum; }
  getMaxPlayer() {return this.#maxPlayers;}
  getPlayerDeck(index) { 
    if(this.#players[index] == null) return null;
    else return this.#players[index].getPDeck(); 
  }
  getPlayers() {return this.#players;}
  getStack() {return this.#stack;}

  getPlayerList() {
    let list = [];
    for(let i = 1; i <= this.#maxPlayers; i++) {
      if(this.#players[i] != null) {
        list[i] = this.#players[i].getPName();
        // list.push({pos: i, name: this.#players[i].getPName()});
      }
    }
    return list;
  }

  pushIn(name, id) {
    let check = 0;
    for (let i = 1; i <= this.#maxPlayers; i++) {
      if (this.#players[i] == null) {
        this.#playerNum++;
        let player = new Player(name, id);
        if(this.#playerNum == 1) player.createRoom(this.#id);
        else player.joinRoom(this.#id);
        this.#players[i] = player;
        check = i;
        // this.drawCard(i, 7);
        if(i < this.#minIndex) this.#minIndex = i;
        break;
      }
    }
    return check;
  }

  remove(username) {
    // let username = Player.getPName();
    let i = this.findUserByName(username);
    if(i != 0) {
      delete this.#players[i];
      this.#playerNum--;
      if(this.#playerNum == 1) 
        this.#winner = 0;
    }
    return i;
  }

  findUserByName(name) {
    for (let i = 1; i <= this.#maxPlayers; i++) 
      if (this.#players[i] != null && this.#players[i].getPName() == name) 
        return i;
    return 0;
  }

  startNewGame() {
    if(this.#winner == 0)   this.#turn = this.#minIndex;
    else {
      if(this.#players[this.#winner] == null) this.#turn = this.#minIndex;
      else this.#turn = this.#winner;
      this.#winner = 0;
    }
    // this.#turn = Math.floor(Math.random() * this.#playerNum + 1);
    this.#rotate = 1;
    this.#number = Math.floor(Math.random() * 10);
    this.#color = COLOR[Math.floor(Math.random() * 4)];
  
    this.#stack = 1;
    this.#currentUrl = this.#number + this.#color;
    this.#gameState = "play";
    this.dealCard(7);
  }

  printIn4() {
    let in4 = "";
    in4 += `turn: ${this.#turn} \n`;
    in4 += `card: ${this.#color} ${this.#color} has ${this.#currentUrl} \n`;
    in4 += `stack: ${this.#stack} and state: ${this.#gameState}`;
    return in4;
  }

  nextTurn() {
    while(1) {
      this.#turn += this.#rotate;
      if(this.#turn > 8) this.#turn = 1;
      if(this.#turn < 1) this.#turn = 8;
      if(this.#players[this.#turn] != null) break;
    }
  }

  compareToCurrentCard(card) {

    let color = card.getColor();
    let val = card.getValue();
    let name = card.getCardName();
    console.log(color + val);

    if(this.#stack > 1) {   // in a plus 2, plus 4 's stack
      if(name == "draw 2") {
        this.#stack += 2;
        this.nextTurn();
        return 1;
      }
      if(name == "draw 4") {
        this.#stack += 4;
        this.nextTurn();
        return 2;
      }
      return 0;
    }

    /// not in plus stack
    if(card.getColor() == "") {     // effect card => play whenever
      if(name == "draw 4") {
        this.#stack = 4;
        this.nextTurn();
        return 2;
      }
      if(name == "change Color") {
        this.nextTurn();
        return 2;
      }
    }

    if(color== this.#color || val == this.#number) {    // valid card
      if(val >= 0) {      // regular number card
        this.nextTurn();
        return 1;
      }
      if(val == -1) {     // skip card
        this.nextTurn();
        this.nextTurn();
        /// skip a turn
        return 1;
      }
      if(val == -2) {     // draw 2
        this.#stack = 2;
        this.nextTurn();
        return 1;
      }
      if(val == -3) {
        this.#rotate = -this.#rotate;
        this.nextTurn();
        return 1;
      }

    }
    return 0;

  }

  addPlayCard(card) {
    this.#playedPile.makeCard(card);
    this.#currentUrl = card.getUrl();
    this.#color = card.getColor();
    this.#number = card.getValue();
  }
  playCard(playerIndex, cardId) {
    const deck = this.#players[playerIndex].getPDeck();
    const card = deck.getCardById(cardId);
    // console.log(card.printInfo() + " " + this.#number+ this.#color);
    let res = this.compareToCurrentCard(card);
    if(res == 0) return 0;
    // deck.removeCard(cardId);
    this.addPlayCard(card);
    this.#players[playerIndex].play(cardId);
    return res;
  }

  // playPair(player, pair) {
  //   if (pair.length > 2) return false;
  //   const card1 = this.#playerDeck[player].getCardById(pair[0]);
  //   const card2 = this.#playerDeck[player].getCardById(pair[1]);
  //   if (this.CardCompare(card1, card2) != 0) return false;
  //   this.#playerDeck[player].removeCard(card1);
  //   this.#playerDeck[player].removeCard(card2);
  //   return true;
  // }

  // playTriple(player, triple) {
  //   if (triple > 3) return false;
  //   const card1 = this.#playerDeck[player].getCardById(triple[0]);
  //   const card2 = this.#playerDeck[player].getCardById(triple[1]);
  //   const card3 = this.#playerDeck[player].getCardById(triple[2]);
  //   if (this.CardCompare(card1, card2) != 0 || this.CardCompare(card1, card3) != 0) return false;
  //   this.#playerDeck[player].removeCard(card1);
  //   this.#playerDeck[player].removeCard(card2);
  //   this.#playerDeck[player].removeCard(card3);
  //   return true;
  // }

  // drawOne(playerIndex) {
  //   // let player = this.#players[playerIndex];
  //   const card = this.#drawPile.getCardById(0);
  //   this.#players[playerIndex].addCard(card);
  //   this.#drawPile.removeCard(0);
  //   return card;
  // }

  drawCard(playerIndex, cardNum) {
    // let player = this.#players[playerIndex];
    let DeckUrl = [];
    let i = cardNum;
    while (i > 0) {
      // console.log(i + " left");
      // this.#drawPile.printCardDeck();
      if(this.#drawPile.getCardNum() == 0) this.loadDrawPile();
      let drawpile = this.#drawPile;
      const card = drawpile.getCardById(1);
      console.log(card);
      console.log(card.printInfo());
      this.#players[playerIndex].addCard(card);
      DeckUrl.push(card.getUrl());
      this.#drawPile.removeCard(1);
      i--;
    }
    return DeckUrl;
  }
  CardCompare(card1, card2) {
    val1 = card1.getValue();
    if(val1 < 0) val1 = 0;
    val2 = card2.getValue();
    if(val2 < 0) val2 = 0;
    if (val1 > val2) return 1;
    else if (val1 == val2) return 0;
    else return -1;
  }
  dealCard(number) {
    for (let i = 1; i <= this.#playerNum; i++) {
      if(this.#players[i] != null) {
        this.#players[i].emptyHand();
        this.drawCard(i, number);
      }
    }
  }
  resetDrawPile() {
    this.#drawPile.copyDeck(UNO);
  }
  addStack(add) { this.#stack += add; }
  drawStack(playerIndex) {
    let deck = this.drawCard(playerIndex, this.#stack);
    this.#stack = 1;
    return deck;
    // while (this.#stack > 0) {
    //   this.#playerDeck[player].makeCard(this.#drawPile.getCard()[0]);
    //   this.#drawPile.removeCardCard(0);
    //   this.#stack--;
    // }
  }
  loadDrawPile() {this.#drawPile.copyDeck(UNO); this.sufferDrawPile();}
  sufferDrawPile() { this.#drawPile.shuffle(); }
  loadUno() {
    UNO = new Deck("UNO");
    let text;

    try {
      const data = fs.readFileSync(`./data/uno.txt`, 'utf-8');
      // console.log(typeof data);
      // console.log(data);
      text = data.toString();
    } catch (err) {
      console.error(err);
    }
    // return false;

    const line = text.split("\n");
    for (let i = 0; i < line.length; i++) {
      // console.log("... " + line[i]);
      // const string = array[i];
      if (line[i][0] == '*') break;
      // console.log(line[i]);
      let array = line[i].split(":");
      let name = array[0];
      let num = array[1];
      // console.log(num);
      let target = array[2];
      if(target == '') target = 'next';
      let effect = array[3];
      let color = array[4];
      let value = array[5];
      // console.log(`${name} ${num} ${target} ${effect} ${color} ${value}`);
      for (let j = 1; j <= num; j++) {
        if (color == 'All') {
          UNO.makeCard(new Card(name, target, effect, 'red', value));
          UNO.makeCard(new Card(name, target, effect, 'blue', value));
          UNO.makeCard(new Card(name, target, effect, 'green', value));
          UNO.makeCard(new Card(name, target, effect, 'yellow', value));
        }
        else if (color == '')
          UNO.makeCard(new Card(name, target, effect, '', value));
        else
          UNO.makeCard(new Card(name, target, effect, color, value));
      }
    }

    for (let i = 0; i <= 9; i++) {
      if (i == 0) {
        UNO.makeCard(new Card('0', 'next', '', 'red', 0));
        UNO.makeCard(new Card('0', 'next', '', 'blue', 0));
        UNO.makeCard(new Card('0', 'next', '', 'green', 0));
        UNO.makeCard(new Card('0', 'next', '', 'yellow', 0));
      }
      else {
        for (let j = 0; j < 2; j++) {
          UNO.makeCard(new Card(i.toString(), 'next', '', 'red', i));
          UNO.makeCard(new Card(i.toString(), 'next', '', 'blue', i));
          UNO.makeCard(new Card(i.toString(), 'next', '', 'green', i));
          UNO.makeCard(new Card(i.toString(), 'next', '', 'yellow', i));
        }
      }
    }

    // return UNO;
  }

};


module.exports.Game = Game;