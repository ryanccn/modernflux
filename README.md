# Modernflux

A **modern look and feel** for [Miniflux](https://miniflux.app/), with beautiful color schemes based on [Catppuccin](https://catppuccin.ryanccn.dev/) and [Flexoki](https://stephango.com/flexoki).

![Demo](/.github/demo.png)

## Installation

> [!NOTE]
> Miniflux's default Content Security Policy does not allow external stylesheets to be loaded, so you'll have to copy in the stylesheets into your **Custom CSS** manually!

Currently, Modernflux has two color schemes available: Catppuccin and Flexoki. Each has different choices of variant and accent color:

| Color scheme | Variants                                | Accent colors                                                                                                                        |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Catppuccin   | `latte`, `frappe`, `macchiato`, `mocha` | `rosewater`, `flamingo`, `pink`, `mauve`, `red`, `maroon`, `peach`, `yellow`, `green`, `teal`, `sky`, `sapphire`, `blue`, `lavender` |
| Flexoki      | `light`, `dark`                         | `red`, `orange`, `yellow`, `green`, `cyan`, `blue`, `purple`, `magenta`                                                              |

First, copy the contents of `https://modernflux.ryanccn.dev/base.css` into the Custom CSS setting. This includes most of the styles that Modernflux uses. Then, for the color scheme/variant/accent color you chose, copy the contents of `https://modernflux.ryanccn.dev/{color scheme}/{variant}/{accent color}.css` and put them before the base styles you previous copied.

Update your settings, and you should see your brand new modern-looking Miniflux!
