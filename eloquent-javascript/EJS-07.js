console.log("Exercises\n");
console.log("\tRetry\n");

/*Say you have a function primitiveMultiply that in 20 percent of 
cases multiplies two numbers and in the other 80 percent of cases
raises an exception of type MultiplicatorUnitFailure. 
Write a function that wraps this clunky function and just keeps 
trying until a call succeeds, after which it returns the result.

Make sure you handle only the exceptions you are trying to handle.*/

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  for (;;) {
    try {
      return primitiveMultiply(a, b);
    } catch (error) {
      if (!(error instanceof MultiplicatorUnitFailure)) {
        throw error;
      }
    }
  }
}

console.log(reliableMultiply(8, 8));
// → 64

console.log("\tThe Locked Box\n");

/*It is a box with a lock. There is an array in the box, but you can 
get at it only when the box is unlocked. Directly accessing the 
private _content property is forbidden.

Write a function called withBoxUnlocked that takes a function 
value as argument, unlocks the box, runs the function, and then 
ensures that the box is locked again before returning, regardless 
of whether the argument function returned normally or threw an exception.
*/
const box = {
  locked: true,
  unlock() {
    this.locked = false;
  },
  lock() {
    this.locked = true;
  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  },
};

function withBoxUnlocked(body) {
  if (box.locked) {
    box.unlock();
  }
  try {
    body();
  } catch (error) {
    throw error;
  } finally {
    box.lock();
  }
}

withBoxUnlocked(function () {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function () {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true

/*For extra points, make sure that if you call withBoxUnlocked 
when the box is already unlocked, the box stays unlocked.*/
