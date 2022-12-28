import fs from "fs";

const moveOneByOne = (
  amount: number,
  source: Array<string>,
  target: Array<string>
) => {
  for (var popped = 0; popped < amount; popped++) {
    target.push(source.pop());
  }
};

fs.readFile("in.txt", "utf8", (err, data) => {
  const splittedInput = data.split("\n\n");

  const containersInput = splittedInput[0];
  const commandsInput = splittedInput[1];

  // Array with 3 ints [0] = amount to take, [1] = source, [2] = target
  const commands = commandsInput.split("\n").map((commandLine) =>
    commandLine
      .split(" ")
      .map((input) => parseInt(input))
      .filter((input) => Number.isInteger(input))
  );

  const containersPerLine = containersInput.split("\n");
  const stacks: Array<Array<string>> = [];

  for (var lineIdx = 0; lineIdx < containersPerLine.length; lineIdx++) {
    const line = containersPerLine[lineIdx];
    for (var stackIdx = 0; stackIdx * 4 <= line.length; stackIdx++) {
      const containerInput = line.substring(stackIdx * 4, stackIdx * 4 + 4);
      if (containerInput.includes("[")) {
        const container = containerInput[1];
        stacks[stackIdx] = stacks[stackIdx] ?? [];
        stacks[stackIdx] = [container, ...stacks[stackIdx]];
      }
    }
  }

  for (const [amount, sourceIdx, targetIdx] of commands) {
    moveOneByOne(amount, stacks[sourceIdx - 1], stacks[targetIdx - 1]);
  }

  const lastElements = stacks.map((stack) => stack[stack.length - 1]);
  console.log(lastElements.join(""));
});
