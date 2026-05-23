import { env } from 'node:process';

export function getAPIKey(cloudflareEnv: Env) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   * Cloudflare bindings (from .dev.vars) take priority over process.env.
   */
  return cloudflareEnv.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
}

export function getQiaApiKey(cloudflareEnv: Env): string | null {
  const cfValue = (cloudflareEnv as Record<string, string>).QIA_API_KEY;
  const envValue = (env as Record<string, string | undefined>).QIA_API_KEY;

  return cfValue || envValue || null;
}

export function getQiaModel(cloudflareEnv: Env): string {
  const cfValue = (cloudflareEnv as Record<string, string>).QIA_MODEL;
  const envValue = (env as Record<string, string | undefined>).QIA_MODEL;

  return cfValue || envValue || 'claude-sonnet-4-6';
}
