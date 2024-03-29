console.log("\nExercises\n");
console.log("\tRegexp Golf\n");

/*Code golf is a term used for the game of trying to express a particular 
program in as few characters as possible. Similarly, regexp golf is the 
practice of writing as tiny a regular expression as possible to match a 
given pattern, and only that pattern.

For each of the following items, write a regular expression to test 
whether any of the given substrings occur in a string. The regular 
expression should match only strings containing one of the substrings 
described. Do not worry about word boundaries unless explicitly mentioned. 
When your expression works, see whether you can make it any smaller.


Refer to the table in the chapter summary for help. Test each solution with a few test strings.*/

// Fill in the regular expressions

// 1- car and cat
verify(/(ca)(r+?|t+?)/, ["my car", "bad cats"], ["camper", "high art"]);

// 2- pop and prop
verify(/(pr?op)/, ["pop culture", "mad props"], ["plop", "prrrop"]);

// 3- ferret, ferry, and ferrari
verify(
    /(ferr)(et|y|ari)/,
    ["ferret", "ferry", "ferrari"],
    ["ferrum", "transfer A"]
    );

    // 4- Any word ending in ious
    verify(
        /\b(.+?ious)\b/,
  ["how delicious", "spacious room"],
  ["ruinous", "consciousness"]
  );
  
// 5- A whitespace character followed by a period, comma, colon, or semicolon
verify(/\s\./, ["bad punctuation ."], ["escape the period"]);

// 6- A word longer than six letters
verify(
    /^\w{6,}$/,
    ["Siebentausenddreihundertzweiundzwanzig"],
    ["no", "three small words"]
    );
    
    // 7- A word without the letter e (or E)
    verify(
        /\b[^eE\s]+\b/,
        ["red platypus", "wobbling nest"],
        ["earth bed", "learning ape", "BEET"]
        );
        
        function verify(regexp, yes, no) {
            // Ignore unfinished exercises
            if (regexp.source == "...") return;
            for (let str of yes)
            if (!regexp.test(str)) {
                console.log(`Failure to match '${str}'`);
            }
            for (let str of no)
            if (regexp.test(str)) {
                console.log(`Unexpected match for '${str}'`);
            }
        }

console.log("\tQuoting Style\n");

/*Imagine you have written a story and used single quotation marks 
throughout to mark pieces of dialogue. Now you want to replace all 
the dialogue quotes with double quotes, while keeping the single 
quotes used in contractions like aren’t.

Think of a pattern that distinguishes these two kinds of quote 
usage and craft a call to the replace method that does the proper replacement.*/

let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/(^'|'$|(\B'))/g, "\""));
// → "I'm the cook," he said, "it's my job."

console.log("\n\tNumbers Again\n");

/*Write an expression that matches only JavaScript-style numbers. 
It must support an optional minus or plus sign in front of the number,
 the decimal dot, and exponent notation—5e-3 or 1E10—again with an 
 optional sign in front of the exponent. Also note that it is not 
 necessary for there to be digits in front of or after the dot, but 
 the number cannot be a dot alone. 
 That is, .5 and 5. are valid JavaScript numbers, but a lone dot isn’t.*/

// Fill in this regular expression.
let number = /^(\+|-|\.|)\d+(\.\d+|\.$|\.\d[Ee]\d|[Ee](\+|-)\d+)?$/;

// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}