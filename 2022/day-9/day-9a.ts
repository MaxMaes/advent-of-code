import fs from "fs";

function absDiff(a: number, b: number) {
  return Math.abs(a - b);
}

class Rope {
  head = { x: 0, y: 0 };
  tail = { x: 0, y: 0 };

  tailHistory: Array<{ x: number; y: number }> = [{ x: 0, y: 0 }];

  constructor() {}

  moveUp = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      this.head.y++;
      let tailMoved = false;
      if (this.tail.x != this.head.x && absDiff(this.tail.y, this.head.y) > 1) {
        this.tail.x = this.head.x;
        tailMoved = true;
      }
      if (absDiff(this.tail.y, this.head.y) > 1) {
        this.tail.y++;
        tailMoved = true;
      }
      if (tailMoved) {
        this.tailHistory.push({ ...this.tail });
      }
    }
  };

  moveDown = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      this.head.y--;
      let tailMoved = false;
      if (this.tail.x != this.head.x && absDiff(this.tail.y, this.head.y) > 1) {
        this.tail.x = this.head.x;
        tailMoved = true;
      }
      if (absDiff(this.tail.y, this.head.y) > 1) {
        this.tail.y--;
        tailMoved = true;
      }
      if (tailMoved) {
        this.tailHistory.push({ ...this.tail });
      }
    }
  };

  moveLeft = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      this.head.x--;
      let tailMoved = false;
      if (this.tail.y != this.head.y && absDiff(this.tail.x, this.head.x) > 1) {
        this.tail.y = this.head.y;
        tailMoved = true;
      }
      if (absDiff(this.tail.x, this.head.x) > 1) {
        this.tail.x--;
        tailMoved = true;
      }
      if (tailMoved) {
        this.tailHistory.push({ ...this.tail });
      }
    }
  };

  moveRight = (amount: number) => {
    for (let idx = 0; idx < amount; idx++) {
      this.head.x++;

      let tailMoved = false;
      if (this.tail.y != this.head.y && absDiff(this.tail.x, this.head.x) > 1) {
        this.tail.y = this.head.y;
        tailMoved = true;
      }
      if (absDiff(this.tail.x, this.head.x) > 1) {
        this.tail.x++;
        tailMoved = true;
      }
      if (tailMoved) {
        this.tailHistory.push({ ...this.tail });
      }
    }
  };
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");
  const rope = new Rope();

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
  console.log(rope.tailHistory);
  console.log(
    rope.tailHistory.filter(
      (coord, index, array) =>
        array.findIndex((xd) => xd.x === coord.x && xd.y === coord.y) === index
    ).length
  );
});
