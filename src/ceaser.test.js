import {expect, test} from "@jest/globals";
import {decrypt, encrypt} from "./ceasar.js";




test ('Encryption with 3 shift', () => {
    expect(encrypt(3,"A")).toBe("d")
})

test ('Encryption with 4 shift', () => {
    expect(encrypt(4,"A")).toBe("e")
})

test ('Decryption with 4 shift', () => {
    expect(decrypt(77,encrypt(77,"AJ"))).toBe("aj")
})


test ('Incorrect Symbol Detection', () => {
    expect(encrypt(3,"A!!!!")).toThrow()
})