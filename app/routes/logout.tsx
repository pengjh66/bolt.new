import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { clearSessionCookieHeader } from '~/lib/.server/auth';

export async function action() {
  return redirect('/login', {
    headers: { 'Set-Cookie': clearSessionCookieHeader() },
  });
}

export async function loader() {
  return redirect('/login', {
    headers: { 'Set-Cookie': clearSessionCookieHeader() },
  });
}
