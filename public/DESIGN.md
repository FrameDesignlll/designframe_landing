# Design System Document: The Editorial Portfolio

## 1. Overview & Creative North Star
### Creative North Star: "The Digital Curator"
This design system is a departure from the generic, grid-locked portfolio. It is built for a Graphic Designer who treats their digital presence as a high-end editorial gallery. The aesthetic is defined by "The Digital Curator"—a philosophy that emphasizes depth over decoration, and intentionality over density. 

We break the "template" look through a signature mix of high-contrast typography scales (the tension between bold Russian Cyrillic and delicate body text) and atmospheric layering. The layout avoids traditional vertical stacks, instead using overlapping elements and expansive breathing room to let work "breathe" against a near-black, infinite canvas.

---

## 2. Colors
Our palette focuses on a deep, immersive environment where color is used as a light source rather than a filler.

### The Palette (Material Convention)
*   **Surface Foundation:** `surface` (#10112a) acts as our near-black ink.
*   **The Primary Accent:** `primary` (#d0bcff) and `primary_container` (#a078ff) represent our purple-blue core. This is not just a color; it is a light source.
*   **The Tonal Scale:** We utilize `surface_container_lowest` (#0a0b25) through `surface_container_highest` (#32324e) to define depth without lines.

### Signature Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. We define boundaries through background color shifts. A transition from `surface` to `surface_container_low` is the only way to signal a new context.
*   **Surface Hierarchy:** Always treat the UI as stacked sheets. A project card should never be "on" the background; it should be a `surface_container_high` element sitting on a `surface` section.
*   **The "Glass & Gradient" Rule:** The Hero section must utilize a grainy gradient transitioning from `secondary_container` (#3808dd) to `primary`. This provides a "visual soul"—a tactile texture that feels organic and bespoke.
*   **Atmospheric Accents:** Use `secondary` (#c5c0ff) for interactive elements to provide a soft, ethereal glow that contrasts against the heavy dark surfaces.

---

## 3. Typography
Typography is our primary tool for "Russian Editorial" sophistication. We leverage the structural beauty of the Cyrillic alphabet.

*   **Display (Space Grotesk):** Large, bold, and authoritative. Used for names and section headers. Its geometric nature provides a "Brutalist" anchor to the soft gradients.
*   **Body (Manrope):** Clean, highly legible, and premium. Manrope’s modern proportions ensure that long-form Russian text feels airy and sophisticated.
*   **Contrast Hierarchy:** Use `display-lg` (3.5rem) immediately followed by `body-sm` (0.75rem) to create high-fashion tension. This "Extreme Scale" is what separates this system from a standard corporate site.

---

## 4. Elevation & Depth
We eschew traditional shadows for "Tonal Layering."

*   **The Layering Principle:** Depth is achieved by stacking. 
    *   *Level 0:* `surface` (The infinite canvas)
    *   *Level 1:* `surface_container_low` (Section backgrounds)
    *   *Level 2:* `surface_container_high` (Interactive cards)
*   **Ambient Shadows:** If an element must float (like a project preview), use an extra-diffused shadow: `color: on-surface (opacity 6%)`, `blur: 40px`, `y-offset: 20px`.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` at 15% opacity. It should be felt, not seen.
*   **Frosted Glass:** The Navigation bar must use `surface_bright` at 60% opacity with a `20px` backdrop-blur. This allows the purple hero gradient to bleed through as the user scrolls, maintaining the atmospheric immersion.

---

## 5. Components

### Buttons
*   **Primary:** A gradient-fill using `primary_container` to `secondary_container`. No border. `xl` roundedness (1.5rem).
*   **Secondary:** `surface_container_highest` background with `on_surface` text.
*   **Tertiary:** Transparent background, `primary` text, with a `0.5rem` underline on hover using the "Ghost Border" logic.

### Cards (Project Showcase)
*   **Style:** Forbid divider lines. Use `surface_container_high` for the card body. 
*   **Layout:** Based on the reference image, image containers within cards should have a `md` (0.75rem) corner radius. 
*   **Content:** Text within cards must use `title-lg` for project names and `label-md` for categories, pushed to the top right to create an asymmetrical, editorial feel.

### Chips (Skill Tags)
*   **Style:** `surface_container_lowest` background with a `ghost border`. 
*   **Typography:** `label-md` in `on_surface_variant`. Avoid high-contrast colors here; the chips should feel like a texture, not a distraction.

### Form Inputs
*   **Style:** Minimalist. No bounding box. Use a bottom-only border using `outline_variant` at 40%.
*   **Focus State:** The bottom border transforms into a `primary` color glow.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional element. If in doubt, add 32px more spacing between sections.
*   **DO** lean into the Cyrillic character shapes. Use `display-lg` for single words to create a "poster" effect.
*   **DO** use the `primary` accent sparingly—only for CTAs and the hero gradient—to keep it feeling premium.

### Don't
*   **DON'T** use 100% white (#FFFFFF) for body text. Use `on_surface_variant` (#cbc3d7) to reduce eye strain and maintain the "dark mode" mood.
*   **DON'T** use standard 4px corners. Stick to the `xl` (1.5rem) for large containers and `md` (0.75rem) for internal elements to maintain a "pill-like" soft aesthetic.
*   **DON'T** use vertical dividers. Let the alignment of text and the shift in surface tones define the hierarchy.