import fs from "fs";

fs.readFile("in.txt", "utf8", (err, data) => {
  console.time("8a");
  const lines = data.split("\n");

  const treeMap = lines.map((line) =>
    line.split("").map((tree) => parseInt(tree))
  );

  let visibleTreesLeftAndRight = 0;
  for (let rowIdx = 0; rowIdx < treeMap.length; rowIdx++) {
    const row = treeMap[rowIdx];
    for (let columnIdx = 0; columnIdx < row.length; columnIdx++) {
      const tree = row[columnIdx];
      let visibleFromLeft = true;
      // Cast ray left, starting from the current tree
      for (let testIdx = columnIdx - 1; testIdx >= 0; testIdx--) {
        const testTree = row[testIdx];
        if (tree <= testTree) {
          visibleFromLeft = false;
          break;
        }
      }
      let visibleFromRight = true;
      // Cast ray right, starting from the current tree
      for (let testIdx = columnIdx + 1; testIdx < row.length; testIdx++) {
        const testTree = row[testIdx];
        if (tree <= testTree) {
          visibleFromRight = false;
          break;
        }
      }
      let visibleFromTop = true;
      // Cast ray to top, starting from the current tree
      for (let testIdx = rowIdx - 1; testIdx >= 0; testIdx--) {
        const testTree = treeMap[testIdx][columnIdx];
        if (tree <= testTree) {
          visibleFromTop = false;
          break;
        }
      }
      let visibleFromBottom = true;
      // Cast ray to bottom, starting from the current tree
      for (let testIdx = rowIdx + 1; testIdx < treeMap.length; testIdx++) {
        const testTree = treeMap[testIdx][columnIdx];
        if (tree <= testTree) {
          visibleFromBottom = false;
          break;
        }
      }

      if (
        visibleFromLeft ||
        visibleFromRight ||
        visibleFromTop ||
        visibleFromBottom
      ) {
        visibleTreesLeftAndRight++;
      }
    }
  }

  console.log(visibleTreesLeftAndRight);
  console.timeEnd("8a");
});
