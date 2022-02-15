require("./utils/scripts.js");

console.log("Chapter 05 - Exercises\n");
console.log("\tArray Flattening\n");

console.log("const arrays = [[1, 2, 3], [4, 5], [6]]");
const arrays = [[1, 2, 3], [4, [5]], [6]];
const flattenedArray = arrays.reduce((result, element) => {
  return result.concat(element);
});
console.log(`Flattened: ${flattenedArray}`);

console.log("\n\tYour Own Loop\n");

const loop = (value, test, update, body) => {
  const iterations = value;
  for (let i = 0; i < iterations; i++) {
    if (!test) return false;
    body(value);
    value = update(value);
  }
};
console.log("loop(3, n => n > 0, n => n - 1, console.log)");
loop(
  3,
  (n) => n > 0,
  (n) => n - 1,
  console.log
);

console.log("\n\tEverything\n");

const every = (array, test) => {
  for (const item of array) {
    if (!test(item)) return false;
  }
  return true;
};

const every2 = (array, test) => {
  return !array.some((item) => !test(item));
};

console.log(every([1, 3, 5], (n) => n < 10));
// → true
console.log(every2([2, 4, 16], (n) => n < 10));
// → false
console.log(every2([], (n) => n < 10));
// → true

console.log("\n\tDominant Writing Direction\n");

function characterScript(code) {
  for (const script of SCRIPTS) {
    if (
      script.ranges.some(([from, to]) => {
        return code >= from && code < to;
      })
    ) {
      return script;
    }
  }
  return null;
}
function countBy(items, groupName) {
  const counts = [];
  for (const item of items) {
    const name = groupName(item);
    const known = counts.findIndex((c) => c.name == name);
    if (known == -1) {
      counts.push({ name, count: 1 });
    } else {
      counts[known].count++;
    }
  }
  return counts;
}

function dominantDirection(text) {
  const scripts = countBy(text, (char) => {
    const script = characterScript(char.codePointAt(0));
    return script ? script.direction : "none";
  }).filter(({ name }) => name != "none");

  const total = scripts.reduce((n, { count }) => n + count, 0);
  if (total == 0) return "No scripts found";

  return scripts.filter(({ name, count }) => {
    if (((count * 100) / total) > 50) {
      return name;
    }
     }).map(item => item.name);
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
