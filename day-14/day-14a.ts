import fs from "fs";

type Vertex = {
  a: Coordinate;
  b: Coordinate;
};

type Coordinate = {
  x: number;
  y: number;
};

type Cave = Array<Array<string>>;

const canDropBelow = (cave: Cave, sandCoordinate: Coordinate) =>
  cave[sandCoordinate.y + 1][sandCoordinate.x] === undefined;

const canDropLeft = (cave: Cave, sandCoordinate: Coordinate) =>
  cave[sandCoordinate.y + 1][sandCoordinate.x - 1] === undefined;

const canDropRight = (cave: Cave, sandCoordinate: Coordinate) =>
  cave[sandCoordinate.y + 1][sandCoordinate.x + 1] === undefined;

function attemptDrop(cave: Cave, sandCoordinate: Coordinate) {
  let endCoord: Coordinate = { ...sandCoordinate };
  try {
    if (canDropBelow(cave, sandCoordinate)) {
      endCoord = { x: sandCoordinate.x, y: sandCoordinate.y + 1 };
    } else if (canDropLeft(cave, sandCoordinate)) {
      endCoord = { x: sandCoordinate.x - 1, y: sandCoordinate.y + 1 };
    } else if (canDropRight(cave, sandCoordinate)) {
      endCoord = { x: sandCoordinate.x + 1, y: sandCoordinate.y + 1 };
    }
    if (endCoord.y !== sandCoordinate.y) {
      // Move grain to end coord
      cave[endCoord.y][endCoord.x] = "o";
      // Remove grain from previous position
      cave[sandCoordinate.y][sandCoordinate.x] = undefined;
      // See if we can drop furter
      return attemptDrop(cave, endCoord);
    }
    return true;
  } catch (error) {
    // Grain fell into oblivion
    cave[sandCoordinate.y][sandCoordinate.x] = undefined;
    return false;
  }
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");

  const caveSystem: Array<Array<string>> = [];
  lines.forEach((scan) => {
    const scanCoords = scan.split(" -> ");
    const vertices: Array<Vertex> = [];
    for (let idx = 0; idx < scanCoords.length - 1; idx++) {
      const fromPair = scanCoords[idx].split(",");
      const toPair = scanCoords[idx + 1].split(",");

      const a: Coordinate = {
        x: parseInt(fromPair[0]),
        y: parseInt(fromPair[1]),
      };
      const b: Coordinate = {
        x: parseInt(toPair[0]),
        y: parseInt(toPair[1]),
      };
      vertices.push({ a, b });
    }

    vertices.forEach((vert) => {
      const startX = Math.min(vert.a.x, vert.b.x);
      const endx = Math.max(vert.a.x, vert.b.x);
      const startY = Math.min(vert.a.y, vert.b.y);
      const endY = Math.max(vert.a.y, vert.b.y);

      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endx; x++) {
          if (caveSystem[y] === undefined) {
            caveSystem[y] = [];
          }
          caveSystem[y][x] = "#";
        }
      }
    });
  });

  const sandSourceCoord: Coordinate = {
    x: 500,
    y: 0,
  };

  const caveEnd = parseInt(Object.keys(caveSystem).pop());

  for (let y = 0; y < caveEnd; y++) {
    if (caveSystem[y] === undefined) {
      caveSystem[y] = [];
    }
  }

  let restingGrains = 0;
  let reachedInfinity = false;
  while (!reachedInfinity) {
    const dropCoord: Coordinate = { ...sandSourceCoord };

    reachedInfinity = !attemptDrop(caveSystem, dropCoord);
    if (!reachedInfinity) {
      restingGrains += 1;
    }
  }

  console.log(caveSystem);
  console.log(restingGrains);
});
