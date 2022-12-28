import fs from "fs";

type Packet = Array<number | Packet>;

function compareArray(a: Packet, b: Packet) {
  let isValid = 0;
  console.log("Compare", a, "vs", b);
  for (let testIdx = 0; testIdx < Math.max(a.length, b.length); testIdx++) {
    const leftVal = a[testIdx];
    const rightVal = b[testIdx];

    if (Number.isInteger(leftVal) && Number.isInteger(rightVal)) {
      console.log("Compare", leftVal, "vs", rightVal);
      if (leftVal < rightVal) {
        isValid = 1;
      }
      if (leftVal > rightVal) {
        isValid = -1;
      }
    }
    if (Array.isArray(leftVal) && Number.isInteger(rightVal)) {
      console.log("Mixed types, convert right and retry");
      isValid = compareArray(leftVal, [rightVal]);
    }
    if (Number.isInteger(leftVal) && Array.isArray(rightVal)) {
      console.log("Mixed types, convert left and retry");
      isValid = compareArray([leftVal], rightVal);
    }
    if (Array.isArray(leftVal) && Array.isArray(rightVal)) {
      isValid = compareArray(leftVal, rightVal);
    }
    if (leftVal === undefined) {
      console.log(
        "Left side ran out of items, so inputs are in the right order"
      );
      isValid = 1;
    }
    if (rightVal === undefined) {
      console.log(
        "Right side ran out of items, so inputs are not in the right order"
      );
      isValid = -1;
    }
    if (isValid !== 0) {
      return isValid;
    }
  }
  return isValid;
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const packets = data
    .replace("\n\n", "\n")
    .split("\n")
    .map((x) => eval(x) as Packet);
  const divider1 = [[2]];
  const divider2 = [[6]];
  packets.push(divider1, divider2);
  const sortedPackets = packets.sort((a, b) => -compareArray(a, b));
  const index1 = sortedPackets.indexOf(divider1) + 1;
  const index2 = sortedPackets.indexOf(divider2) + 1;
  console.log(index1 * index2);
});
