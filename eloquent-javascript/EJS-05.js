console.log("\nA Vector Type\n");
/*Write a class Vec that represents a vector in two-dimensional space. 
It takes x and y parameters (numbers), which it should save to properties of the same name.

Give the Vec prototype two methods, plus and minus, 
that take another vector as a parameter and return 
a new vector that has the sum or difference of the 
two vectors’ (this and the parameter) x and y values.

Add a getter property length to the prototype that 
computes the length of the vector—that is, the 
distance of the point (x, y) from the origin (0, 0).*/

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  plus(otherVector) {
    return new Vec(this.x + otherVector.x, this.y + otherVector.y);
  }
  minus(otherVector) {
    return new Vec(this.x - otherVector.x, this.y - otherVector.y);
  }
  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5

console.log("\nGroups\n");

/*Write a class called Group (since Set is already taken). 
Like Set, it has add, delete, and has methods. 
Its constructor creates an empty group, add adds a value to the group 
(but only if it isn’t already a member), delete removes its argument 
from the group (if it was a member), and has returns a Boolean value 
indicating whether its argument is a member of the group.

Use the === operator, or something equivalent such as indexOf, 
to determine whether two values are the same.

Give the class a static from method that takes an iterable 
object as argument and creates a group that contains all the 
values produced by iterating over it.
*/

class Group {
  constructor() {
    this.values = [];
  }
  length() {
    return this.values.length;
  }
  get(index) {
    return this.values[index];
    }
  add(valueToAdd) {
    if (!this.has(valueToAdd)) {
      this.values.push(valueToAdd);
    }
  }
  delete(valueToDelete) {
    if (this.has(valueToDelete)) {
      this.values = this.values.filter((v) => v != valueToDelete);
    }
  }
  has(value) {
    return this.values.includes(value);
  }
  static from(obj) {
    const newGroup = new Group();
    obj.forEach((value) => newGroup.add(value));
    return newGroup;
  }
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false

console.log("\nIterable Groups\n");
/* Make the Group class from the previous exercise iterable. 
Refer to the section about the iterator interface earlier 
in the chapter if you aren’t clear on the exact form of the interface anymore.

If you used an array to represent the group’s members, 
don’t just return the iterator created by calling the 
Symbol.iterator method on the array. That would work, 
but it defeats the purpose of this exercise.

It is okay if your iterator behaves strangely when the 
group is modified during iteration.
*/

class GroupIterator {
  constructor(group) {
    this.iterator = 0;
    this.group = group;
  }
  next() {
    if (this.iterator == this.group.length()) return { done: true };
    let value = {value: this.group.get(this.iterator)};
    this.iterator++;
    return { value, done: false };
  }
}

Group.prototype[Symbol.iterator] = function() {
  return new GroupIterator(this);
};

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c

console.log("\nBorrowing a method\n");

/*Earlier in the chapter I mentioned that an object’s hasOwnProperty
can be used as a more robust alternative to the in operator when you
want to ignore the prototype’s properties. But what if your map needs
to include the word "hasOwnProperty"? You won’t be able to call that
method anymore because the object’s own property hides the method value.

Can you think of a way to call hasOwnProperty on an object that has 
its own property by that name?*/

let map = {one: true, two: true, hasOwnProperty: true};
// Fix this call
console.log(hasOwnProperty.call(map,"one"));
// → true