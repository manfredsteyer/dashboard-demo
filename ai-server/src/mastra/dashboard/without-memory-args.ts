import type { Agent, AgentExecutionOptionsBase } from '@mastra/core/agent';

type StreamMessages = Parameters<Agent['stream']>[0];
type StreamOptions = AgentExecutionOptionsBase<unknown> & { structuredOutput?: never };

/**
 * @ag-ui/mastra always passes memory args (thread, resource) to the
 * agent, which logs a warning when the agent has no memory. This proxy
 * removes them.
 *
 * Remove once @ag-ui/mastra omits memory args for agents without memory:
 * https://github.com/ag-ui-protocol/ag-ui/issues/3123
 */
export function withoutMemoryArgs(agent: Agent): Agent {
  return new Proxy(agent, {
    get(target, property) {
      if (property === 'stream') {
        return (messages: StreamMessages, options?: StreamOptions) =>
          target.stream(messages, { ...options, memory: undefined });
      }
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}
