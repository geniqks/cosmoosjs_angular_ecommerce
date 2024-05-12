import { LoggerService } from "@cosmoosjs/core";
import { Server } from "@cosmoosjs/hono-openapi";
import { createBunWebSocket } from 'hono/bun';
import type { WSMessageReceive } from "hono/ws";
import { inject, injectable } from "inversify";

export const { upgradeWebSocket, websocket } = createBunWebSocket()

export interface SocketEvent {
  event: string,
  callback: (data: ReceviedMessage) => any
};

interface ReceviedMessage {
  event: string,
  data: unknown
}

@injectable()
export class SocketProvider {

  private _events: SocketEvent[] = [];

  constructor(
    @inject(Server) private readonly server: Server,
    @inject(Server) private readonly loggerService: LoggerService
  ) { }

  /**
   * @param newEvent event name
   * @param initiator Class that initiates the event
   */
  public addEvent(newEvent: SocketEvent) {
    const hasEvent = this._events.find(e => e.event === newEvent.event);
    if (hasEvent) {
      this.loggerService.pino.warn(`Event ${newEvent} already exists`);
      return;
    }
    this._events.push(newEvent);
  }

  private async triggerEvent(event: WSMessageReceive): Promise<unknown> {
    try {
      const data = JSON.parse(event.toString());
      if (data) {
        const hasEvent = this._events.find(e => e.event === data.event);
        if (hasEvent) {
          return await hasEvent.callback(data);
        } else {
          return 'Event not found';
        }
      }
    } catch (error) {
      return 'An error occurred while processing the event';
    }
  }

  public initSocket() {
    this.server.hono.get(
      '/ws',
      upgradeWebSocket(() => {
        return {
          /**
           * an event should always 
           */
          onMessage: async (event, ws) => {
            const response = await this.triggerEvent(event.data);
            if (response || response === false) {
              ws.send(JSON.stringify(response));
            }
          },
        }
      })
    )
  }
}