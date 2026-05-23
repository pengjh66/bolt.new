import { env } from 'node:process';

export function getAPIKey(cloudflareEnv: Env) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  return env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
}

export function getQiaApiKey(cloudflareEnv: Env): string | null {
  const cfValue = (cloudflareEnv as Record<string, string>).QIA_API_KEY;
  return (env as Record<string, string | undefined>).QIA_API_KEY || cfValue || null;
}

export function getQiaModel(cloudflareEnv: Env): string {
  const cfValue = (cloudflareEnv as Record<string, string>).QIA_MODEL;
  return (env as Record<string, string | undefined>).QIA_MODEL || cfValue || 'claude-sonnet-4-6';
}
