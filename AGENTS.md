# Agent Notes

## Project conventions

- Build and compile output must be warning-free.
- For source and markdown, keep lines under 80 characters when practical.
- Pages/components should stay at or under 300 lines when practical.
- Use Tailwind CSS for new UI components unless a file already follows a
  different established style.
- Keep `manim-api.ts` aligned with Manim Community Edition conventions and
  behavior whenever adding or changing primitives/animation APIs.

## Svelte 5 directives

- Use modern Svelte 5 patterns only.
- Treat Svelte 4 syntax as legacy tech debt; migrate it when touched.
- Use runes (`$state`, `$derived`, `$effect`) instead of `$:` blocks.
- Use `$props()` instead of `export let`.
- Prefer callback props over `createEventDispatcher`.
- Use event attributes (`onclick`, `oninput`, etc.), not `on:` directives.
- Do not introduce new `$$props` or `$$restProps` usage.
- Keep dependencies aligned with Svelte 5 and compatible Vite plugin
  versions.

## Validation expectations

- Run `bun run check` after Svelte/TypeScript changes.
- If tests are present, run the project test command before finishing.
- Fix warnings rather than deferring them.
- When a `.ts` scene is changed, regenerate/update its corresponding `.mp4`
  output before finishing.

## Generated artifacts

- Keep generated artifacts out of git (for example
  `media/ts-mp4/`, `media/py-mp4/`, and Python `__pycache__/`) via
  `.gitignore`.
