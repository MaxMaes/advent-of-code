import fs from "fs";

type Coordinate = {
  x: number;
  y: number;
};

class Square {
  p1: Coordinate;
  p2: Coordinate;
  p3: Coordinate;
  p4: Coordinate;

  constructor(p1: Coordinate, size: number) {
    this.p1 = p1;
    this.p2 = { x: p1.x + size, y: p1.y };
    this.p3 = { x: p1.x + size, y: p1.y + size };
    this.p4 = { x: p1.x, y: p1.y + size };
  }
}

const createSquares = (origin: Coordinate, size: number, divider: number) => {
  const result = new Array<Square>();
  let newSize = size / divider;
  for (let x = origin.x; x < origin.x + size; x += newSize) {
    for (let y = origin.y; y < origin.y + size; y += newSize) {
      result.push(
        new Square(
          {
            x,
            y,
          },
          newSize - 1
        )
      );
    }
  }
  return result;
};

const distanceBetween = (a: Coordinate, b: Coordinate) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

class SensorBeaconPair {
  constructor(public sensor: Coordinate, public beacon: Coordinate) {
    const outLine: Array<Coordinate> = [];
  }

  nearestBeaconDistance = distanceBetween(this.sensor, this.beacon);
  xCoords = [
    this.sensor.x - this.nearestBeaconDistance,
    this.sensor.x + this.nearestBeaconDistance,
    this.beacon.x - this.nearestBeaconDistance,
    this.beacon.x + this.nearestBeaconDistance,
  ];

  fullyCoversSquare = (square: Square): boolean => {
    return (
      this.isCoordinateWithinRange(square.p1) &&
      this.isCoordinateWithinRange(square.p2) &&
      this.isCoordinateWithinRange(square.p3) &&
      this.isCoordinateWithinRange(square.p4)
    );
  };

  isCoordinateWithinRange = (coord: Coordinate): boolean => {
    return distanceBetween(coord, this.sensor) <= this.nearestBeaconDistance;
  };
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");
  const regex = /[x,y]=(\d+)|[x|y]=(-\d+)/gm;

  const sensorBeaconPairs = lines.map((line) => {
    const regexResult = line.matchAll(regex);

    const sensorPosition: Coordinate = { x: Infinity, y: Infinity };
    const beaconPosition: Coordinate = { x: Infinity, y: Infinity };

    let builder = sensorPosition;

    let index = 0;
    for (let result of regexResult) {
      if (index % 2 == 0) {
        builder.x = parseInt(result[1] ?? result[2]);
      } else {
        builder.y = parseInt(result[1] ?? result[2]);
      }
      index++;
      if (builder.x !== Infinity && builder.y !== Infinity) {
        if (builder !== beaconPosition) {
          builder = beaconPosition;
        } else {
          break;
        }
      }
    }

    return new SensorBeaconPair(sensorPosition, beaconPosition);
  });

  const xCoords = sensorBeaconPairs
    .flatMap((x) => x.xCoords)
    .map((x) => x)
    .sort((a, b) => a - b);

  // const xMin = xCoords[0];
  // const xMax = xCoords[xCoords.length - 1];

  const minX = 0;
  const maxX = 4000000;
  const minY = 0;
  const maxY = 4000000;

  let squareSize = maxX;
  let inputSquareList = new Array<Square>(
    new Square({ x: 0, y: 0 }, squareSize)
  );
  let resultSquareList = new Array<Square>();

  console.time("algo");
  while (true) {
    for (let square of inputSquareList) {
      const subsquares = createSquares(
        square.p1,
        squareSize,
        squareSize > 100 ? 100 : 4
      );
      for (let subSquare of subsquares) {
        if (!sensorBeaconPairs.some((r) => r.fullyCoversSquare(subSquare))) {
          resultSquareList.push(subSquare);
        }
      }
    }

    if (resultSquareList.length == 1) break;

    inputSquareList = resultSquareList;
    resultSquareList = new Array<Square>();
    squareSize /= 100;
  }

  console.log("done");
  const result = resultSquareList[0];
  console.log(result.p1.x * maxX + result.p1.y);
  console.timeEnd("algo");
});
