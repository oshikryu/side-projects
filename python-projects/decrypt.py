"""
decrypt

    Convert every letter to its ASCII value.
    Modify the ASCII values by adding 1 to the first letter, and for each subsequent letter, add the encrypted ASCII value of the previous letter to its original ASCII value.
    Subtract 26 from every letter until it is in the range of lowercase letters a-z in ASCII. Convert the values back to letters.

"""
def decrypt(word: str) -> str:
    secondStep = 1
    decryption = ""
    for i in range(len(word)):
        newLetterAscii = ord(word[i])
        newLetterAscii = newLetterAscii - secondStep
        while newLetterAscii < ord('a'):
            newLetterAscii += 26
        decryption += chr(newLetterAscii)
        secondStep += newLetterAscii

    return decryption


  
# debug your code below
print(decrypt("dnotq"))
