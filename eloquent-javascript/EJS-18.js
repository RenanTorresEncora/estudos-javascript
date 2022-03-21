const { readFile, readdir, stat } = require("fs").promises;

async function search() {
  if (process.argv.length <= 2) {
    return console.log(
      '\nSearch <regex> <files> \n \tUSAGE: Just like grep, the first argument is the regex, and the subsequent ones are files or directories to search for. \n\n\tExample: EJS-18.js test testfile.txt \n\t\t- Searches for the string "test" in the file "testfile.txt".'
    );
  }
  const regex = new RegExp(process.argv[2]);

  const arguments = process.argv.slice(3);
  if (arguments.length === 0) {
    arguments.push(process.cwd());
  }
  async function searchThrough(path) {
    const fileStat = await stat(path);
    if (fileStat.isDirectory()) {
      for (let file of await readdir(path)) {
        searchThrough(path + "/" + file);
      }
    } else {
      const fileContent = await readFile(path, "utf-8");
      if (fileContent.match(regex)) {
        console.log("Pattern found at file: \n\t", path);
      }
    }
  }
  for (let arg of arguments) {
    searchThrough(arg);
  }
}

search();
