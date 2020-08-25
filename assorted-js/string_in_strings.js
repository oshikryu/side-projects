/*

You are running a classroom and suspect that some of your students are passing around the answers to multiple choice questions disguised as random strings.

Your task is to write a function that, given a list of words and a string, finds which word in the list is scrambled up inside the string, if any exists. There will be at most one matching word. The letters don't need to be contiguous.

Example:
words = ['cat', 'dog', 'bird', 'car', 'ax', 'baby']
string1 = 'tcabnihjs'
find_embedded_word(words, string1) -> cat

string2 = 'tbcanihjs'
find_embedded_word(words, string2) -> cat

string3 = 'baykkjl'
find_embedded_word(words, string3) -> None

string4 = 'bbabylkkj'
find_embedded_word(words, string4) -> baby

n = number of words in `words`
m = maximal string length of each word

*/

const words = ["cat", "dog", "bird", "car", "ax", "baby"];
const string1 = "tcabnihjs";
const string2 = "tbcanihjs";
const string3 = "baykkjl";
const string4 = "bbabylkkj";

/**
  @param {Array} words
  @param {String} scrambledString
  @method find_embedded_word
  @return {String}
*/
const find_embedded_word = (words=[], scrambledString='') => {
  // todo check for words type
  
  if (typeof scrambledString !== 'string')  {
    return null;
  }
  
  let foundWord = null;
  const immutable = scrambledString.split('');
  words.forEach((word) => {
    let scrambledStringArray = immutable.slice();
    if (foundWord != null) {
      return;
    }
    word = word.split('');
    const wordHasAllChars = word.map((char) => {
      
      const charIndex = scrambledStringArray.findIndex((char) => {
//      const mapper = new RegExp(/`${char}`/);
        return word.includes(char);
      });
      
      if (charIndex > -1) {
        scrambledStringArray.splice(charIndex, 1);
        console.log(scrambledStringArray)
        return true;
      } else {
        return false;
      }
    });
    
    let useThisWord = true;
    // lodash every??
    wordHasAllChars.forEach((boolVal) => {
      if (!boolVal) {
        useThisWord = false;
        scrambledStringArray = immutable
      }
    });
    
    if (useThisWord) {
      foundWord = word;
    }
  });
  
  if (foundWord) {
    return foundWord.join('');
  } else {
    return null
  }
  
};

const res = find_embedded_word(words, string1);
console.log(`Result 1 is: ${res}`);


const res2 = find_embedded_word(words, string2)
console.log(res2);


const res3 = find_embedded_word(words, string3)
console.log(res3)

const res4 = find_embedded_word(words, string4)
console.log(res4)