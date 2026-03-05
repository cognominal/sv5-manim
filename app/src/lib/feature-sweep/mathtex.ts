import * as katexNs from 'katex';

function escapeHtml(raw: string): string {
  return raw
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderMathTexHtml(tex: string): string {
  const renderToString =
    (katexNs as { renderToString?: (v: string, o: unknown) => string })
      .renderToString ??
    (
      katexNs as {
        default?: { renderToString?: (v: string, o: unknown) => string };
      }
    ).default?.renderToString;

  if (!renderToString) {
    return `<span>${escapeHtml(tex)}</span>`;
  }

  try {
    return renderToString(tex, {
      throwOnError: false,
      displayMode: false,
      output: 'html',
      trust: false,
      strict: 'ignore',
    });
  } catch {
    return `<span>${escapeHtml(tex)}</span>`;
  }
}
