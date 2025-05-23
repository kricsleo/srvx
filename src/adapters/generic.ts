import type { Server, ServerHandler, ServerOptions } from "../types.ts";
import { wrapFetch } from "../_plugin.ts";
import { errorPlugin } from "../_error.ts";

export const FastURL: typeof globalThis.URL = URL;
export const FastResponse: typeof globalThis.Response = Response;

export function serve(options: ServerOptions): Server {
  return new GenericServer(options);
}

class GenericServer implements Server {
  readonly runtime = "generic";
  readonly options: ServerOptions;
  readonly fetch: ServerHandler;

  constructor(options: ServerOptions) {
    this.options = options;

    const fetchHandler = wrapFetch(this as unknown as Server, [errorPlugin]);

    this.fetch = (request: Request) => {
      return Promise.resolve(fetchHandler(request));
    };
  }

  serve(): void {}

  ready(): Promise<Server> {
    return Promise.resolve(this);
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}
