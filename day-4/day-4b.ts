import fs from "fs";

const isValueInRange = (valueToTest: number, start: number, end: number) =>
  valueToTest >= start && valueToTest <= end;

fs.readFile("in.txt", "utf8", (err, data) => {
  const inputPerLine = data.split("\n");

  const scores: Array<number> = inputPerLine.map((line) => {
    const pair = line.split(",");
    const rangeAIn = pair[0].split("-").map((x) => parseInt(x));
    const rangeBIn = pair[1].split("-").map((x) => parseInt(x));

    if (isValueInRange(rangeAIn[0], rangeBIn[0], rangeBIn[1])) {
      // A start in B
      return 1;
    }
    if (isValueInRange(rangeAIn[1], rangeBIn[0], rangeBIn[1])) {
      // A end in B
      return 1;
    }
    if (isValueInRange(rangeBIn[0], rangeAIn[0], rangeAIn[1])) {
      // B start in A
      return 1;
    }
    if (isValueInRange(rangeBIn[1], rangeAIn[0], rangeAIn[1])) {
      // B end in A
      return 1;
    }
    return 0;
  });

  const total = scores.reduce((a, b) => a + b);
  console.log(total);
});
