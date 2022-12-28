import fs from "fs";
import getCharValue from "./getCharValue";

fs.readFile("in.txt", "utf8", (err, data) => {
  const inputPerBag = data.split("\n");
  const grouped: Array<Array<string>> = [];
  for (var idx = 0, groupIdx = 0; idx < inputPerBag.length; idx++) {
    if (idx >= 3 && idx % 3 === 0) {
      groupIdx++;
    }
    grouped[groupIdx] = grouped[groupIdx] || [];
    grouped[groupIdx].push(inputPerBag[idx]);
  }

  // Find duplicates per line
  const duplicates = grouped.map((bags) => {
    const bag = bags[0];
    for (const char of bag) {
      if (bags[1].indexOf(char) > -1 && bags[2].indexOf(char) > -1) {
        // Char is in both left and right set
        // Since there is only one duplicate in each set, return it
        return char;
      }
    }
    throw Error(bags.toString());
  });

  const values = duplicates.map((char) => getCharValue(char));
  const total = values.reduce((a, b) => a + b);
  console.log(total);
});
