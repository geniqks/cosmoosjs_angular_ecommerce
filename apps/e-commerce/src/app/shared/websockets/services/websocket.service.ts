import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class WebsocketService {
  private socket = new WebSocket('ws://localhost:3000/ws');
  private _messages = new ReplaySubject<unknown>(1);

  constructor() {
    this.socket.addEventListener("message", (event) => {
      if (event.data === 'false') {
        this._messages.next(false);
      } else {
        this._messages.next(event.data);
      }
    });
  }

  public get messages() {
    return this._messages.asObservable();
  }

  public send<T extends Object>(message: T) {
    this.socket.send(JSON.stringify(message));
  }
}