import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIKey, getQiaApiKey, getQiaModel } from '~/lib/.server/llm/api-key';
import { getAnthropicModel, getQiaModel as getQiaAnthropicModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'> & {
  modelOverride?: string;
};

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  const qiaApiKey = getQiaApiKey(env);
  const modelName = options?.modelOverride || getQiaModel(env);

  const model = qiaApiKey
    ? getQiaAnthropicModel(qiaApiKey, modelName)
    : getAnthropicModel(getAPIKey(env));

  return _streamText({
    model,
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
