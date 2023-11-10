import { writeFile } from "fs/promises";

const flavors = ["latte", "frappe", "macchiato", "mocha"];
const accents = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
];

const template = ({ flavor, accent }: { flavor: string; accent: string }) =>
  `
@use "catppuccin/${flavor}" as *;

$accent: $${accent};
@import "global";
`.trimStart();

for (const flavor of flavors) {
  for (const accent of accents) {
    await writeFile(
      `src/modernflux.${flavor}.${accent}.scss`,
      template({ flavor, accent })
    );
  }
}
