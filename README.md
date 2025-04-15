# Modernflux

**Last updated: March 8, 2025**

A modern look and feel for [Miniflux](https://miniflux.app/), with beautiful color schemes based on [Catppuccin](https://catppuccin.ryanccn.dev/) and [Flexoki](https://stephango.com/flexoki).

![Demo](/.github/demo.png)

## Installation

Currently, Modernflux has two color schemes available: Catppuccin and Flexoki. Each has different choices of variant and accent color:

| Color scheme | Variants                                | Accent colors                                                                                                                        |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Catppuccin   | `latte`, `frappe`, `macchiato`, `mocha` | `rosewater`, `flamingo`, `pink`, `mauve`, `red`, `maroon`, `peach`, `yellow`, `green`, `teal`, `sky`, `sapphire`, `blue`, `lavender` |
| Flexoki      | `light`, `dark`                         | `red`, `orange`, `yellow`, `green`, `cyan`, `blue`, `purple`, `magenta`                                                              |

### CSS `@import`

Since [Miniflux 2.2.2](https://github.com/miniflux/v2/releases/tag/2.2.2), Miniflux has provided a setting for customizing the Content Security Policy by allowlisting specific domains for loading styles and fonts.

Add this to the **Custom CSS** field (and replace the placeholders with your color choices):

```css
@import url("https://modernflux.ryanccn.dev/base.min.css");
@import url("https://modernflux.ryanccn.dev/{color_scheme}/{variant}/{accent_color}.min.css");
```

And then add `modernflux.ryanccn.dev` to the **External font hosts** field. Update your settings, and you should see your brand new modern-looking Miniflux!

### Manual

If you don't want to allowlist Modernflux's domain or want it to update on your own schedule, manually copying the CSS also works!

Fetch `https://modernflux.ryanccn.dev/base.css` and paste its contents into the **Custom CSS** field; this includes most of Modernflux's styles. Then, for your specific color choices, paste the contents of `https://modernflux.ryanccn.dev/{color_scheme}/{variant}/{accent_color}.css` behind the base styles you pasted before.
