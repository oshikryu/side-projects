/*
Poker Hands

Input: a string-encoded hand of cards
Output: All of the hand rankings

For example:
> hands(“AC AD 7H 5D 5H”)
> [“two pair”, “high card: AC”]

another example:
> hands(“AC 4D 7H 5D 6C”)
> [“high card: AC”]

A card is encoded as “[face][suit]” where suits are:
C - Clubs
D - Diamonds
S - Spades
H - Hearts

The string encoding for face is:
2 through 10
A - Ace
K - King
Q - Queen
J - Jack

For a list of poker hands and their rules see https://en.wikipedia.org/wiki/List_of_poker_hands

To keep the scope down only consider the following hands:
Straight flush
Four of a kind
Flush - all same suit
Straight - sequential
Three of a kind
Two pair
One pair
High card 7, 8, 9, 10, J, Q, K


What I’m looking for:
Correctness (of course)
Code organization
Maintainable, reusable design
Simplicity
*/
"use strict"

// notes for improvement
// does not take into account multiple of the same face e.g. 2H 2H 2H 2H 2H so add validation
// always checks all hands even if all cards are "used"
// add setters/getters instead of mutating attrs in methods directly
// check for uniqueness

function Poker() {
  this.POSSIBLE_SUITS = ['C', 'D', 'S', 'H'];
  this.POSSIBLE_FACES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  // ordered in increasing high card value
  this.POSSIBLE_HIGH_CARDS = ['7','8','9','10','J','Q','K','A'];
  this.suitCounter = { 'C': 0, 'D': 0, 'S': 0, 'H': 0 };
  this.faceCounter = { '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0, 'A': 0 };
  this.isFlush = false;
  this.isStraight = false;
  this.availableHands = [] // current hands

  /*
     Takes a hand of cards as string encoded inputs and determines possible hands
     @method hands
     @param cards String
     @return Array
  */
  this.hands = (cards) => {
    // transform string into array of suit/face string pairs
    let cardArray = parseCards(cards);
    if (findDuplicates(cardArray).length !== 0) {
      console.log('Non-unique cards, cheater cheater pumpking eater');
      return;
    }
    cardArray = countCards(cardArray);
    if (isHandInvalid(cardArray)) {
      console.log('Invalid poker hand');
      return;
    }
    checkPossibleHands(cardArray);
    console.log(this.availableHands);
  }

  /*
     Determine whether the poker hand is valid or not
     @method isHandInvalid
     @param cards Array
     @return Boolean
  */
  let isHandInvalid = (cardArray) => {
    return cardArray.length !== 5;
  }

  /*
     Takes a string input of cards and sanitize it for reading
     @method parseCards
     @param cards String
     @return Undefined
  */
  let parseCards = (cards) => {
    let cardStr = cards.toUpperCase();
    let cardArray = cardStr.split(' ');
    return cardArray;
  }

  /*
     Count faces and suits for card array and return valid cards
     @method countCards
     @param cards Array
     @return Array
  */
  let countCards = (cards) => {
    let validCardArray = [];
    for (let ii=0; ii < cards.length; ii++) {
      let face = decodeCard(this.POSSIBLE_FACES, cards[ii], 0);
      let suit = decodeCard(this.POSSIBLE_SUITS, cards[ii], 1);

      if (!face || !suit) {
        console.log(`invalid card ${cards[ii]}`);
        continue;
      }

      validCardArray.push(cards[ii]);

      this.faceCounter[face] += 1; 
      this.suitCounter[suit] += 1;
    }

    return validCardArray;
  }

  /*
     Takes a hand of cards as string encoded inputs and determines possible hands
     If invalid return nothing
     @method decodeCard
     @param list Array possible values to compare
     @param card Array string values
     @param idx Number desired index pos of card to get val

     @return val
  */
  let decodeCard = (list, card, idx) => {
    if (card.length < 2) {
      return;
    }

    let isValid = false;

    let val = card[idx];

    for (let ii=0; ii < list.length; ii++) {
      if (list[ii] == val) {
        isValid = true;
      }
    }

    if (isValid) {
      return val;
    }

    return;
  }

  /*
     Mutates the availableHands class property by checking types of hands
     the order of these checks sets precedent for what is the "highest" rated hand

     @method checkPossibleHands
     @param cardArray Array string values
     @return undefined
  */
  let checkPossibleHands = (cardArray) => {
    checkFlush(cardArray);
    checkStraight(cardArray);

    if (this.isFlush && this.isStraight) {
      addHands('Straight flush');
      return;
    } else if (this.isFlush) {
      addHands('Flush');
      return;
    } else if (this.isStraight) {
      addHands('Straight');
      return;
    }

    addHands(checkOfAKind(cardArray, 4));
    addHands(checkOfAKind(cardArray, 3));
    addHands(checkOfAKind(cardArray, 2));
    addHands(checkHighCard(cardArray));
  }

  /*
     Mutates the availableHands class property by concatenating handsToAdd (if applicable)

     @method addHands
     @param cardArray Array string values
     @return undefined
  */
  let addHands = (handsToAdd) => {
    if (handsToAdd) {
      this.availableHands = this.availableHands.concat(handsToAdd);
    }
  }

  let getMax = (arr) => {
    let max = 0;
    for (let ii=0; ii<arr.length; ii++ ) {
      if (max < arr[ii]) {
        max = arr[ii];
      }
    }

    return max;
  }

  let getMin = (arr) => {
    let min = arr[0]; // arbitrary min 
    for (let ii=0; ii<arr.length; ii++ ) {
      if (arr[ii] < min) {
        min = arr[ii];
      }
    }

    return min;
  }

  /*
     Determines how many of a kind are in an array of card strings
     @method findDuplicates
     @param arr Array string values
     @return Array
  */
  let findDuplicates = (arr) => {
    let len = arr.length,
        out = [],
        counts = {};

    for (let ii=0; ii<len; ii++) {
      let item = arr[ii];
      counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
    }

    for (let item in counts) {
      if(counts[item] > 1)
        out.push(item);
    }

    return out;
  }

  /*
     Determines how many of a kind are in an array of card strings
     @method checkOfAKind
     @param cardArray Array string values
     @param numOfAKind Number how many of a kind
     @return Array
  */
  let checkOfAKind = (cardArray, numOfAKind) => {
    if (cardArray.length === 0) {
      return;
    }
    let hand, suit, usedCards = [];
    let faces = Object.keys(this.faceCounter);
    let ofAKindCounter = 0;
    for (let ii=0; ii < faces.length; ii++) {
      let key = faces[ii];
      if (this.faceCounter[key] === numOfAKind) {
        ofAKindCounter += 1;
        suit = findMatching('suit', key, cardArray);
        usedCards.push(`${this.faceCounter[key]}${suit}`);
      }
    }

    if (numOfAKind === 2) {
      if (ofAKindCounter == 2) {
        hand ='two pair';
      } else if (ofAKindCounter == 1) {
        hand = 'one pair';
      }
    } else if (numOfAKind === 3 && ofAKindCounter) {
      hand = 'three of a kind';
    } else if (numOfAKind === 4 && ofAKindCounter) {
      hand = 'four of a kind';
    }

    clearUsed(usedCards);

    if (hand) {
      return [hand];
    }
  }

  /*
     Determines whether the hand is a straight by checking indexes
     Mutates isStraight flag if true
     @method checkStraight
     @param cardArray Array string values
     @return undefined
  */
  let checkStraight = (cardArray) => {
    let hand;
    let faces = Object.keys(this.faceCounter);
    let indexArray = [];
    for (let ii=0;ii<faces.length;ii++) {
      if (this.faceCounter[faces[ii]] > 0) {
        indexArray.push(ii);
      }
    }

    let max = getMax(indexArray);
    let min = getMin(indexArray);

    if (max - min === 4) {
      this.isStraight = true;
    }
  }

  /*
     Determines whether the hand is a flush
     Mutates isFlush flag if true
     @method checkFlush
     @param cardArray Array string values
     @return undefined
  */
  let checkFlush = (cardArray) => {
    let hand;
    let suits = Object.keys(this.suitCounter);
    for (let ii=0;ii<suits.length;ii++) {
      if (this.suitCounter[suits[ii]] === 5) {
        this.isFlush = true;
      }
    }
  }

  let checkHighCard = (cardArray) => {
    let face, suit;
    for (let ii=0;ii<this.POSSIBLE_HIGH_CARDS.length;ii++) {
      if (this.faceCounter[this.POSSIBLE_HIGH_CARDS[ii]] === 1) {
        face = this.POSSIBLE_HIGH_CARDS[ii];
        suit = findMatching('suit', face, cardArray);
      }
    }

    if (face && suit) {
      return `high card: ${face}${suit}`;
    }
  }

  /*
     matching val toFind [suit||face] for a given [suit||face]
     should match only one
  */
  let findMatching = (toFind, given, cardArray)  => {
    let match;
    if (toFind === 'face') {
      for (let ii=0; ii<cardArray.length; ii++) {
        if (cardArray[ii][1] === given) {
          match = cardArray[ii][0];
        }
      }
    } else if (toFind === 'suit') {
      for (let ii=0; ii<cardArray.length; ii++) {
        if (cardArray[ii][0] === given) {
          match = cardArray[ii][1];
        }
      }
    }

    return match;
  }

  let clearUsed = (usedCards) => {
    for(let ii=0; ii<usedCards.length;ii++) {
      let card = usedCards[ii];
      this.suitCounter[card[1]] -= 1;
      this.faceCounter[card[0]] -= 1;
    }
  }
}

let p = new Poker();
p.hands('4C 2C 3C 5C 6C');
