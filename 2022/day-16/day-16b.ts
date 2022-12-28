import fs from "fs";

type Valve = {
  name: string;
  flowRate: number;
  routes: Array<string>;
};

fs.readFile("in.txt", "utf8", (err, data) => {
  const lines = data.split("\n");

  const valves: Array<Valve> = lines.map((line) => {
    const valveName = line.substring(6, 8);
    const rate = line.match(/rate=(\d+)/)[1];
    const isPlural = line.includes("valves");
    let routes = "";
    if (isPlural) {
      routes = line.substring(
        line.indexOf("to valves") + "to valves".length,
        line.length
      );
    } else {
      routes = line.substring(
        line.indexOf("to valve") + "to valve".length,
        line.length
      );
    }
    const exits = routes.replaceAll(" ", "").split(",");
    return {
      name: valveName,
      flowRate: parseInt(rate),
      routes: exits,
    };
  });

  console.log(valves);
});
