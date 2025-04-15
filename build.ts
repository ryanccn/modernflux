import { initCompiler } from "sass";
import { transform } from "lightningcss";
import pc from "picocolors";

import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

await rm("dist", { recursive: true, force: true });
await mkdir("dist");

const constants = {
  catppuccin: {
    variants: ["latte", "frappe", "macchiato", "mocha"],
    accents: [
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
    ],
  },

  flexoki: {
    variants: ["light", "dark"],
    accents: ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "magenta"],
  },
} as const;

const ctpTemplate = ({ variant, accent }: { variant: string; accent: string }) =>
  `
@use "themes/catppuccin/${variant}" as ctp;

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
@use "themes/flexoki/${variant}" as flexoki;

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

const sassCompiler = initCompiler();

const minify = (css: string) => {
  return transform({
    code: new TextEncoder().encode(css),
    filename: "_.css",
    minify: true,
  }).code;
};

const sizeFormat = Intl.NumberFormat("en-US", {
  style: "unit",
  notation: "compact",
  unit: "byte",
  unitDisplay: "narrow",
  maximumFractionDigits: 2,
});

const writeFileWithLog = async (path: string, data: string | Uint8Array) => {
  await writeFile(path, data);

  const byteLength = typeof data === "string" ? new TextEncoder().encode(data).byteLength : data.byteLength;
  console.error(
    `${pc.cyan(
      path
        .replace(/^dist\//, "")
        .padEnd(45)
        .replace(/\.css(?=\b)/, pc.dim(".css"))
    )} ${sizeFormat.format(byteLength)}`
  );
};

const { css: baseCSS } = sassCompiler.compile("src/base.scss");
await writeFileWithLog(join("dist", "base.css"), baseCSS);
await writeFileWithLog(join("dist", "base.min.css"), minify(baseCSS));

for (const variant of constants.catppuccin.variants) {
  for (const accent of constants.catppuccin.accents) {
    const dest = join("dist", "catppuccin", variant);
    await mkdir(dest, { recursive: true });

    const { css } = sassCompiler.compileString(ctpTemplate({ variant, accent }), {
      loadPaths: ["src"],
    });

    await writeFileWithLog(join(dest, `${accent}.css`), css);
    await writeFileWithLog(join(dest, `${accent}.min.css`), minify(css));
  }
}

for (const variant of constants.flexoki.variants) {
  for (const accent of constants.flexoki.accents) {
    const dest = join("dist", "flexoki", variant);
    await mkdir(dest, { recursive: true });

    const { css } = sassCompiler.compileString(flexokiTemplate({ variant, accent }), {
      loadPaths: ["src"],
    });

    await writeFileWithLog(join(dest, `${accent}.css`), css);
    await writeFileWithLog(join(dest, `${accent}.min.css`), minify(css));
  }
}

await cp("public", "dist", { recursive: true });
