const fs = require("fs");
// const jtoken = require("jsonwebtoken");
// console.log(fs);
const filedata = fs.readFileSync("../jsfunctions.js", "utf-8");
console.log(filedata);
