import { createAnthropic } from '@ai-sdk/anthropic';

export function getAnthropicModel(apiKey: string) {
  const anthropic = createAnthropic({
    apiKey,
  });

  return anthropic('claude-sonnet-4-6');
}

export function getQiaModel(apiKey: string, modelName: string) {
  const qiaFetch: typeof fetch = (input, init) => {
    const headers = new Headers(init?.headers);

    if (headers.has('x-api-key')) {
      headers.set('Authorization', `Bearer ${apiKey}`);
      headers.delete('x-api-key');
    }

    return fetch(input, { ...init, headers });
  };

  const anthropic = createAnthropic({
    apiKey,
    baseURL: 'https://api.lk888.ai/api/v1',
    fetch: qiaFetch,
  });

  return anthropic(modelName);
}
