import { WorkOS } from '@workos-inc/node'
import fs from 'node:fs'
import path from 'node:path'

type WorkosKeyName =
  | 'WORKOS_API_KEY'
  | 'WORKOS_CLIENT_ID'
  | 'WORKOS_REDIRECT_URI'
  | 'WORKOS_COOKIE_PASSWORD'

type WorkosConfig = Record<WorkosKeyName, string>

function stripOuterQuotes(value: string): string {
  const trimmed = value.trim()
  const first = trimmed[0]
  const last = trimmed[trimmed.length - 1]
  if (
    trimmed.length >= 2 &&
    ((first === '"' && last === '"') || (first === "'" && last === "'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseWorkosKeysFile(text: string): Partial<WorkosConfig> {
  const out: Partial<WorkosConfig> = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    const value = stripOuterQuotes(line.slice(eq + 1))
    if (!value) continue

    if (
      key === 'WORKOS_API_KEY' ||
      key === 'WORKOS_CLIENT_ID' ||
      key === 'WORKOS_REDIRECT_URI' ||
      key === 'WORKOS_COOKIE_PASSWORD'
    ) {
      out[key] = value
    }
  }
  return out
}

function findWorkosKeysPath(): string | null {
  let dir = process.cwd()
  for (let i = 0; i < 6; i += 1) {
    const candidate = path.join(dir, 'workos-keys.txt')
    if (fs.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

function readWorkosKeysFile(): Partial<WorkosConfig> {
  const file = findWorkosKeysPath()
  if (!file) return {}
  try {
    return parseWorkosKeysFile(fs.readFileSync(file, 'utf8'))
  } catch {
    return {}
  }
}

const cachedFromFile = readWorkosKeysFile()

function requireKey(name: WorkosKeyName): string {
  const value = cachedFromFile[name] ?? process.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Missing ${name}. Set it in workos-keys.txt or the environment.`
    )
  }
  return value
}

export function workos(): WorkOS {
  return new WorkOS(requireKey('WORKOS_API_KEY'))
}

export function workosClientId(): string {
  return requireKey('WORKOS_CLIENT_ID')
}

export function workosRedirectUri(): string {
  return requireKey('WORKOS_REDIRECT_URI')
}

export function workosCookiePassword(): string {
  return requireKey('WORKOS_COOKIE_PASSWORD')
}
