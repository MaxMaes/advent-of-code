import fs from "fs";

type Register = {
  x: number;
};

class CPU {
  register: Register = {
    x: 1,
  };

  currentInstruction?: Instruction;
  queue: Array<Instruction> = [];
  cycle: number = 0;

  screen: Array<Array<string>> = [];
  currentRow: Array<string>;

  scheduleInstruction(instruction: Instruction) {
    this.queue.push(instruction);
  }

  tick() {
    const completed = this.currentInstruction.tick(this.register);
    if (completed) {
      this.currentInstruction = this.queue.shift();
    }
  }

  run() {
    this.currentInstruction = this.queue.shift();
    while (this.currentInstruction !== undefined) {
      this.cycle++;
      const crtPosition = this.cycle - 1;
      if (crtPosition % 40 === 0) {
        const newRow = [];
        this.currentRow = newRow;
        this.screen.push(newRow);
      }

      if (
        crtPosition % 40 <= this.register.x + 1 &&
        crtPosition % 40 >= this.register.x - 1
      ) {
        this.currentRow.push("#");
      } else {
        this.currentRow.push(".");
      }
      this.tick();
    }
  }
}

interface Instruction {
  tick(register: Register): boolean;
}

class AddX implements Instruction {
  private _progressTicks = 0;
  private _instructionTicks = 2;

  constructor(private amount: number) {}

  tick(register: Register) {
    this._progressTicks++;

    if (this._progressTicks === this._instructionTicks) {
      register.x += this.amount;
    }
    return this._progressTicks === this._instructionTicks;
  }
}

/**
 * Doesn't do anything
 */
class Noop implements Instruction {
  tick(register: Register) {
    return true;
  }
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");
  const cpu = new CPU();

  for (let line of lines) {
    const splitted = line.split(" ");
    if (splitted[0] === "noop") {
      cpu.scheduleInstruction(new Noop());
    } else if (splitted[0] === "addx") {
      cpu.scheduleInstruction(new AddX(parseInt(splitted[1])));
    }
  }

  cpu.run();

  console.log(cpu.screen.map((row) => row.join("")));
});
