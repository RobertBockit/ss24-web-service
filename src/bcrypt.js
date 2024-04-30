import bcrypt from "bcrypt"

const hash = await bcrypt.hash('123', 10)
const hash2 = await bcrypt.hash('123', 10)
const result = await bcrypt.compare("123", hash)
const result2 = await bcrypt.compare("123", hash)

console.log(result)
console.log(result2)

console.log(await bcrypt.hash('123',10))