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
    // Move grain to end coord
    cave[endCoord.y][endCoord.x] = "o";
    if (endCoord.y !== sandCoordinate.y) {
      // Remove grain from previous position
      cave[sandCoordinate.y][sandCoordinate.x] = undefined;
      // See if we can drop furter
      return attemptDrop(cave, endCoord);
    }
    return endCoord;
  } catch (error) {
    // Grain fell into oblivion
    cave[sandCoordinate.y][sandCoordinate.x] = undefined;
    return endCoord;
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

  const caveTop = parseInt(Object.keys(caveSystem).shift());
  const caveBottom = parseInt(Object.keys(caveSystem).pop());
  const caveFloorLevel = caveBottom + 2;

  for (let y = 0; y < caveFloorLevel; y++) {
    if (caveSystem[y] === undefined) {
      caveSystem[y] = [];
    }
  }

  caveSystem[caveFloorLevel] = [];
  for (let xTile = 0; xTile < 10000; xTile++) {
    caveSystem[caveFloorLevel][xTile] = "#";
  }

  let restingGrains = 0;
  let full = false;
  while (!full) {
    const dropCoord: Coordinate = { ...sandSourceCoord };
    const restingPosition = attemptDrop(caveSystem, dropCoord);
    full = restingPosition.y === sandSourceCoord.y;
    restingGrains += 1;
  }
  console.log(restingGrains);
});
