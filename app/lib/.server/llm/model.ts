import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

function createQiaFetch(apiKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(init?.headers);

    if (headers.has('x-api-key')) {
      headers.set('Authorization', `Bearer ${apiKey}`);
      headers.delete('x-api-key');
    }

    return fetch(input, { ...init, headers });
  };
}

const QIA_BASE_URL = 'https://api.lk888.ai/api/v1';

export function getAnthropicModel(apiKey: string) {
  const anthropic = createAnthropic({ apiKey });
  return anthropic('claude-sonnet-4-6');
}

export function getQiaModel(apiKey: string, modelName: string) {
  const anthropic = createAnthropic({
    apiKey,
    baseURL: QIA_BASE_URL,
    fetch: createQiaFetch(apiKey),
  });

  return anthropic(modelName);
}

export function getQiaOpenAIModel(apiKey: string, modelName: string) {
  const openai = createOpenAI({
    apiKey,
    baseURL: QIA_BASE_URL,
    fetch: createQiaFetch(apiKey),
  });

  return openai(modelName);
}
