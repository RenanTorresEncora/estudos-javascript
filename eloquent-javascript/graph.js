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
    for (let [from, to] of edges){
      addEdge(from, to);
      addEdge(to, from);
    }
    return graph;
  }
  module.exports = {buildGraph};