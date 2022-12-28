import fs from "fs";

type File = number;

interface Directory {
  __parent?: Directory;
  __size: number;
  [key: string]: File | Directory;
}

function isFile(x: any): x is number {
  return typeof x === "number";
}

function isDirectory(x: any): x is Directory {
  return typeof x === "object" && "__parent" in x;
}

function directoriesAboveCutoff(
  searchDir: Directory,
  cutOff: number
): Array<Directory> {
  const accumulator: Array<Directory> = [];

  if (searchDir.__size >= cutOff) {
    accumulator.push(searchDir);
  }

  const dirKeys = Object.keys(searchDir).filter((key) => key !== "__parent");
  for (let dirKey of dirKeys) {
    const dirOrFile = searchDir[dirKey];
    if (isDirectory(dirOrFile)) {
      accumulator.push(...directoriesAboveCutoff(dirOrFile, cutOff));
    }
  }

  return accumulator;
}

function calculateDirSize(directory: Directory): number {
  const dirKeys = Object.keys(directory).filter((key) => key !== "__parent");
  let total = 0;
  for (let dirKey of dirKeys) {
    const dirOrFile = directory[dirKey];
    if (isFile(dirOrFile)) {
      total += dirOrFile;
    } else if (isDirectory(dirOrFile)) {
      total += calculateDirSize(dirOrFile);
    }
  }
  directory.__size = total;
  return total;
}

fs.readFile("in.txt", "utf8", (err, data) => {
  console.time("7b");
  const lines = data.split("\n");

  const fileSystem: Directory = { __size: 0 };

  let currentDirectory: Directory = fileSystem;

  const commandMap = {
    cd: (target: string) => {
      if (target === "..") {
        currentDirectory = currentDirectory.__parent;
      } else {
        currentDirectory[target] = {
          __parent: currentDirectory,
          __size: 0,
        };
        currentDirectory = currentDirectory[target] as Directory;
      }
    },
    ls: () => {}, // Ignored
    dir: (name: string) => {}, // Ignored
  };

  lines.forEach((line) => {
    const trimmed = line.replace("$ ", "").split(" ");
    if (trimmed[0] in commandMap) {
      commandMap[trimmed[0]](trimmed[1]);
    } else {
      // Filesize output, register it to the current directory
      const split = line.split(" ");
      currentDirectory[split[1]] = parseInt(split[0]);
    }
  });

  // FS mapping complete
  const diskSize = 70000000;
  const minFreeSpace = 30000000;
  const totalOccupiedSpace = calculateDirSize(fileSystem);
  const freeSpace = diskSize - totalOccupiedSpace;
  const requiredToFree = minFreeSpace - freeSpace;

  // Go through all directories in the filesystem and keep a reference to all directories whos size <= cutoff
  const cutOff = requiredToFree;
  const dirsBelowCutoff = directoriesAboveCutoff(fileSystem, cutOff);
  const qualifiedDirs = dirsBelowCutoff
    .map((dir) => dir.__size)
    .sort((a, b) => a - b);
  console.log(qualifiedDirs[0]);
  console.timeEnd("7b");
});
