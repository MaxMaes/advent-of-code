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
    const visibleTrees = row.filter((tree, columnIndex) => {
      // Cast ray left, starting from the current tree
      if (row.slice(0, columnIndex).every((otherTree) => tree > otherTree)) {
        return true;
      }

      // Cast ray right, starting from the current tree
      if (
        row
          .slice(columnIndex + 1, row.length)
          .every((otherTree) => tree > otherTree)
      ) {
        return true;
      }

      // Cast ray to top, starting from the current tree
      if (
        treeMap
          .flatMap((x) => x[columnIndex]) // Make a list of the desired column
          .slice(0, rowIdx)
          .every((otherTree) => tree > otherTree)
      ) {
        return true;
      }

      // Cast ray to bottom, starting from the current tree
      if (
        treeMap
          .flatMap((x) => x[columnIndex]) // Make a list of the desired column
          .slice(rowIdx + 1, treeMap.length)
          .every((otherTree) => tree > otherTree)
      ) {
        return true;
      }

      return false;
    });

    visibleTreesLeftAndRight += visibleTrees.length;
  }

  console.log(visibleTreesLeftAndRight);
  console.timeEnd("8a");
});
