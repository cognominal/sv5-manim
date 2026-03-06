# imanin

We want to get to an interactive manim in svelte so that means using ts instead
of Python.
The idea is to support an API akin to the manim one, but in ts instead of
python.

## ts-sweep

Currently the API parity with manim CE is still very low.
The ts manim implementation is
[manim-api.ts](/Users/cog/mine/dlx_sv/app/src/lib/manim-api.ts).

And there is a lot of work to make the example in /ts-sweep work.
And some are dubious to be begin with.

But we have reached a step where incremental work becomes easier

### creating an UI for iterative improvement

We created a UI to show

- py side : the original .py file, the resulting .mp4 generated,
- ts side : the .ts file, the interactive scene (now just time warp with a
slider), the resulting .mp4 generated.
- the ts code mirror pane is writable so we can experiment without asking codex.

### getting something minimal

As a first stages, we try to get feature parity from some random .py manim files
codex lifted from somewhere or created out of whole cloth and the
ts imanim files created from that.

Note that with ts, the real deliverable will be a route in a sveltekit app.

## notebook system

Stage : TBD

We want a notebook system where nodes are versioned.
Node can depend on each other.
Manim goal is to generate .mp4 videos.


## disclaimer

I have zero knowledge of manim and very little of python. So I blindly
relied in codex to start with. Now I am trying to get some control and
agency.

In this repo we don't yet try to get a studio.

## A "real" imanim script

As a litmus test we want to port dlx_3x2_three_tiles.py and do an
interactive imanim presentation about dlx to solve it.

We use the [dlx](https://grokipedia.com/page/Knuth's_Algorithm_X) algorithm to
solve the pentomino [cuboid](https://pentomanim.vercel.app/cuboid-solver) in
[cognominal/pentomanim/webgl](https://github.com/cognominal/pentomanim/tree/master/webgl)

## Run from repo root

You can run the app scripts from the repository root:

- `bun run dev` (proxies to `app/`)
- `bun run build`
- `bun run check`
- `bun run test:e2e`

No special install/setup step is needed for the DLX animation route.

## Routes

- `/dlx`: DLX animation route (interactive 2x2 matrix preview).
- `/scenes/<script>/<scene>`: feature-sweep routes covering the broader
  Manim-to-Svelte scene set.

## Plans (chronological)

The historical implementation plans in this repo, in chronological order:

1. [PLAN.md](PLAN.md)
2. [PLAN-DLX-ANIM.md](PLAN-DLX-ANIM.md)
3. [PLAN-FEATURE-SWEEP.md](PLAN-FEATURE-SWEEP.md)
4. [TIME-WRAP-PLAN.md](TIME-WRAP-PLAN.md)
5. [MP4-PLAN.md](MP4-PLAN.md)
6. [PLAN-SVELTE-COMPONENT-MANIM-API.md](PLAN-SVELTE-COMPONENT-MANIM-API.md)

`PLAN-SVELTE-COMPONENT-MANIM-API.md` is an early draft for making the
Manim-like API and Svelte renderer responsive while preserving aspect
ratio.
