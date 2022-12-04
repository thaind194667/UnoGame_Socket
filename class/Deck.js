// import {Card} from 'card.js';
const Card = require('./Card.js').Card;
class Deck {
  #card;
  #name;
  #cardNum;
  constructor(name) {
    this.#card = new Array();
    this.#name = name;
    this.#cardNum = 0;
    this.#card[0] = "nothing";
    // this.#card.push("nothing");
  }
  makeCard(card) {
    this.#cardNum++;
    this.#card[this.#cardNum] = card;
  }

  copyDeck(deck) {
    let Card = deck.getCard();
    for (let i = 1; i <= deck.getCardNum(); i++)
      this.makeCard(Card[i]);
  }
  // makeCard(name, target, effect, color, value) {
  //     this.#card.push(new Card(name, target, effect, color, value));
  // }
  setDeckName(name) { this.#name = name; }
  getDeckName() { return this.#name; }
  getCard() { return this.#card; };
  getCardNum() { return this.#cardNum; }
  getCardById(index) { return this.#card[index]; }

  reIndexDeck() {
    let count = 0;
    let card = this.#card;
    for(let i = 0; i < card.length; i++) {
      if(this.#card[i] != null) {
        // card.push(this.#card[i]);
        card[count] = card[i];
        count++;
      }
    }
    this.#cardNum = count;
  }

  removeCard(index) {
    let card = this.#card[index];
    this.#card.splice(index, 1);
    this.#cardNum--;
    // this.reIndexDeck();
    return card;
  }
  removeByColor(color) {
    let cards = [];
    let i = 1;
    while (i <= this.#cardNum) {
      let card = this.#card[i];
      if (card.getColor() == color) {
        cards.push(this.#card[i]);
        this.removeCard(i);
      }
      else i++;
    }
    return cards;
  }

  emptyDeck() {
    while(this.#cardNum > 0) this.removeCard(1);
  }

  shuffle() {
    let array = this.#card;
    for (let i = this.#cardNum; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    this.#card = array;
  }

  sortByVal() {

  }
  
  sortByColor() {

  }

  printCardDeck() {
    for(let i = 1; i <= this.#cardNum; i++) {
      const card = this.#card[i];
      console.log(`${i}: ${card.printInfo()}`);
      // card.printInfo();
    }
  }

  getAllCardUrl() {
    let DeckUrl = [];
    for(let i = 1; i <= this.#cardNum; i++) {
      const card = this.#card[i];
      DeckUrl.push(card.getUrl());
    }
    return DeckUrl;
  }

}

module.exports.Deck = Deck;