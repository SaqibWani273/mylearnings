/* let i = 1;
let total = 0;
do {
  total += i++;
} while (i <= 3);
console.log(total); */

let arr = [2, 4, 6];
let mArr = [];

arr.forEach((element) => {
  mArr.push(element * 2);
});
console.log(mArr);
