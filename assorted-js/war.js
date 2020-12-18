/* 

Design a simple cardgame for 2 players. Here's the rules:

- A deck of cards is shuffled and dealt evently between the two players.
- Each round, both players reveal the top card of their deck and compare the values. The higher card value wins.
- The winner then takes both those revealed cards and places them under their deck.
- Win condition is that there are no cards left in a player's deck. That player is the loser

In case of a draw remove 3 cards from each player's deck and place them into a sepearate pile - Draw a new card as usual and compare. The winner gets all the cards in the separate pile as well as the normal victory cards

*/

const MAXHANDS = 100
const runGame = (handA=[], handB=[]) => {
  let idx = 0
  let theWinner = null
  while ((handA.length > 0 && handB.length > 0) && theWinner == null) {
    theWinner = compareHands(handA, handB)
    idx += 1
    if (idx > MAXHANDS) {
      console.log('War never ends....');
      break;
    }
  }
  console.log(`\nThe winner is ${theWinner}`);
  console.log(`Hand A ${handA}`);
  console.log(`Hand B ${handB}`);
}

const compareHands = (handA, handB, drawPile=[]) => {
  const topCardA = handA.shift()
  const topCardB = handB.shift()

  if (topCardA > topCardB) {
    handA.push(topCardA, ...drawPile, topCardB, )
    if (handB.length === 0) {
      return 'Player 1'
    }
  } else if (topCardB > topCardA) {
    handB.push(topCardB, ...drawPile, topCardA, )
    if (handA.length === 0) {
      return 'Player 2'
    }
  } else {
    if (handB.length === 0) {
      return 'Player 1'
    }
    if (handA.length === 0) {
      return 'Player 2'
    }
    return warHelper(handA, handB, [topCardA, topCardB])
  }
}


/**
 * Take top 3 cards of handA and handB, put it into a common pile
 * Draw the next card of each hand and run compareHands
 * @method warHelper
*/
const warHelper = (handA, handB, warCards) => {
  console.log('War!');
  const drawPile = [...warCards]
  const aDraw = handA.splice(0, 3)
  const bDraw = handB.splice(0, 3)

  // case even draw
  if (aDraw.length === 0 && bDraw.length === 0) {
    console.log(`War... war never changes`);
  }

  drawPile.push(...aDraw, ...bDraw)

  // case cannot put 3 cards down
  if (aDraw.length > bDraw.length) {
    handA.push(...drawPile)
  } else if (bDraw.length > aDraw.length) {
    handB.push(...drawPile)
  }

  // 3 cards put into pile, check remaining cards in hand
  if (handA.length > 0 && handB.length === 0) {
    handA.push(...drawPile)
    return 'Player 1'
  }

  if (handB.length > 0 && handA.length === 0) {
    handB.push(...drawPile)
    return 'Player 2'
  }

  return compareHands(handA, handB, drawPile)
}

// all player 2
const games = [
  [
    // always player 2
    [1,2,3,4,5],
    [6,7,8,9,10]
  ],
  [
    // always player 1
    [6,7,8,9,10],
    [1,2,3,4,5],
  ],
  [
    [1,7,3,4,5],
    [6,2,8,9,10]
  ],
  [
    // war
    [1,2,3,4,5, 7, 8],
    [6,2,8,9,10, 11, 12]
  ],
  [
    // uneven distro of cards
    [1,2,3,4,5, 7, 8, 8],
    [6,2,8,9,10, 11, 12]
  ]
]

// run the simulation
for (game of games) {
  console.log(`Game: ${game}`);
  runGame(game[0], game[1])
}
