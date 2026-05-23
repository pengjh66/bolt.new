import { SignJWT, jwtVerify } from 'jose';
import { env } from 'node:process';

const SESSION_COOKIE_NAME = 'bolt_admin_session';
const JWT_EXPIRATION = '24h';

function getEnvValue(key: string, cloudflareEnv: Env): string {
  const cfValue = (cloudflareEnv as Record<string, string>)[key];
  const envValue = (env as Record<string, string | undefined>)[key];

  return cfValue || envValue || '';
}

function getJwtSecret(cloudflareEnv: Env): Uint8Array {
  const secret = getEnvValue('JWT_SECRET', cloudflareEnv);
  return new TextEncoder().encode(secret);
}

export function getAdminPassword(cloudflareEnv: Env): string {
  return getEnvValue('ADMIN_PASSWORD', cloudflareEnv);
}

export async function createSessionToken(cloudflareEnv: Env): Promise<string> {
  const secret = getJwtSecret(cloudflareEnv);

  return new SignJWT({ sub: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);
}

export async function verifySessionToken(token: string, cloudflareEnv: Env): Promise<boolean> {
  try {
    const secret = getJwtSecret(cloudflareEnv);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) {
    return null;
  }

  const cookies = parseCookies(cookieHeader);
  return cookies[SESSION_COOKIE_NAME] || null;
}

export function createSessionCookieHeader(token: string): string {
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  for (const cookie of cookieHeader.split(';')) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  }

  return cookies;
}
