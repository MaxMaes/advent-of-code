import fs from "fs";

function absDiff(a: number, b: number) {
  return Math.abs(a - b);
}

type Direction = "U" | "D" | "L" | "R";

type Position = {
  x: number;
  y: number;
};

class Segment {
  position: Position = { x: 0, y: 0 };
  tail?: Segment;
  pullHistory: Array<Position> = [{ x: 0, y: 0 }];

  private __determinePullDirection = (
    pullerPosition: Position
  ): [Direction, Direction] => {
    console.log(this.position, pullerPosition);
    let verticalPull: Direction;
    let horizontalPull: Direction;
    if (absDiff(this.position.x, pullerPosition.x) > 1) {
      // Pull horizontally
      if (this.position.x > pullerPosition.x) {
        horizontalPull = "L";
      } else if (this.position.x < pullerPosition.x) {
        horizontalPull = "R";
      }
    }
    if (absDiff(this.position.y, pullerPosition.y) > 1) {
      // Pull vertically
      if (this.position.y > pullerPosition.y) {
        verticalPull = "D";
      } else if (this.position.y < pullerPosition.y) {
        verticalPull = "U";
      }
    }
    return [horizontalPull, verticalPull];
  };

  pull = (pullerPosition: Position) => {
    const direction = this.__determinePullDirection(pullerPosition);
    console.log(direction);
    if (direction[0] !== undefined) {
      this.pullHorizontalTo(pullerPosition);
    }
    if (direction[1] !== undefined) {
      this.pullVerticalTo(pullerPosition, direction[1]);
    }
    console.log(this.position);
    this.pullHistory.push({ ...this.position });

    if (this.tail !== undefined) {
      this.tail.pull(this.position);
    }
  };

  pullVerticalTo = (pullerPosition: Position, direction: Direction) => {
    if (
      this.position.x !== pullerPosition.x &&
      absDiff(this.position.y, pullerPosition.y) > 1
    ) {
      // Diagonal move
      this.position.x = pullerPosition.x;
    }
    if (absDiff(this.position.y, pullerPosition.y) > 1) {
      // this.position.y = this.position.y - pullerPosition.y;
      if (this.position.y > pullerPosition.y) {
        this.position.y--;
      } else {
        this.position.y++;
      }
    }
  };

  pullHorizontalTo = (pullerPosition: Position) => {
    if (
      this.position.y !== pullerPosition.y &&
      absDiff(this.position.x, pullerPosition.x) > 1
    ) {
      // Diagonal move
      this.position.y = pullerPosition.y;
    }
    if (absDiff(this.position.x, pullerPosition.x) > 1) {
      // this.position.x = this.position.x - pullerPosition.x;
      if (this.position.x > pullerPosition.x) {
        this.position.x--;
      } else {
        this.position.x++;
      }
    }
  };

  moveUp = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      console.log("U ITERATION START");
      this.position.y++;
      if (this.tail !== undefined) {
        this.tail.pull(this.position);
      }
    }
  };

  moveDown = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      console.log("D ITERATION START");
      this.position.y--;
      if (this.tail !== undefined) {
        this.tail.pull(this.position);
      }
    }
  };

  moveLeft = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      console.log("L ITERATION START");
      this.position.x--;
      if (this.tail !== undefined) {
        this.tail.pull(this.position);
      }
    }
  };

  moveRight = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      console.log("R ITERATION START");
      this.position.x++;
      if (this.tail !== undefined) {
        this.tail.pull(this.position);
      }
    }
  };
}

class Rope {
  segments: Array<Segment> = [];

  constructor(segmentsCount: number) {
    while (this.segments.length !== segmentsCount) {
      const newSegment = new Segment();
      const previousIndex = this.segments.length - 1;
      const previous = this.segments[previousIndex];
      if (previous !== undefined) {
        previous.tail = newSegment;
      }
      this.segments.push(newSegment);
    }
  }

  moveUp = (amount: number) => {
    this.segments[0].moveUp(amount);
  };

  moveDown = (amount: number) => {
    this.segments[0].moveDown(amount);
  };

  moveLeft = (amount: number) => {
    this.segments[0].moveLeft(amount);
  };

  moveRight = (amount: number) => {
    this.segments[0].moveRight(amount);
  };
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");
  const rope = new Rope(10);

  lines.forEach((line) => {
    const instruction = line.split(" ");
    const direction = instruction[0];
    const amount = parseInt(instruction[1]);
    if (direction === "R") {
      // Right
      rope.moveRight(amount);
    } else if (direction === "L") {
      // Left
      rope.moveLeft(amount);
    } else if (direction === "D") {
      // Down
      rope.moveDown(amount);
    } else if (direction === "U") {
      // Up
      rope.moveUp(amount);
    }
  });
  const lastElement = rope.segments[rope.segments.length - 1];
  console.log(
    lastElement.pullHistory.filter(
      (coord, index, array) =>
        array.findIndex((xd) => xd.x === coord.x && xd.y === coord.y) === index
    ).length
  );

  console.log(rope.segments.map((x) => x.position));
});
