import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import {
  createSessionCookieHeader,
  createSessionToken,
  getAdminPassword,
  getSessionTokenFromRequest,
  verifySessionToken,
} from '~/lib/.server/auth';

export const meta: MetaFunction = () => {
  return [{ title: 'Login - Bolt' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const token = getSessionTokenFromRequest(request);

  if (token && (await verifySessionToken(token, context.cloudflare.env))) {
    return redirect('/');
  }

  return json({});
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const password = formData.get('password');

  if (typeof password !== 'string' || password.length === 0) {
    return json({ error: 'Password is required' }, { status: 400 });
  }

  const adminPassword = getAdminPassword(context.cloudflare.env);

  if (!adminPassword) {
    return json({ error: 'Server misconfiguration: admin password not set' }, { status: 500 });
  }

  if (password !== adminPassword) {
    return json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createSessionToken(context.cloudflare.env);
  const redirectTo = new URL(request.url).searchParams.get('redirect') || '/';

  return redirect(redirectTo, {
    headers: { 'Set-Cookie': createSessionCookieHeader(token) },
  });
}

export default function Login() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="flex items-center justify-center min-h-screen bg-bolt-elements-background-depth-1">
      <div className="w-full max-w-sm mx-4">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="Bolt" className="w-16 h-16 mx-auto" />
          <h1 className="mt-4 text-2xl font-semibold text-bolt-elements-textPrimary">Admin Login</h1>
        </div>

        <div className="p-6 border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-2">
          <Form method="post" className="flex flex-col gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className="i-ph:lock text-lg text-bolt-elements-textTertiary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  autoFocus
                  className="w-full pl-10 pr-3 py-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary focus:outline-none focus:border-bolt-elements-borderColorActive transition-colors"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            {actionData?.error && (
              <p className="text-sm text-bolt-elements-button-danger-text">{actionData.error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center h-[38px] rounded-lg px-4 text-sm font-medium bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="i-svg-spinners:90-ring text-lg" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
