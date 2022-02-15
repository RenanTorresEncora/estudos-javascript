console.log("\nProject Robot\n");

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];
// Builds a data structure to hold the places and roads.
function buildGraph(edges) {
  let graph = Object.create(null);
  // Function that adds each possible place connected to another
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  // For loop that maps each place on the variables from and to
  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}
// Random choice from an array
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}
// Random direction from a state graph
function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}
// Adding a property to the constructor to randomly generate a new village state
VillageState.random = function (parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph)); // Pick a random address to start
    let place;
    do {
      place = randomPick(Object.keys(roadGraph)); // Pick another address that isn't the first
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
};

// The Mail's truck route
const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];
// The robot that follows a route and remembers where it has been
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}
// Function that finds the shortest route
function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

function goalOrientedRobot({ place, parcels }, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

console.log("Exercises\n");
console.log("\tMeasuring a Robot\n");

/*It’s hard to objectively compare robots by just letting them 
solve a few scenarios. Maybe one robot just happened to get 
easier tasks or the kind of tasks that it is good at,
 whereas the other didn’t.

Write a function compareRobots that takes two robots 
(and their starting memory). 
It should generate 100 tasks and let each of the robots 
solve each of these tasks. When done, it should output 
the average number of steps each robot took per task.

For the sake of fairness, make sure you give each task to both
 robots, rather than generating different tasks per robot.*/

function runLoggedRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      return turn;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

function compareRobots(robot1, memory1, robot2, memory2) {
  let firstRobotSteps = 0;
  let secondRobotSteps = 0;
  const measurements = 100;
  for (let i = 0; i < measurements; i++) {
    const task = new VillageState.random();
    firstRobotSteps += runLoggedRobot(task, robot1, memory1);
    secondRobotSteps += runLoggedRobot(task, robot2, memory2);
  }
  return console.log(
    `Robot steps average: \nFirst: \t\t${
      firstRobotSteps / measurements
    } steps\nSecond: \t${secondRobotSteps / measurements} steps`
  );
}

compareRobots(routeRobot, [], goalOrientedRobot, []);

console.log("\nRobot Efficiency");

/*Can you write a robot that finishes the delivery task faster 
than goalOrientedRobot? If you observe that robot’s behavior, 
what obviously stupid things does it do? How could those be improved?

If you solved the previous exercise, you might want to use 
your compareRobots function to verify whether you improved 
the robot. */

function myRobot({ place, parcels }, route) {
  const routeLength = (x) => findRoute(roadGraph, place, x.place).length;
  const shortestRouteParcel = parcels.reduce((a, b) =>
    routeLength(a) > routeLength(b) ? b : a
  );
  if (route.length == 0) {
    let parcel = shortestRouteParcel;
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

compareRobots(goalOrientedRobot, [], myRobot, []);

console.log("\nPersistent Group");
/*Most data structures provided in a standard JavaScript environment 
aren’t very well suited for persistent use. 
Arrays have slice and concat methods, which allow us to easily create 
new arrays without damaging the old one. But Set, for example, has no 
methods for creating a new set with an item added or removed.

Write a new class PGroup, similar to the Group class from Chapter 6, 
which stores a set of values. Like Group, it has add, delete, and has methods.

Its add method, however, should return a new PGroup instance with 
the given member added and leave the old one unchanged. 
Similarly, delete creates a new instance without a given member.

The class should work for values of any type, not just strings. 
It does not have to be efficient when used with large amounts of values.

The constructor shouldn’t be part of the class’s interface 
(though you’ll definitely want to use it internally). 
Instead, there is an empty instance, PGroup.empty, 
that can be used as a starting value.

Why do you need only one PGroup.empty value, rather than having a 
function that creates a new, empty map every time?*/

class PGroup {
  constructor() {
    this.values = [];
  }
  add(valueToAdd) {
    if (!this.has(valueToAdd)) {
      const newGroup = new PGroup();
      newGroup.values.push(...this.values, valueToAdd);
      return newGroup;
    }
  }
  delete(valueToDelete) {
    if (this.has(valueToDelete)) {
      const newGroup = new PGroup();
      newGroup.values = this.values.filter(item => item != valueToDelete);
      return newGroup;
    }
  }
  has(value) {
    return this.values.includes(value);
  }
  static from(obj) {
    const newGroup = new PGroup();
    for (const item of obj) {
      newGroup.add(item);
    }
    return newGroup;
  }
}
PGroup.empty = new PGroup();

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
