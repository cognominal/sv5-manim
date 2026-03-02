# Interactive manim for interactive literate programming (ILP)

TO BE FLESHED OUT

I want to weave different tools that embody different goals/paradigms for a new
take on literate programming. The use of codex gives to "the whip it up and
evolve it" Perl mentality another dimension.

Codex prolixity itself is a challenge for the intended goal. With codex, I feel
like being a greenhorn on a wild ride which brings me in [unexpected
places](https://www.youtube.com/watch?v=occaReba3vY)

When I discuss

## Literate programming

According to grokipedia Donald Knuth proposed [Literate
Programming](https://grokipedia.com/page/Literate_programming) as "a software
development paradigm that intertwines natural-language documentation with
executable source code within a single file, enabling programmers to author
works that read like literature for human comprehension while remaining
precisely structured for machine execution". "adoption remains niche due to its
emphasis on deliberate, documentation-heavy workflows over rapid prototyping."

### shortcoming : it produces pdf documents

Adapting his paper about dancing links is an obvious litmus for an ILP system.

## Manim

According to the "about" of Manim's [github
page](https://github.com/3b1b/manim) it is an
Animation engine for explanatory math videos.

## Sveltekit

[sveltekit](https://grokipedia.com/page/SvelteKit)

## How plans relate to this motivation

This file describes the grand scheme.

The `*PLAN*.md` files are experimention/implementation steps for that scheme,
in order:

1. [PLAN.md](PLAN.md)
2. [PLAN-DLX-ANIM.md](PLAN-DLX-ANIM.md)
3. [PLAN-FEATURE-SWEEP.md](PLAN-FEATURE-SWEEP.md)
4. [TIME-WRAP-PLAN.md](TIME-WRAP-PLAN.md)
5. [MP4-PLAN.md](MP4-PLAN.md)

We now have convinced ourselves that we can have feature parity with Manim.
We have added a slider to go at any place in an animation.

We need to think about the experiment in
<https://github.com/cognominal/manim.fork/tree/main/iManim-studio>
to merge it with what we have.
