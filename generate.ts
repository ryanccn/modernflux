import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const ctpFlavors = ["latte", "frappe", "macchiato", "mocha"];
const ctpAccents = [
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

const flexokiVariants = ["light", "dark"];
const flexokiAccents = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "magenta"];

const ctpTemplate = ({ flavor, accent }: { flavor: string; accent: string }) =>
  `
@use "../../themes/catppuccin/${flavor}" as ctp;

:root {
  --modernflux-color-scheme: #{ctp.$color-scheme};

  --modernflux-fg0: #{ctp.$text};
  --modernflux-fg1: #{ctp.$subtext0};
  --modernflux-fg2: #{ctp.$subtext1};

  --modernflux-bg0: #{ctp.$base};
  --modernflux-bg1: #{ctp.$surface0};
  --modernflux-bg2: #{ctp.$surface1};

  --modernflux-accent: #{ctp.$${accent}};
  --modernflux-success: #{ctp.$green};
  --modernflux-danger: #{ctp.$red};
}
`.trimStart();

const flexokiTemplate = ({ variant, accent }: { variant: string; accent: string }) =>
  `
@use "../../themes/flexoki/${variant}" as flexoki;

:root {
  --modernflux-color-scheme: #{flexoki.$color-scheme};

  --modernflux-fg0: #{flexoki.$tx};
  --modernflux-fg1: #{flexoki.$tx-2};
  --modernflux-fg2: #{flexoki.$tx-3};

  --modernflux-bg0: #{flexoki.$bg};
  --modernflux-bg1: #{flexoki.$bg-2};
  --modernflux-bg2: #{flexoki.$ui};

  --modernflux-accent: #{flexoki.$${accent}};
  --modernflux-success: #{flexoki.$green};
  --modernflux-danger: #{flexoki.$red};
}
`.trimStart();

for (const flavor of ctpFlavors) {
  for (const accent of ctpAccents) {
    const path = `src/catppuccin/${flavor}/${accent}.scss`;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, ctpTemplate({ flavor, accent }));
  }
}

for (const variant of flexokiVariants) {
  for (const accent of flexokiAccents) {
    const path = `src/flexoki/${variant}/${accent}.scss`;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, flexokiTemplate({ variant, accent }));
  }
}
