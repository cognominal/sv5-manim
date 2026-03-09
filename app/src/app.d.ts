declare module 'virtual:py-sources' {
  export const pySourceModules: Record<string, string>
}

declare namespace App {
  interface Locals {
    user: import('$lib/types/auth').AuthUser | null
    sessionId: string | null
  }
}
