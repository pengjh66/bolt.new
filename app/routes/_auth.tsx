import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Outlet } from '@remix-run/react';
import { getSessionTokenFromRequest, verifySessionToken } from '~/lib/.server/auth';

export async function loader({ request, context }: LoaderFunctionArgs) {
  const token = getSessionTokenFromRequest(request);

  if (!token || !(await verifySessionToken(token, context.cloudflare.env))) {
    const url = new URL(request.url);
    const redirectParam = url.pathname !== '/' ? `?redirect=${encodeURIComponent(url.pathname + url.search)}` : '';

    return redirect(`/login${redirectParam}`);
  }

  return null;
}

export default function AuthLayout() {
  return <Outlet />;
}
