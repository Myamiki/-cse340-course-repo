import bcrypt from "bcrypt";

const password = "cse340!";

const hash = await bcrypt.hash(password, 10);

console.log(hash);