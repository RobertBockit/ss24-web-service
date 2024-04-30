const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');


function encrypt(shift, string) {

    let result = "";

    string.toLowerCase().split('').forEach((letter) => {

        let letterPosition = alphabet.findIndex((l) => l === letter)

        if(letterPosition === -1 && letter === " "){
            result += " "
        }

        if(letterPosition !== -1 && letter !== " "){
            result += alphabet[(letterPosition+shift)%26]
        }

        if(letterPosition===-1 && letter !== " "){
            console.log(letter)
            throw Error(`String must only contain latin characters.`)
        }

    })

    return result
}


function decrypt(shift, string) {

    let result = "";

    string.toLowerCase().split('').forEach((letter) => {

        let letterPosition = alphabet.findIndex((l) => l === letter)

        if(letterPosition === -1 && letter === " "){
            result += " "
        }

        if(letterPosition !== -1 && letter !== " "){
            result += alphabet[((26 * (Math.ceil((shift ) / 26 + 1))) + letterPosition-shift)%26]
        }

        if(letterPosition===-1 && letter !== " "){
            throw Error(`String must only contain latin characters.`)
        }
    })

    return result;


    }




const test = encrypt(7, "Roberts")
console.log(test)
console.log(decrypt(7,test))

export {encrypt, decrypt}
