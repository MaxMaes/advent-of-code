import fs from "fs";
import { shiftElementBy } from "./array-ops";

class RingBuffer<T> {
  buffer: Array<T>;
  readSequence: number = 0;
  writeSequence: number = 0;

  constructor(capacity: number) {
    this.buffer = new Array(capacity);
    this.readSequence = 0;
    this.writeSequence = -1;
  }

  /**
   * Adds item to buffer at last position, grows buffer if needed.
   * @param item
   */
  put = (item: T) => {
    this.buffer.push(item);
  };
}

fs.readFile("in.txt", "utf8", async (err, data) => {
  const decreptionKey = 811589153;
  const lines = data
    .split("\n")
    .map((input, index) => ({
      val: parseInt(input) * decreptionKey,
      idx: index,
    }));

  const copy = [...lines];
  for (let idx = 0; idx < copy.length; idx++) {
    const idxInCurrentState = lines.indexOf(copy[idx]);
    const processingValue = lines[idxInCurrentState];
    console.log("processing", processingValue);

    shiftElementBy(lines, idxInCurrentState, processingValue.val);
    // console.log(lines);
  }
  // console.log(lines.join(", ") === "1, 2, -3, 4, 0, 3, -2");
  const zeroIndex = lines.findIndex((x) => x.val === 0);
  const searchIndexes = [1000, 2000, 3000].map((idx) => idx + zeroIndex);
  const foundValues = searchIndexes.map(
    (searchIndex) => lines[searchIndex % lines.length]
  );
  const total = foundValues.reduce((a, b) => a + b.val, 0);
  console.log(total);
});
