<script lang="ts">
  import {
    Circle,
    Create,
    Scene,
    Square,
    TitleText,
    type Mobject,
  } from '$lib/feature-sweep/manim-api';

  const scene = new Scene(900);

  const title = TitleText('title', {
    x: 400,
    y: 90,
    value: 'Mobjects Basics',
  });

  const square = Square('square', {
    x: 220,
    y: 180,
    size: 130,
    stroke: '#4cc9f0',
  });

  const circle = Circle('circle', {
    x: 560,
    y: 245,
    radius: 67,
    stroke: '#f72585',
  });

  scene.add(title, square, circle);
  scene.play(Create(title));
  scene.play(Create(square));
  scene.play(Create(circle));

  const startById = new Map<string, number>();
  let acc = 0;
  for (const step of scene.timeline) {
    startById.set(step.targetId, acc);
    acc += step.runTimeMs;
  }

  function startMs(mobject: Mobject): number {
    return startById.get(mobject.id) ?? 0;
  }

  function durationMs(mobject: Mobject): number {
    return scene.timeline.find((step) => step.targetId === mobject.id)?.runTimeMs ?? 900;
  }

  function drawStyle(mobject: Mobject): string {
    const delay = `${startMs(mobject)}ms`;
    const duration = `${durationMs(mobject)}ms`;
    return `animation-delay:${delay};animation-duration:${duration};`;
  }
</script>

<section class="rounded-xl border border-slate-700 bg-slate-950/80 p-4 shadow-xl">
  <svg viewBox="0 0 800 460" role="img" aria-label="Mobjects basics scene" class="w-full">
    <rect x="0" y="0" width="800" height="460" fill="#020617" />

    <text
      x={title.x}
      y={title.y}
      text-anchor="middle"
      fill={title.fill}
      stroke={title.stroke}
      stroke-width="0.8"
      font-size={title.fontSize}
      font-family="ui-sans-serif, system-ui"
      class="draw-text"
      style={drawStyle(title)}
    >
      {title.text}
    </text>

    <rect
      x={square.x}
      y={square.y}
      width={square.size}
      height={square.size}
      rx="10"
      fill={square.fill}
      stroke={square.stroke}
      stroke-width={square.strokeWidth}
      class="draw-square"
      style={drawStyle(square)}
    />

    <circle
      cx={circle.x}
      cy={circle.y}
      r={circle.radius}
      fill={circle.fill}
      stroke={circle.stroke}
      stroke-width={circle.strokeWidth}
      class="draw-circle"
      style={drawStyle(circle)}
    />
  </svg>
</section>

<style>
  .draw-square,
  .draw-circle,
  .draw-text {
    opacity: 0;
    animation-name: progressive-appear;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
  }

  .draw-square {
    stroke-dasharray: 520;
    stroke-dashoffset: 520;
    animation-name: progressive-rect;
  }

  .draw-circle {
    stroke-dasharray: 421;
    stroke-dashoffset: 421;
    animation-name: progressive-circle;
  }

  @keyframes progressive-appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes progressive-rect {
    0% {
      opacity: 1;
      stroke-dashoffset: 520;
    }

    100% {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }

  @keyframes progressive-circle {
    0% {
      opacity: 1;
      stroke-dashoffset: 421;
    }

    100% {
      opacity: 1;
      stroke-dashoffset: 0;
    }
  }
</style>
