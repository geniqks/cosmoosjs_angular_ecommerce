import { Injectable } from '@angular/core';
import { ISocketMessage, ISocketReceivedMessage } from '@packages/types';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class WebsocketService {
  private socket = new WebSocket('ws://localhost:3000/ws');
  private _messages = new ReplaySubject<ISocketReceivedMessage>();

  constructor() {
    this.socket.addEventListener("message", (event) => {
      this._messages.next(JSON.parse(event.data));
    });
  }

  public get messages() {
    return this._messages.asObservable();
  }

  public send<T>(message: ISocketMessage<T>) {
    this.socket.send(JSON.stringify(message));
  }
}