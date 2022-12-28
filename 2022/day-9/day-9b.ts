import fs from "fs";

type Direction = "U" | "D" | "L" | "R";

type Position = {
  x: number;
  y: number;
};

class RopeSegment {
  position: Position = { x: 0, y: 0 };
  history: Array<Position> = [{ x: 0, y: 0 }];

  applyDelta = (delta: Position) => {
    this.position.x += delta.x;
    this.position.y += delta.y;
  };

  applyDrag = (parent: RopeSegment) => {
    let parentPos = parent.position;
    let thisPos = this.position;
    if (Math.abs(parentPos.x - thisPos.x) >= 2) {
      if (parentPos.x > thisPos.x) {
        thisPos.x++;
      } else {
        thisPos.x--;
      }
      if (parentPos.y > thisPos.y) {
        thisPos.y++;
      } else if (parentPos.y < thisPos.y) {
        thisPos.y--;
      }
    } else if (Math.abs(parentPos.y - thisPos.y) >= 2) {
      if (parentPos.x > thisPos.x) {
        thisPos.x++;
      } else if (parentPos.x < thisPos.x) {
        thisPos.x--;
      }
      if (parentPos.y > thisPos.y) {
        thisPos.y++;
      } else {
        thisPos.y--;
      }
    }
    this.history.push({ ...this.position });
  };
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");

  const deltas = {
    D: { x: 0, y: -1 },
    U: { x: 0, y: 1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 },
  };

  const segments: Array<RopeSegment> = [];
  for (let idx = 0; idx < 10; idx++) {
    segments.push(new RopeSegment());
  }

  const leadingSegment = segments[0];

  for (let line of lines) {
    const instruction = line.split(" ");
    const direction = instruction[0];
    const amount = parseInt(instruction[1]);
    for (let idx = 0; idx < amount; idx++) {
      leadingSegment.applyDelta(deltas[direction]);

      for (let chaseIdx = 1; chaseIdx < segments.length; chaseIdx++) {
        const prev = segments[chaseIdx - 1];
        const current = segments[chaseIdx];
        current.applyDrag(prev);
      }
    }
  }
  const lastElement = segments[segments.length - 1];
  console.log(
    lastElement.history.filter(
      (coord, index, array) =>
        array.findIndex((xd) => xd.x === coord.x && xd.y === coord.y) === index
    ).length
  );
});
