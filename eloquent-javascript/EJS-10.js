// Code from the Chapter
const bigOak = require("./crow-tech").bigOak;

var defineRequestType = require("./crow-tech").defineRequestType;

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

function storage(nest, name) {
  return new Promise((resolve) => {
    nest.readStorage(name, (result) => resolve(result));
  });
}

var Timeout = class Timeout extends Error {};

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}

function requestType(name, handler) {
  defineRequestType(name, (nest, content, source, callback) => {
    try {
      Promise.resolve(handler(nest, content, source)).then(
        (response) => callback(null, response),
        (failure) => callback(failure)
      );
    } catch (exception) {
      callback(exception);
    }
  });
}

requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map((neighbor) => {
    return request(nest, neighbor, "ping").then(
      () => true,
      () => false
    );
  });
  return Promise.all(requests).then((result) => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

var everywhere = require("./crow-tech").everywhere;

everywhere((nest) => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "gossip", message);
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${message}' from ${source}`);
  sendGossip(nest, message, source);
});

requestType("connections", (nest, { name, neighbors }, source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) == JSON.stringify(neighbors))
    return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name),
    });
  }
}

everywhere((nest) => {
  nest.state.connections = new Map();
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});

function findRoute(from, to, connections) {
  let work = [{ at: from, via: null }];
  for (let i = 0; i < work.length; i++) {
    let { at, via } = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some((w) => w.at == next)) {
        work.push({ at: next, via: via || next });
      }
    }
  }
  return null;
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target, nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route", { target, type, content });
  }
}

requestType("route", (nest, { target, type, content }) => {
  return routeRequest(nest, target, type, content);
});

requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
  return storage(nest, name).then((found) => {
    if (found != null) return found;
    else return findInRemoteStorage(nest, name);
  });
}

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter((n) => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() * sources.length)];
      sources = sources.filter((n) => n != source);
      return routeRequest(nest, source, "storage", name).then(
        (value) => (value != null ? value : next()),
        next
      );
    }
  }
  return next();
}

var Group = class Group {
  constructor() {
    this.members = [];
  }
  add(m) {
    this.members.add(m);
  }
};

function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
  let list = "";
  await Promise.all(
    network(nest).map(async (name) => {
      list += `${name}: ${await anyStorage(nest, name, `chicks in ${year}`)}\n`;
    })
  );
  return list;
}
// End of the code from the chapter

console.log("\nChapter 11 Exercises\n");

console.log("\tTracking the scalpel");

/*The village crows own an old scalpel that they occasionally use on special
missions—say, to cut through screen doors or packaging. To be able to quickly 
track it down, every time the scalpel is moved to another nest, an entry is 
added to the storage of both the nest that had it and the nest that took it, 
under the name "scalpel", with its new location as the value.

This means that finding the scalpel is a matter of following the breadcrumb 
trail of storage entries, until you find a nest where that 
points at the nest itself.

Write an async function locateScalpel that does this, starting at the nest 
on which it runs. You can use the anyStorage function defined earlier to 
access storage in arbitrary nests. The scalpel has been going around long 
enough that you may assume that every nest has a "scalpel" 
entry in its data storage.

Next, write the same function again without using async and await.

Do request failures properly show up as rejections of the returned 
promise in both versions? How?*/

async function locateScalpel(nest) {
  let current = nest.name;
  while (true) {
    let next = await anyStorage(nest, current, "scalpel");
    if (next == current) return current;
    current = next;
  }
}

function locateScalpel2(nest) {
  function loop(current) {
    return anyStorage(nest, current, "scalpel").then((next) => {
      if (next == current) return current;
      else return loop(next);
    });
  }
  return loop(nest.name);
}

locateScalpel(bigOak).then(console.log);
locateScalpel2(bigOak).then(console.log);
// → Butcher Shop

console.log("\n\tBuilding Promise.all");

/*Given an array of promises, Promise.all returns a promise that waits for 
all of the promises in the array to finish. It then succeeds, yielding an 
array of result values. If a promise in the array fails, the promise 
returned by all fails too, with the failure reason from the failing promise.

Implement something like this yourself as a regular function called Promise_all.

Remember that after a promise has succeeded or failed, it can’t succeed 
or fail again, and further calls to the functions that resolve it are ignored. 
This can simplify the way you handle failure of your promise.")*/

function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    const fulfilled = [];
    let pending = promises.length;
    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((result) => {
          fulfilled[i] = result;
          pending--;
          if (pending == 0) resolve(fulfilled);
        })
        .catch(reject);
    }
    if (promises.length == 0) resolve(fulfilled);
  });
}

// Test code.
Promise_all([]).then((array) => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then((array) => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then((array) => {
    console.log("We should not get here");
  })
  .catch((error) => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });
