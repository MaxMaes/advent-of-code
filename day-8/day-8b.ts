import fs from "fs";

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");

  const treeMap = lines.map((line) =>
    line.split("").map((tree) => parseInt(tree))
  );

  let highestScore = 0;
  for (let rowIdx = 0; rowIdx < treeMap.length; rowIdx++) {
    const row = treeMap[rowIdx];
    for (let columnIdx = 0; columnIdx < row.length; columnIdx++) {
      const tree = row[columnIdx];
      let distanceLeft = columnIdx;
      let distanceRight = row.length - 1 - columnIdx;
      let distanceTop = rowIdx;
      let distanceBottom = treeMap.length - 1 - rowIdx;

      // Cast ray left, starting from the current tree
      for (let testIdx = columnIdx - 1; testIdx >= 0; testIdx--) {
        const testTree = row[testIdx];
        if (tree <= testTree) {
          // Tree found blocking view
          distanceLeft = columnIdx - testIdx;
          break;
        }
      }
      // Cast ray right, starting from the current tree
      for (let testIdx = columnIdx + 1; testIdx < row.length; testIdx++) {
        const testTree = row[testIdx];
        if (tree <= testTree) {
          // Tree found blocking view
          distanceRight = testIdx - columnIdx;
          break;
        }
      }
      // Cast ray to top, starting from the current tree
      for (let testIdx = rowIdx - 1; testIdx >= 0; testIdx--) {
        const testTree = treeMap[testIdx][columnIdx];
        if (tree <= testTree) {
          // Tree found blocking view
          distanceTop = rowIdx - testIdx;
          break;
        }
      }
      // Cast ray to bottom, starting from the current tree
      for (let testIdx = rowIdx + 1; testIdx < treeMap.length; testIdx++) {
        const testTree = treeMap[testIdx][columnIdx];
        if (tree <= testTree) {
          // Tree found blocking view
          distanceBottom = testIdx - rowIdx;
          break;
        }
      }
      const score = distanceLeft * distanceTop * distanceBottom * distanceRight;
      if (score > highestScore) {
        highestScore = score;
      }
    }
  }

  console.log(highestScore);
});
