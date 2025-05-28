const tradeString = "0161002:HKD300:USD533020922:JPY4400:PHP9999"

// delimiters are
// payloadLength : 3 char
// timestamp: var
// : 1 char
// preTradeCurrency
// preTradeQuantity
// : 1 char
// postTradeCurrency
// postTradeQuantity

// @return Array{Trade}
const tradeReader = (tradeString, totalTrades = []) => {
    const payloadLength = parseInt(tradeString.slice(0, 3));
    const additionalColons = 2;

    // magic number 3 is payload length
    const modifiedLength = payloadLength + additionalColons + 3;
    const substring = tradeString.slice(0, modifiedLength)

    function isLetter(char) {
        if (typeof char !== 'string' || char.length !== 1) {
            return 'Invalid input';
        }

        if (char >= '0' && char <= '9') {
            return false;
        } else if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
            return true;
        } else {
            return 'Neither alphabetical nor numerical';
        }
    }

    const tradeObject =  {}
    // parse the trade string
    substring.split(":").forEach((segment, idx) => {
        if (idx === 0) {
            tradeObject.payloadLength = segment.slice(0,3);
            tradeObject.timestamp = segment.slice(3, -1)
        } else if (idx === 1) {
            tradeObject.preTradeCurrency = segment.split("").filter((char) => isLetter(char)).join("")
            tradeObject.preTradeQuantity = segment.split("").filter((char) => !isLetter(char)).join("")
        } else if (idx === 2) {
            tradeObject.postTradeCurrency = segment.split("").filter((char) => isLetter(char)).join("")
            tradeObject.postTradeQuantity = segment.split("").filter((char) => !isLetter(char)).join("")
        }
    })

    totalTrades.push(tradeObject)

    const remaining = tradeString.slice(modifiedLength)
    console.log(remaining)
    if (remaining.length > 0) {
        return tradeReader(remaining, totalTrades);
    } else {
        console.log(totalTrades)
        return totalTrades;
    }
}

return tradeReader(tradeString, [])
