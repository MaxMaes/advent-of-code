import fs from "fs";

type Coordinate = {
  x: number;
  y: number;
};

const distanceBetween = (a: Coordinate, b: Coordinate) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

class SensorBeaconPair {
  constructor(public sensor: Coordinate, public beacon: Coordinate) {}

  nearestBeaconDistance = distanceBetween(this.sensor, this.beacon);
  xCoords = [
    this.sensor.x - this.nearestBeaconDistance,
    this.sensor.x + this.nearestBeaconDistance,
    this.beacon.x - this.nearestBeaconDistance,
    this.beacon.x + this.nearestBeaconDistance,
  ];
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

  let total = [];
  for (let x = minX; x <= maxX; x++) {
    if (x % 100 === 0) console.log(x);
    // console.log((x / maxX) * 100);
    for (let y = minY; y <= maxY; y++) {
      const maybeBeacon: Coordinate = {
        x,
        y,
      };

      const isInRangeOfASensor = sensorBeaconPairs.some(
        (pair) =>
          distanceBetween(pair.sensor, maybeBeacon) <=
          pair.nearestBeaconDistance
      );

      if (!isInRangeOfASensor) {
        console.log("FOUND IT");
        console.log(x * 4000000 + y);
      }
    }
  }

  console.log(total.length);
});
