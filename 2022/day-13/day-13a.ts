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
  const dataPairs = data.split("\n\n");

  let sum = 0;
  const results = dataPairs.map((pair, idx) => {
    const splitted = pair.split("\n");
    const line1 = eval(splitted[0]) as Packet;
    const line2 = eval(splitted[1]) as Packet;

    console.log(`== Pair ${idx + 1} ==`);
    // console.log("Compare", line1, "vs", line2);
    if (compareArray(line1, line2) === 1) {
      console.log("VALID");
      sum += idx + 1;
    } else {
      console.log("INVALID");
    }
  });
  console.log(sum);
});
