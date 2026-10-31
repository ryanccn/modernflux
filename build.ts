// SPDX-FileCopyrightText: 2025 Ryan Cao <hello@ryanccn.dev>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { initCompiler } from "sass";
import { transform } from "lightningcss";
import pc from "picocolors";

import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

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
@use "themes/catppuccin/${variant}" as theme;

:root {
  --modernflux-fg0: #{theme.$text};
  --modernflux-fg1: #{theme.$subtext0};
  --modernflux-fg2: #{theme.$subtext1};

  --modernflux-bg0: #{theme.$base};
  --modernflux-bg1: #{theme.$surface0};
  --modernflux-bg2: #{theme.$surface1};

  --modernflux-accent: #{theme.$${accent}};
  --modernflux-success: #{theme.$green};
  --modernflux-danger: #{theme.$red};
}
`.trimStart();

const ctpLightDarkTemplate = ({
  variantLight,
  variantDark,
  accent,
}: {
  variantLight: string;
  variantDark: string;
  accent: string;
}) =>
  `
@use "themes/catppuccin/${variantLight}" as theme-light;
@use "themes/catppuccin/${variantDark}" as theme-dark;

:root {
  --modernflux-fg0: light-dark(#{theme-light.$text}, #{theme-dark.$text});
  --modernflux-fg1: light-dark(#{theme-light.$subtext0}, #{theme-dark.$subtext0});
  --modernflux-fg2: light-dark(#{theme-light.$subtext1}, #{theme-dark.$subtext1});

  --modernflux-bg0: light-dark(#{theme-light.$base}, #{theme-dark.$base});
  --modernflux-bg1: light-dark(#{theme-light.$surface0}, #{theme-dark.$surface0});
  --modernflux-bg2: light-dark(#{theme-light.$surface1}, #{theme-dark.$surface1});

  --modernflux-accent: light-dark(#{theme-light.$${accent}}, #{theme-dark.$${accent}});
  --modernflux-success: light-dark(#{theme-light.$green}, #{theme-dark.$green});
  --modernflux-danger: light-dark(#{theme-light.$red}, #{theme-dark.$red});
}
`.trimStart();

const flexokiTemplate = ({ variant, accent }: { variant: string; accent: string }) =>
  `
@use "themes/flexoki/${variant}" as theme;

:root {
  --modernflux-fg0: #{theme.$tx};
  --modernflux-fg1: #{theme.$tx-2};
  --modernflux-fg2: #{theme.$tx-3};

  --modernflux-bg0: #{theme.$bg};
  --modernflux-bg1: #{theme.$bg-2};
  --modernflux-bg2: #{theme.$ui};

  --modernflux-accent: #{theme.$${accent}};
  --modernflux-success: #{theme.$green};
  --modernflux-danger: #{theme.$red};
}
`.trimStart();

const flexokiLightDarkTemplate = ({
  variantLight,
  variantDark,
  accent,
}: {
  variantLight: string;
  variantDark: string;
  accent: string;
}) =>
  `
@use "themes/flexoki/${variantLight}" as theme-light;
@use "themes/flexoki/${variantDark}" as theme-dark;

:root {
  --modernflux-fg0: light-dark(#{theme-light.$tx}, #{theme-dark.$tx});
  --modernflux-fg1: light-dark(#{theme-light.$tx-2}, #{theme-dark.$tx-2});
  --modernflux-fg2: light-dark(#{theme-light.$tx-3}, #{theme-dark.$tx-3});

  --modernflux-bg0: light-dark(#{theme-light.$bg}, #{theme-dark.$bg});
  --modernflux-bg1: light-dark(#{theme-light.$bg-2}, #{theme-dark.$bg-2});
  --modernflux-bg2: light-dark(#{theme-light.$ui}, #{theme-dark.$ui});

  --modernflux-accent: light-dark(#{theme-light.$${accent}}, #{theme-dark.$${accent}});
  --modernflux-success: light-dark(#{theme-light.$green}, #{theme-dark.$green});
  --modernflux-danger: light-dark(#{theme-light.$red}, #{theme-dark.$red});
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
        .replace(/\.css(?=\b)/, pc.dim(".css")),
    )} ${sizeFormat.format(byteLength)}`,
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

for (const variantDark of constants.catppuccin.variants.filter((v) => v !== "latte")) {
  for (const accent of constants.catppuccin.accents) {
    const dest = join("dist", "catppuccin", `system-${variantDark}`);
    await mkdir(dest, { recursive: true });

    const { css } = sassCompiler.compileString(ctpLightDarkTemplate({ variantLight: "latte", variantDark, accent }), {
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

for (const accent of constants.flexoki.accents) {
  const dest = join("dist", "flexoki", `system`);
  await mkdir(dest, { recursive: true });

  const { css } = sassCompiler.compileString(
    flexokiLightDarkTemplate({ variantLight: "light", variantDark: "dark", accent }),
    {
      loadPaths: ["src"],
    },
  );

  await writeFileWithLog(join(dest, `${accent}.css`), css);
  await writeFileWithLog(join(dest, `${accent}.min.css`), minify(css));
}

await cp("public", "dist", { recursive: true });
