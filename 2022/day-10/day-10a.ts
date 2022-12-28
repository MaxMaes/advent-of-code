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

  scheduleInstruction(instruction: Instruction) {
    this.queue.push(instruction);
  }

  tick() {
    const completed = this.currentInstruction.tick(this.register);
    if (completed) {
      this.currentInstruction = this.queue.shift();
    }
  }

  sumHolder = 0;
  run() {
    this.currentInstruction = this.queue.shift();
    while (this.currentInstruction !== undefined) {
      this.cycle++;
      if (this.cycle === 20 || (this.cycle - 20) % 40 === 0) {
        this.sumHolder += this.cycle * this.register.x;
        console.log(this.cycle, this.register.x, this.cycle * this.register.x);
        console.log(this.sumHolder);
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

  console.log(cpu.register);
});
