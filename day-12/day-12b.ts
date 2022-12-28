import fs from "fs";

type MazeNode = {
  x: number;
  y: number;
  elevation: string;
};

class AStarNode {
  f: number = 0;
  g: number = 0;
  h: number = 0;

  constructor(
    public x: number,
    public y: number,
    public elevation: string,
    public parent?: AStarNode
  ) {}
}

function visualizePath(path: Array<AStarNode>, originalGrid: MazeNode[][]) {
  const visualPath = originalGrid.map((line, y) =>
    line
      .map((char, x) => {
        const nodeIndex = path.findIndex(
          (node) => node.x === x && node.y === y
        );
        if (nodeIndex > -1) {
          const next = path[nodeIndex + 1];
          if (next === undefined) {
            return "E";
          }
          if (next.x < path[nodeIndex].x) {
            return "<";
          }
          if (next.x > path[nodeIndex].x) {
            return ">";
          }
          if (next.y > path[nodeIndex].y) {
            return "v";
          }
          if (next.y < path[nodeIndex].y) {
            return "^";
          }
          return "#";
        } else {
          return ".";
        }
      })
      .join("")
  );
  return visualPath.join("\n");
}

function aStar(
  entry: MazeNode,
  exit: MazeNode,
  grid: Array<Array<MazeNode>>
): Array<AStarNode> | undefined {
  const openList: Array<AStarNode> = [];
  const closedList: Array<AStarNode> = [];

  // Add the start node
  openList.push(
    new AStarNode(entry.x, entry.y, grid[entry.y][entry.x].elevation)
  );

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    const currentNode = openList.shift();
    closedList.push(currentNode);

    if (currentNode.x === exit.x && currentNode.y === exit.y) {
      // EXIT FOUND
      let currentBacktracer = currentNode;
      const path = [];
      while (currentBacktracer !== undefined) {
        path.push(currentBacktracer);
        currentBacktracer = currentBacktracer.parent;
      }
      const actualPath = path.reverse();
      return actualPath;
    }

    const adjecantOffsets = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    const adjecantNodes = adjecantOffsets
      .map((offset) => {
        const newPos = {
          x: currentNode.x + offset.x,
          y: currentNode.y + offset.y,
        };
        if (
          !(newPos.y >= 0 && newPos.y < grid.length) ||
          !(newPos.x >= 0 && newPos.x < grid[newPos.y].length)
        ) {
          // Out of range
          return undefined;
        }
        const newNode = grid[newPos.y][newPos.x];

        if (
          newNode.elevation.charCodeAt(0) >
          currentNode.elevation.charCodeAt(0) + 1
        ) {
          // Climb at up for at most one step
          return undefined;
        }
        return new AStarNode(
          newNode.x,
          newNode.y,
          newNode.elevation,
          currentNode
        );
      })
      .filter((x) => x !== undefined);

    for (let child of adjecantNodes) {
      if (
        closedList.find(
          (closedNode) => closedNode.x === child.x && closedNode.y === child.y
        )
      ) {
        continue;
      }

      child.g = currentNode.g + 1;
      child.h = Math.pow(child.x - exit.x, 2) + Math.pow(child.y - exit.y, 2);
      child.f = child.g; // + child.h;

      if (
        openList.find(
          (closedNode) => closedNode.x === child.x && closedNode.y === child.y
        )
      ) {
        continue;
      }
      openList.push(child);
    }
  }
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const mutated = data.replace("S", "a");
  const lines = mutated.split("\n");

  const EXIT = "z";
  const EXIT_SIGN = "E";

  let entryNodes: Array<MazeNode> = [];
  let exitNode: MazeNode;

  const maze: Array<Array<MazeNode>> = lines.map((line, y) =>
    line.split("").map((character, x) => {
      if (character === EXIT_SIGN) {
        exitNode = {
          x,
          y,
          elevation: EXIT,
        };
        return exitNode;
      } else {
        const node = {
          x,
          y,
          elevation: character,
        };
        if (character === "a") {
          entryNodes.push(node);
        }
        return node;
      }
    })
  );

  const paths = entryNodes.map((entryNode) => aStar(entryNode, exitNode, maze));
  const sorted = paths.sort((a, b) => a.length - b.length);

  if (paths === undefined || paths.length === 0) {
    console.log("NO PATH");
  } else {
    const shortest = sorted[0];
    const visualPath = visualizePath(shortest, maze);
    console.log(visualPath);
    console.log("Nodes in path: ", shortest.length);
    console.log("Steps: ", shortest.length - 1);
  }
});
