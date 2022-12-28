import fs from "fs";

fs.readFile("in.txt", "utf8", (err, data) => {
  const groupedByElf = data.split("\n").reduce<Array<Array<number>>>(
    (accumulator, value) => {
      if (value === "") {
        return [...accumulator, []];
      } else {
        accumulator[accumulator.length - 1].push(parseInt(value));
        return [...accumulator];
      }
    },
    [[]]
  );
  const totalByElf = groupedByElf.flatMap((elf) => elf.reduce((a, b) => a + b));
  const sortedDescending = totalByElf.sort((a, b) => b - a);
  const totalHighest3 =
    sortedDescending[0] + sortedDescending[1] + sortedDescending[2];
  console.log(sortedDescending[0], totalHighest3);
});
