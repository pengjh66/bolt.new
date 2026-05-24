import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIKey, getQiaApiKey, getQiaModel } from '~/lib/.server/llm/api-key';
import { getAnthropicModel, getQiaModel as getQiaAnthropicModel, getQiaOpenAIModel } from '~/lib/.server/llm/model';
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

function isAnthropicModel(modelName: string): boolean {
  return modelName.startsWith('claude-');
}

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  const qiaApiKey = getQiaApiKey(env);
  const modelName = options?.modelOverride || getQiaModel(env);

  if (!qiaApiKey) {
    const model = getAnthropicModel(getAPIKey(env));

    return _streamText({
      model,
      system: getSystemPrompt(),
      messages: convertToCoreMessages(messages),
      ...options,
    });
  }

  const model = isAnthropicModel(modelName)
    ? getQiaAnthropicModel(qiaApiKey, modelName)
    : getQiaOpenAIModel(qiaApiKey, modelName);

  return _streamText({
    model,
    system: getSystemPrompt(),
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
