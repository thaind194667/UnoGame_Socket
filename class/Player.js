const Deck = require('./Deck.js').Deck;

class Player {
    #name; #state;#id;
    #roomid; #roomMaster;
    #deck;
    constructor(name, id) {
        this.#name = name;
        this.#state = "idle";
        this.#id = id;
        this.#deck = new Deck(`${name} - ${id}`);
        this.#roomid = "";
        this.#roomMaster = -1;
    }

    setState(state) {this.#state = state;}
    getState() {return this.#state;}
    
    setPName(name) {this.#name = name;}
    getPName() {return this.#name;}
    getPId() {return this.#id;}
    getPDeck() {return this.#deck;}
    // getCard

    getRoomId() {return this.#roomid;}
    isRoomMaster() {return this.#roomMaster;}
    createRoom(roomid) {
        this.#roomid = roomid;
        this.#roomMaster = 1;
    }
    joinRoom(roomid) {
        this.#roomid = roomid;
        this.#roomMaster = 0;
    }
    leaveRoom() {
        this.#roomid = "";
        this.#roomMaster = -1;
    }

    addCard(card) {this.#deck.makeCard(card);}

    play(cardIndex) {this.#deck.removeCard(cardIndex);}

    removeAllColor(color) { this.#deck.removeByColor(color); }

    emptyHand() {this.#deck.emptyDeck();}

}

module.exports.Player = Player;