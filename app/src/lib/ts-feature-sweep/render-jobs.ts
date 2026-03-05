type RenderJobState = {
  inProgress: boolean;
  startedAtMs: number | null;
  finishedAtMs: number | null;
  lastError: string | null;
};

const tsRenderJobs = new Map<string, RenderJobState>();

function ensureJob(key: string): RenderJobState {
  const existing = tsRenderJobs.get(key);
  if (existing) return existing;
  const next: RenderJobState = {
    inProgress: false,
    startedAtMs: null,
    finishedAtMs: null,
    lastError: null,
  };
  tsRenderJobs.set(key, next);
  return next;
}

export function tsRenderJobKey(
  scriptId: string,
  sceneId: string,
  profile: string
): string {
  return `${scriptId}:${sceneId}:${profile}`;
}

export function getTsRenderJob(key: string): RenderJobState | null {
  return tsRenderJobs.get(key) ?? null;
}

export function startTsRenderJob(
  key: string,
  runner: () => Promise<void>
): { started: boolean } {
  const job = ensureJob(key);
  if (job.inProgress) return { started: false };

  job.inProgress = true;
  job.startedAtMs = Date.now();
  job.finishedAtMs = null;
  job.lastError = null;

  void runner()
    .catch((cause) => {
      job.lastError = cause instanceof Error ? cause.message : String(cause);
    })
    .finally(() => {
      job.inProgress = false;
      job.finishedAtMs = Date.now();
    });

  return { started: true };
}
