class Card {
  #name;
  #target;
  #effect;
  #color;
  #value;
  #url;
  constructor(name, target, effect, color, value) {
    if (typeof (name) === 'string') {
      this.#name = name;
      this.#target = target;
      this.#effect = effect;
      this.#color = color;
      this.#value = value;
      let url = this.#name + this.#color;
      url = url.toString();
      this.#url = url.replace(' ', '');
      // this.printIn4();
    }
    else
      this.copyCard(name);

  }

  copyCard(card) {
    // let card = new Card('');
    // let card = c;
    this.#name = card.getName();
    this.#target = card.getTarget();
    this.#effect = card.getEffect();
    this.#color = card.getColor();
    this.#value = card.getValue();
    this.#url = card.getUrl();
  }

  getCardName() { return this.#name; }
  getTarget() { return this.#target; }
  getEffect() { return this.#effect; }
  getColor() { return this.#color; }
  getValue() { return this.#value; }
  getUrl() { return this.#url; }

  printInfo() {
    return this.#name + " " + this.#url;
    // console.log(this.#name + " " + this.#url);
  }

}
module.exports.Card = Card;