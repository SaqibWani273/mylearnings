/* function makeTea(teaName) {
  return `Making ${teaName}`;
}
console.log(makeTea("Earl Grey")); 
function orderTea(teaType) {
  function confirmOrder() {
    return `Ordered a ${teaType} tea`;
  }
  return confirmOrder();
}
orderTea("Earl Grey");
*/
/* // First class or Higher order functios
const makeTea = (teaType) => `Making a ${teaType} tea`;

function processTeadOrder(makeTea) {
  return makeTea("earl grey");
}
console.log(processTeadOrder(makeTea)); */
const teaMaker = (teatype) => {
  return `Making ${teatype}`;
};
function createTeaMaker() {
  return teaMaker;
}
const fun = createTeaMaker();
console.log(fun());
