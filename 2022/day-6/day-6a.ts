import fs from "fs";

fs.readFile("in.txt", "utf8", (err, data) => {
  const windowSize = 4;
  for (var windowIndex = 0; windowIndex < data.length; windowIndex++) {
    const chars = data.slice(windowIndex, windowIndex + windowSize).split("");
    if (chars.every((char, index, arr) => arr.indexOf(char) === index)) {
      console.log(chars, windowIndex + windowSize);
      break;
    }
  }
});
