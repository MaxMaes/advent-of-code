import fs from "fs";

fs.readFile("in.txt", "utf8", (err, data) => {
  const inputPerLine = data.split("\n");

  const scores: Array<number> = inputPerLine.map((line) => {
    const pair = line.split(",");
    const rangeAIn = pair[0].split("-").map((x) => parseInt(x));
    const rangeBIn = pair[1].split("-").map((x) => parseInt(x));

    if (rangeAIn[0] <= rangeBIn[0] && rangeAIn[1] >= rangeBIn[1]) {
      // B fully in A
      console.log("B in A", rangeAIn, rangeBIn);
      return 1;
    }
    if (rangeAIn[0] >= rangeBIn[0] && rangeAIn[1] <= rangeBIn[1]) {
      // B fully in A
      console.log("A in B", rangeAIn, rangeBIn);
      return 1;
    }
    return 0;
  });

  const total = scores.reduce((a, b) => a + b);
  console.log(total);
});
