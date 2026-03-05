type SvgRender = {
  svg: string;
  width: number;
  height: number;
};

type MathJaxRuntime = {
  document: {
    convert: (texInput: string, opts: Record<string, unknown>) => unknown;
  };
  adaptor: {
    outerHTML: (node: unknown) => string;
  };
};

let runtime: MathJaxRuntime | null = null;

function loadRuntime(): MathJaxRuntime | null {
  if (runtime) return runtime;

  try {
    const req = (globalThis as { require?: (id: string) => unknown }).require;
    if (!req) return null;

    const { mathjax } = req('mathjax-full/js/mathjax.js') as {
      mathjax: {
        document: (
          input: string,
          options: Record<string, unknown>
        ) => MathJaxRuntime['document'];
      };
    };
    const { TeX } = req('mathjax-full/js/input/tex.js') as {
      TeX: new (opts: Record<string, unknown>) => unknown;
    };
    const { SVG } = req('mathjax-full/js/output/svg.js') as {
      SVG: new (opts: Record<string, unknown>) => unknown;
    };
    const { liteAdaptor } = req(
      'mathjax-full/js/adaptors/liteAdaptor.js'
    ) as {
      liteAdaptor: () => MathJaxRuntime['adaptor'];
    };
    const { RegisterHTMLHandler } = req(
      'mathjax-full/js/handlers/html.js'
    ) as {
      RegisterHTMLHandler: (adaptor: MathJaxRuntime['adaptor']) => void;
    };

    const adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);
    const tex = new TeX({ packages: ['base', 'ams'] });
    const svg = new SVG({ fontCache: 'none' });
    const document = mathjax.document('', {
      InputJax: tex,
      OutputJax: svg,
    });

    runtime = { adaptor, document };
    return runtime;
  } catch {
    return null;
  }
}

function escapeHtml(raw: string): string {
  return raw
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function parseDims(svgText: string): { width: number; height: number } {
  const viewBox = svgText.match(/viewBox="([^"]+)"/);
  if (viewBox?.[1]) {
    const parts = viewBox[1].trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
      return { width: parts[2], height: parts[3] };
    }
  }
  return { width: 240, height: 80 };
}

export function renderMathTexSvg(texInput: string): SvgRender {
  const rt = loadRuntime();
  if (!rt) {
    return {
      svg:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">` +
        `<text x="10" y="50" fill="#e2e8f0" font-size="26">` +
        `${escapeHtml(texInput)}</text></svg>`,
      width: 240,
      height: 80,
    };
  }

  try {
    const node = rt.document.convert(texInput, {
      display: false,
      em: 16,
      ex: 8,
      containerWidth: 80 * 16,
    });
    const svgText = rt.adaptor.outerHTML(node);
    const dims = parseDims(svgText);
    return {
      svg: svgText,
      width: dims.width,
      height: dims.height,
    };
  } catch {
    return {
      svg:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80">` +
        `<text x="10" y="50" fill="#e2e8f0" font-size="26">` +
        `${escapeHtml(texInput)}</text></svg>`,
      width: 240,
      height: 80,
    };
  }
}
