import fs from "fs";
import getCharValue from "./getCharValue";

fs.readFile("in.txt", "utf8", (err, data) => {
  const inputPerBag = data.split("\n");

  // Find duplicates per line
  const splitInHalfPerBag = inputPerBag.map((line) => [
    line.slice(0, line.length / 2),
    line.slice(line.length / 2, line.length),
  ]);

  const duplicates = splitInHalfPerBag.map((bag) => {
    const left = bag[0];
    const right = bag[1];
    for (const char of left) {
      if (right.indexOf(char) > -1) {
        // Char is in both left and right set
        // Since there is only one duplicate in each set, return it
        return char;
      }
    }
    throw Error("No dupelicate found");
  });

  const values = duplicates.map((char) => getCharValue(char));
  const total = values.reduce((a, b) => a + b);
  console.log(total);
});
