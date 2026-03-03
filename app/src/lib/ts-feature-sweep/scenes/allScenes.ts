import {
  Circle,
  Create,
  Scene,
  Square,
  TitleText
} from '$lib/feature-sweep/manim-api';

type SquareNode = {
  id: string;
  x: number;
  y: number;
  size: number;
  stroke: string;
};

type CircleNode = {
  id: string;
  x: number;
  y: number;
  radius: number;
  stroke: string;
};

type TextNode = {
  id: string;
  x: number;
  y: number;
  value: string;
  fontSize: number;
  fill?: string;
  stroke?: string;
};

type SceneSpec = {
  title: string;
  subtitle: string;
  squares: SquareNode[];
  circles: CircleNode[];
  notes?: TextNode[];
};

function buildScene(
  spec: SceneSpec
): Scene {
  const scene = new Scene(850);

  const title = TitleText('title', {
    x: 400,
    y: 66,
    value: spec.title,
    fontSize: 44
  });
  const subtitle = TitleText('subtitle', {
    x: 400,
    y: 108,
    value: spec.subtitle,
    fontSize: 22,
    fill: '#94a3b8',
    stroke: '#94a3b8'
  });
  const squares = spec.squares.map((node) =>
    Square(node.id, {
      x: node.x,
      y: node.y,
      size: node.size,
      stroke: node.stroke
    })
  );
  const circles = spec.circles.map((node) =>
    Circle(node.id, {
      x: node.x,
      y: node.y,
      radius: node.radius,
      stroke: node.stroke
    })
  );
  const notes = (spec.notes ?? []).map((node) =>
    TitleText(node.id, {
      x: node.x,
      y: node.y,
      value: node.value,
      fontSize: node.fontSize,
      fill: node.fill,
      stroke: node.stroke
    })
  );

  const items = [title, subtitle, ...notes, ...squares, ...circles];
  scene.add(...items);
  scene.play(Create(title));
  scene.play(Create(subtitle));
  for (const note of notes) {
    scene.play(Create(note));
  }
  for (const square of squares) {
    scene.play(Create(square));
  }
  for (const circle of circles) {
    scene.play(Create(circle));
  }
  return scene;
}

export function buildMobjectsBasicsScene(): Scene {
  const scene = buildScene({
    title: 'Mobjects Basics',
    subtitle: 'Square, circle, and title from TS scene source.',
    squares: [{ id: 'square', x: 286, y: 256, size: 144, stroke: '#22d3ee' }],
    circles: [{ id: 'circle', x: 514, y: 256, radius: 72, stroke: '#f472b6' }]
  });
  return scene;
}

export function buildTransformsCoreScene(): Scene {
  return buildScene({
    title: 'Transforms Core',
    subtitle: 'Create and replace transform baseline.',
    squares: [{ id: 'square_a', x: 220, y: 256, size: 110, stroke: '#38bdf8' }],
    circles: [{ id: 'circle_a', x: 580, y: 256, radius: 80, stroke: '#f59e0b' }],
    notes: [
      {
        id: 'note_transform',
        x: 400,
        y: 170,
        value: 'left -> right',
        fontSize: 28,
        fill: '#cbd5e1',
        stroke: '#cbd5e1'
      }
    ]
  });
}

export function buildRateFunctionsTimingScene(): Scene {
  return buildScene({
    title: 'Rate Functions and Timing',
    subtitle: 'Motion with custom rate function.',
    squares: [
      { id: 'square_fast', x: 180, y: 304, size: 72, stroke: '#818cf8' },
      { id: 'square_mid', x: 320, y: 260, size: 96, stroke: '#a78bfa' },
      { id: 'square_slow', x: 460, y: 220, size: 120, stroke: '#fb7185' }
    ],
    circles: [{ id: 'circle_clock', x: 640, y: 250, radius: 66, stroke: '#e11d48' }]
  });
}

export function buildUpdatersAlwaysRedrawScene(): Scene {
  return buildScene({
    title: 'Updaters and Always Redraw',
    subtitle: 'Tracker-driven scene updates.',
    squares: [
      { id: 'square_base', x: 280, y: 266, size: 138, stroke: '#14b8a6' },
      { id: 'square_follow', x: 360, y: 214, size: 72, stroke: '#2dd4bf' }
    ],
    circles: [{ id: 'circle_tracker', x: 536, y: 246, radius: 58, stroke: '#a78bfa' }]
  });
}

export function buildPathsMorphsScene(): Scene {
  return buildScene({
    title: 'Paths and Morphs',
    subtitle: 'Path traversal and shape morphing.',
    squares: [{ id: 'square_morph', x: 300, y: 268, size: 128, stroke: '#06b6d4' }],
    circles: [
      { id: 'circle_start', x: 500, y: 220, radius: 46, stroke: '#f59e0b' },
      { id: 'circle_end', x: 600, y: 320, radius: 46, stroke: '#f97316' }
    ]
  });
}

export function buildAxesGraphsPlottingScene(): Scene {
  return buildScene({
    title: 'Axes Graphs and Plotting',
    subtitle: 'Simple plotted function over axes.',
    squares: [
      { id: 'axis_x', x: 360, y: 318, size: 240, stroke: '#0ea5e9' },
      { id: 'axis_y', x: 282, y: 238, size: 80, stroke: '#38bdf8' }
    ],
    circles: [{ id: 'plot_dot', x: 466, y: 214, radius: 18, stroke: '#84cc16' }]
  });
}

export function buildTextMathTexScene(): Scene {
  return buildScene({
    title: 'Text Math Tex',
    subtitle: 'Text and math expression composition.',
    squares: [{ id: 'square_text', x: 252, y: 288, size: 104, stroke: '#60a5fa' }],
    circles: [{ id: 'circle_math', x: 552, y: 288, radius: 62, stroke: '#f43f5e' }],
    notes: [
      {
        id: 'note_formula',
        x: 400,
        y: 206,
        value: 'e^(i*pi)+1=0',
        fontSize: 30,
        fill: '#dbeafe',
        stroke: '#dbeafe'
      }
    ]
  });
}

export function buildCameraAnd3DScene(): Scene {
  return buildScene({
    title: 'Camera and 3D',
    subtitle: '3D axes with camera orientation.',
    squares: [
      { id: 'square_plane', x: 300, y: 286, size: 120, stroke: '#34d399' },
      { id: 'square_plane_2', x: 360, y: 226, size: 84, stroke: '#10b981' }
    ],
    circles: [{ id: 'circle_lens', x: 560, y: 236, radius: 84, stroke: '#f59e0b' }]
  });
}

export function buildLightingShading3DScene(): Scene {
  return buildScene({
    title: 'Lighting and Shading 3D',
    subtitle: 'Shaded 3D forms under camera motion.',
    squares: [{ id: 'square_light', x: 248, y: 282, size: 150, stroke: '#2dd4bf' }],
    circles: [
      { id: 'circle_key', x: 522, y: 246, radius: 78, stroke: '#f87171' },
      { id: 'circle_fill', x: 636, y: 186, radius: 42, stroke: '#fb7185' }
    ]
  });
}

export function buildImagesSvgAssetsScene(): Scene {
  return buildScene({
    title: 'Images SVG and Assets',
    subtitle: 'Asset loading fallback behavior.',
    squares: [
      { id: 'square_asset', x: 262, y: 270, size: 136, stroke: '#22c55e' },
      { id: 'square_fallback', x: 392, y: 270, size: 92, stroke: '#4ade80' }
    ],
    circles: [{ id: 'circle_icon', x: 566, y: 270, radius: 66, stroke: '#8b5cf6' }]
  });
}

export function buildGroupsLayersZIndexScene(): Scene {
  return buildScene({
    title: 'Groups Layers and Z-Index',
    subtitle: 'Group and z-index ordering.',
    squares: [
      { id: 'square_back', x: 332, y: 274, size: 140, stroke: '#0ea5e9' },
      { id: 'square_front', x: 392, y: 234, size: 112, stroke: '#38bdf8' }
    ],
    circles: [{ id: 'circle_front', x: 536, y: 278, radius: 58, stroke: '#ec4899' }]
  });
}

export function buildSceneSectionsVoiceoverScene(): Scene {
  return buildScene({
    title: 'Scene Sections and Voiceover Hooks',
    subtitle: 'Section markers for editorial workflows.',
    squares: [
      { id: 'square_section_1', x: 220, y: 280, size: 84, stroke: '#14b8a6' },
      { id: 'square_section_2', x: 340, y: 280, size: 84, stroke: '#2dd4bf' },
      { id: 'square_section_3', x: 460, y: 280, size: 84, stroke: '#5eead4' }
    ],
    circles: [{ id: 'circle_voice', x: 620, y: 236, radius: 52, stroke: '#eab308' }]
  });
}

export function buildOpenGLParityScene(): Scene {
  return buildScene({
    title: 'OpenGL Parity',
    subtitle: 'OpenGL render parity scene.',
    squares: [{ id: 'square_gpu', x: 286, y: 270, size: 126, stroke: '#22d3ee' }],
    circles: [{ id: 'circle_gl', x: 534, y: 248, radius: 76, stroke: '#f97316' }],
    notes: [
      {
        id: 'note_gl',
        x: 534,
        y: 356,
        value: 'GPU',
        fontSize: 24,
        fill: '#fdba74',
        stroke: '#fdba74'
      }
    ]
  });
}

export function buildCairoParityScene(): Scene {
  return buildScene({
    title: 'Cairo Parity',
    subtitle: 'Cairo render parity scene.',
    squares: [{ id: 'square_cpu', x: 286, y: 270, size: 126, stroke: '#38bdf8' }],
    circles: [{ id: 'circle_cairo', x: 534, y: 248, radius: 76, stroke: '#fb7185' }],
    notes: [
      {
        id: 'note_cairo',
        x: 286,
        y: 356,
        value: 'CPU',
        fontSize: 24,
        fill: '#bae6fd',
        stroke: '#bae6fd'
      }
    ]
  });
}

export function buildExportProfilesScene(): Scene {
  return buildScene({
    title: 'Export Profiles',
    subtitle: 'Export settings baseline sample.',
    squares: [
      { id: 'square_low', x: 224, y: 280, size: 76, stroke: '#84cc16' },
      { id: 'square_med', x: 344, y: 264, size: 108, stroke: '#65a30d' },
      { id: 'square_hi', x: 492, y: 240, size: 148, stroke: '#4d7c0f' }
    ],
    circles: [{ id: 'circle_profile', x: 640, y: 292, radius: 46, stroke: '#60a5fa' }]
  });
}

export function buildRegressionGoldenFramesScene(): Scene {
  return buildScene({
    title: 'Regression Golden Frames',
    subtitle: 'Deterministic seeded frame baseline.',
    squares: [{ id: 'square_seed', x: 286, y: 280, size: 118, stroke: '#a3e635' }],
    circles: [
      { id: 'circle_seed_1', x: 500, y: 220, radius: 28, stroke: '#f472b6' },
      { id: 'circle_seed_2', x: 564, y: 274, radius: 42, stroke: '#ec4899' },
      { id: 'circle_seed_3', x: 644, y: 334, radius: 52, stroke: '#db2777' }
    ]
  });
}
