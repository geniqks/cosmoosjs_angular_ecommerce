import { Server } from "@cosmoosjs/hono-openapi";
import { createBunWebSocket } from 'hono/bun';
import { inject, injectable } from "inversify";

export const { upgradeWebSocket, websocket } = createBunWebSocket()

@injectable()
export class SocketProvider {

  constructor(@inject(Server) private readonly server: Server) { }

  public initSocket() {
    this.server.hono.get(
      '/ws',
      upgradeWebSocket(() => {
        return {
          onMessage: (event) => {
            console.log(event.data)
          },
        }
      })
    )
  }
}