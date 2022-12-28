import fs from "fs";

type MonkeyBuilder = Partial<Monkey>;
type Monkey = {
  items: Array<number>;
  operation: string;
  testValue: number;
  tests: { true: number; false: number };
  inspectionCount: number;
};

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");

  let monkeyUnderContruction: MonkeyBuilder = {};
  const monkeys: Array<Monkey> = [];
  lines.forEach((line) => {
    if (line.startsWith("Monkey")) {
      monkeyUnderContruction = {
        inspectionCount: 0,
        items: [],
        tests: { true: -1, false: -1 },
      };
      monkeys.push(monkeyUnderContruction as Monkey);
    }
    if (line.includes("Starting items:")) {
      const items = line.replace(/\s/g, "").split(":")[1].split(",");
      monkeyUnderContruction.items = items.map((item) => parseInt(item));
    }
    if (line.includes("Operation:")) {
      const operation = line.replaceAll(" ", "").split(":")[1];
      monkeyUnderContruction.operation = operation.replace("new=", "");
    }
    if (line.includes("Test:")) {
      const tests = line
        .replace(/\s/g, "")
        .split(":")[1]
        .split("divisibleby")[1];
      monkeyUnderContruction.testValue = parseInt(tests);
    }
    if (line.includes("If true")) {
      const targetMonkey = line.charAt(line.length - 1);
      monkeyUnderContruction.tests.true = parseInt(targetMonkey);
    }
    if (line.includes("If false")) {
      const targetMonkey = line.charAt(line.length - 1);
      monkeyUnderContruction.tests.false = parseInt(targetMonkey);
    }
    if (line === "") {
      // Empty separator indicates monkey complete, cast to monkey
      //monkeys.push(monkeyUnderContruction as Monkey);
    }
  });

  const rounds = 20;
  for (let round = 0; round < rounds; round++) {
    for (let monkey of monkeys) {
      while (monkey.items.length > 0) {
        const inspectionItem = monkey.items.shift();
        // Replace 'old' in operation with 'inspectionItem'
        if (inspectionItem) {
          monkey.inspectionCount++;
          const operation = monkey.operation.replaceAll(
            "old",
            `${inspectionItem}`
          );
          const afterInspection = eval(operation) as number;
          const afterWorryLowered = Math.floor(afterInspection / 3);
          const isDivisible = afterWorryLowered % monkey.testValue === 0;
          let targetMonkey;
          if (isDivisible) {
            targetMonkey = monkey.tests.true;
          } else {
            targetMonkey = monkey.tests.false;
          }

          monkeys[targetMonkey].items.push(afterWorryLowered);
        }
      }
    }
  }
  const sortedMonkeys = monkeys.sort(
    (a, b) => b.inspectionCount - a.inspectionCount
  );
  console.log(sortedMonkeys.map((x) => x.inspectionCount));
  console.log(
    sortedMonkeys[0].inspectionCount * sortedMonkeys[1].inspectionCount
  );
});
