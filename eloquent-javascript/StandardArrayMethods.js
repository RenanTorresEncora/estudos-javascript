/* The following functions are standard methods for 
manipulating arrays in JavaScript */

// Example Array
let exampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log("\nFor Each method\n");
// Array.forEach(element => function)
exampleArray.forEach((n) => console.log(n));

console.log("\nFilter method\n");
// Array.filter(element => expression)
console.log(exampleArray.filter((n) => n % 2 == 0));

console.log("\nMap method\n");
// Array.map(element => function)
let mappedArray = [];
exampleArray.map((n) => mappedArray.push(n + "°"));
console.log(mappedArray);

console.log("\nReduce method\n");
// Array.reduce((previousElement, currentElement) => expression)
let reducedResult = 0;
reducedResult = exampleArray.reduce((a, b) => a + b);
console.log(reducedResult);
