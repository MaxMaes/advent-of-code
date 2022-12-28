import fs from "fs";

function mapPointForChoice(input: string) {
  if (input === "A") {
    return 1;
  } else if (input === "B") {
    return 2;
  } else if (input === "C") {
    return 3;
  } else throw Error("invalid input");
}

fs.readFile("in.txt", "utf8", (err, data) => {
  const inputPerRound = data.split("\n");
  const pointsPerRound = inputPerRound.map((roundText) => {
    const round = roundText.split(" ");
    const opponnent = mapPointForChoice(round[0]);
    const desiredOutcome = round[1];

    let me = -1;
    if (desiredOutcome === "Y") {
      // Draw
      me = opponnent;
    } else if (desiredOutcome === "X") {
      // Lose
      me = opponnent - 1;
      if (me === 0) {
        me = 3;
      }
    } else if (desiredOutcome === "Z") {
      // Win
      me = Math.max(1, (opponnent + 1) % 4);
    }
    return [opponnent, me];
  });

  const results = pointsPerRound.map((round) => {
    const opponnent = round[0];
    const me = round[1];

    if (opponnent === me) {
      return ["draw", 3 + me];
    }
    if (me - 1 === opponnent % 3) {
      // Rock = 1, beats 3
      // Paper = 2, beats 1
      // Scizzors = 3, beats 2
      //
      return ["win", 6 + me];
    }
    return ["loss", me];
  });

  const totalScore = results
    .map((result) => Number(result[1]))
    .reduce((a, b) => a + b);

  console.log(totalScore);
});
