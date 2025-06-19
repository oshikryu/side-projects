tradeString = "0161002:HKD300:USD533020922:JPY4400:PHP9999"

# delimiters are
# payloadLength : 3 char
# timestamp: var
# : 1 char
# preTradeCurrency
# preTradeQuantity
# : 1 char
# postTradeCurrency
# postTradeQuantity

def tradeReader(tradeString, totalTrades):
    payloadLength = int(tradeString[0:3])
    additionalColons = 2

    modifiedLength = payloadLength + additionalColons + 3
    substring = tradeString[0:modifiedLength]

    def is_letter(char):
        if not isinstance(char, str) or len(char) != 1:
            return 'Invalid input'

        if char.isdigit():
            return False
        elif char.isalpha():
            return True
        else:
            return 'Neither alphabetical nor numerical'

    trade_object = dict()
    for idx, segment in enumerate(substring.split(":")):
        if idx == 0:
            trade_object['payloadLength'] = segment[0:3]
            trade_object['timestamp'] = segment[3:-1]
        elif idx == 1:
            trade_object['preTradeCurrency'] = ''.join([char for char in segment if is_letter(char)])
            trade_object['preTradeQuantity'] = ''.join([char for char in segment if not is_letter(char)])
        elif idx == 2:
            trade_object['postTradeCurrency'] = ''.join([char for char in segment if is_letter(char)])
            trade_object['postTradeQuantity'] = ''.join([char for char in segment if not is_letter(char)])

    totalTrades.append(trade_object)

    remaining = tradeString[modifiedLength:-1]
    print(remaining)
    if len(remaining) > 0:
        return tradeReader(remaining, totalTrades)
    else:
        print(totalTrades)
        return totalTrades


tradeReader(tradeString, [])
