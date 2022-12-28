import fs from "fs";
import {
  hLineShape,
  LShape,
  plusShape,
  ShapeDefinition,
  squareShape,
  vLineShape,
} from "./shape-definitions";

export type Coordinate = {
  x: number;
  y: number;
};

type JetDirection = "<" | ">";

const draw = (shapes: Array<Shape>) => {
  const lines = [];
  const maxY = findHighestRock(shapes);
  for (let y = 0; y <= maxY; y++) {
    let line = "";
    const pointsAtLine = shapes.flatMap((shape) =>
      shape.points.filter((point) => point.y === y)
    );
    for (let x = 0; x < 7; x++) {
      const pointAtX = pointsAtLine.find((point) => point.x === x);
      if (pointAtX) {
        line += "#";
      } else {
        line += ".";
      }
    }
    lines.push(line);
  }
  return lines.reverse().join("\n");
};

class Shape {
  points: Array<Coordinate>;

  constructor(origin: Coordinate, definition: ShapeDefinition) {
    this.points = definition.map((offset) => ({
      x: origin.x + offset.x,
      y: origin.y + offset.y,
    }));
  }

  canApplyJet = (direction: JetDirection, shapes: Array<Shape>) => {
    const value = direction === "<" ? -1 : 1;
    const pointsCopy = this.points.map((point) => ({ ...point }));
    pointsCopy.forEach((coordinate) => {
      coordinate.x += value;
    });

    return pointsCopy.every(
      (copiedPoint) =>
        copiedPoint.x >= 0 &&
        copiedPoint.x < 7 &&
        !shapes.some((shape) =>
          shape.points.some(
            (point) => point.x === copiedPoint.x && point.y === copiedPoint.y
          )
        )
    );
  };

  applyJet = (direction: JetDirection, currentStack: Array<Shape>) => {
    const value = direction === "<" ? -1 : 1;

    const canAppy = this.canApplyJet(direction, currentStack);
    if (canAppy) {
      this.points.forEach((coordinate) => {
        coordinate.x = coordinate.x + value;
      });
    }
  };

  canDrop = (currentStack: Array<Shape>) => {
    return this.points.every((point) => {
      const pointCopy = { ...point };
      pointCopy.y -= 1;

      // Check if there is a shape which has a point at the same coords as pointCopy
      const shapeIsBlockingDrop = currentStack.some((shape) =>
        shape.points.some(
          (shapePoint) =>
            shapePoint.x === pointCopy.x && shapePoint.y === pointCopy.y
        )
      );
      return !shapeIsBlockingDrop && pointCopy.y >= 0;
    });
  };

  canDrop2 = (shapes: Array<Shape>) => {
    const last100Rocks = shapes; //shapes.slice(shapes.length - optimizer, shapes.length);

    let shapeIsBlockingDrop = false;

    for (let myPointIdx = 0; myPointIdx < this.points.length; myPointIdx++) {
      const pointCopy = { ...this.points[myPointIdx] };
      pointCopy.y -= 1;
      // A point has reached the bottom, we cannot drop it furter
      if (pointCopy.y < 0) {
        return false;
      }

      for (let idx = 0; idx < last100Rocks.length; idx++) {
        const shape = last100Rocks[idx];
        for (let pointIdx = 0; pointIdx < shape.points.length; pointIdx++) {
          const shapePoint = shape.points[pointIdx];
          shapeIsBlockingDrop =
            shapePoint.x === pointCopy.x && shapePoint.y === pointCopy.y;
          // Another shape is blocking the drop, we cannot drop it furter
          if (shapeIsBlockingDrop) {
            return false;
          }
        }
      }
    }

    return true;
  };

  drop = () => {
    // Translate all points by dropDistance
    for (let point of this.points) {
      point.y -= 1;
    }
  };
}

const findHighestRock = (shapes: Array<Shape>) => {
  return shapes
    .flatMap((shape) => shape.points.map((point) => point.y))
    .reduce((curr, highest) => (curr > highest ? curr : highest), -1);
};

const spawnShape = (
  currentStack: Array<Shape>,
  definition: ShapeDefinition
) => {
  const leftOffset = 2;
  const topOffset = 4;
  const currentHighestRock = findHighestRock(currentStack);

  return new Shape(
    {
      x: leftOffset,
      y: currentHighestRock + topOffset,
    },
    definition
  );
};

fs.readFile("in.txt", "utf8", async (err, data) => {
  const jetPattern: Array<JetDirection> = data.split("") as Array<JetDirection>;

  const shapeSequence = [
    hLineShape,
    plusShape,
    LShape,
    vLineShape,
    squareShape,
  ];
  const droppedShapes: Array<Shape> = [];

  const maxRocks = 2022;
  let jetIndex = 0;

  for (let rock = 0; rock < maxRocks; rock++) {
    if (rock % 1000 === 0) console.log(rock, (rock / maxRocks) * 100 + "%");
    const shapeToDrop = shapeSequence[rock % shapeSequence.length];

    const newShape = spawnShape(droppedShapes, shapeToDrop);
    // console.log("Spawned shape", rock);
    // console.log(draw([...droppedShapes, newShape]));
    // console.log("----------------------");
    let isResting = false;
    while (!isResting) {
      const currentJet = jetPattern[jetIndex % jetPattern.length];
      newShape.applyJet(currentJet, droppedShapes);
      jetIndex++;
      // console.log("Pushed shape", currentJet);
      // console.log(draw([...droppedShapes, newShape]));
      // console.log("----------------------");
      isResting = !newShape.canDrop(droppedShapes);
      if (!isResting) {
        newShape.drop();
        // console.log("Dropped shape");
        // console.log(draw([...droppedShapes, newShape]));
        // console.log("----------------------");
      }
    }
    droppedShapes.push(newShape);
  }
  console.log(draw(droppedShapes));
  // console.log(droppedShapes.map((shape) => shape.points));
  const top = findHighestRock(droppedShapes) + 1; // We add 1 because we start at y = 0
  console.log(top, top === 3127);
});
